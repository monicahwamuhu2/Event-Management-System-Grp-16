const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const axios = require('axios'); 
const moment = require('moment'); 
require('dotenv').config();


// Initialize express
const app = express();
const PORT = process.env.PORT || 5000;

// M-Pesa Configuration
// M-Pesa Configuration
const CONSUMER_KEY = process.env.CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;
const LIPA_NA_MPESA_PASSKEY = process.env.LIPA_NA_MPESA_PASSKEY;
const SHORTCODE = process.env.SHORTCODE;
const LIPA_NA_MPESA_ONLINE_ENDPOINT = process.env.LIPA_NA_MPESA_ONLINE_ENDPOINT;
const LIPA_NA_MPESA_QUERY_ENDPOINT = process.env.LIPA_NA_MPESA_QUERY_ENDPOINT;

// Middleware
app.use(
  cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test route to ensure server is running
app.get('/', (req, res) => {
  res.send('Event Management API running!');
});

// Generate M-Pesa access token
async function generateToken() {
  try {
    const auth = Buffer.from(CONSUMER_KEY + ':' + CONSUMER_SECRET).toString('base64');
    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: 'Basic ' + auth,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Failed to generate token');
  }
}

// User registration
app.post('/api/users/register', async (req, res) => {
  const { user_name, user_email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const [result] = await db.query(
      'INSERT INTO users (user_name, user_email, password) VALUES (?, ?, ?)',
      [user_name, user_email, hashedPassword]
    );
    res.status(201).json({ message: 'User registered successfully!', userId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user.', details: error.message });
  }
});

// User login
app.post('/api/users/login', async (req, res) => {
  const { user_email, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE user_email = ?', [user_email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.user_name,
        email: user.user_email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to log in', details: error.message });
  }
});

// Fetch all events
app.get('/api/events', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM events');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events.', details: error.message });
  }
});

// Fetch event details
app.get('/api/events/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM events WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event details.', details: error.message });
  }
});

// Create new event
app.post('/api/events', async (req, res) => {
  const {
    user_id,
    event_title,
    event_description,
    event_start_date,
    event_end_date,
    event_location,
    event_price,
    image_url,
  } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO events (user_id, event_title, event_description, event_start_date, event_end_date, event_location, event_price, image_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, event_title, event_description, event_start_date, event_end_date, event_location, event_price, image_url]
    );
    res.status(201).json({ message: 'Event created successfully!', eventId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event.', details: error.message });
  }
});

// Callback URL for M-Pesa
app.post('/callback_url', (req, res) => {
  const data = req.body;
  const transactionStatus = data?.Body?.stkCallback?.ResultCode;

  console.log(data);

  if (transactionStatus === 0) {
    console.log("Payment successful");
  } else {
    console.log("Payment failed");
  }

  res.json({ ResultCode: 0, ResultDesc: "Success" });
});

// Verify payment
app.post('/payment/verify', async (req, res) => {
  try {
    const token = await generateToken();
    const { Password, CheckoutRequestID, Timestamp } = req.body;

    const payload = {
      BusinessShortCode: SHORTCODE,
      Password,
      Timestamp,
      CheckoutRequestID,
    };

    const response = await axios.post(LIPA_NA_MPESA_QUERY_ENDPOINT, payload, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: error.message });
  }
});

// Initiate STK Push
app.post('/payment', async (req, res) => {
  try {
    const token = await generateToken();
    const { phone_number, amount } = req.body;

    if (!phone_number || !amount) {
      return res.status(400).json({ error: "Phone number and amount are required" });
    }

    const timestamp = moment().format('YYYYMMDDHHmmss');
    const password = Buffer.from(SHORTCODE + LIPA_NA_MPESA_PASSKEY + timestamp).toString('base64');

    const payload = {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: "254704579252",
      PartyB: SHORTCODE,
      PhoneNumber: phone_number,
      CallBackURL: "https://mu-store-1.onrender.com/callback_url",
      AccountReference: "Unimall",
      TransactionDesc: "Payment for testing",
    };

    const response = await axios.post(LIPA_NA_MPESA_ONLINE_ENDPOINT, payload, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    });

    const responseData = {
      ...response.data,
      Password: password,
      Timestamp: timestamp,
    };

    res.json(responseData);
  } catch (error) {
    console.error('Error initiating payment:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
