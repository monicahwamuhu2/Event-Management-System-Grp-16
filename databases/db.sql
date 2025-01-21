CREATE DATABASE event_management;

USE event_management;

-- Create the Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Unique user ID
    user_name VARCHAR(100) NOT NULL,    -- Username
    user_email VARCHAR(150) UNIQUE NOT NULL, -- User email (must be unique)
    password VARCHAR(255) NOT NULL,   -- Hashed password
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp when the user was created
);

-- Populate the users table
INSERT INTO users (user_name, user_email, password) 
VALUES 
('John Doe', 'john.doe@example.com', 'hashedpassword1'),
('Jane Smith', 'jane.smith@example.com', 'hashedpassword2'),
('Michael Brown', 'michael.brown@example.com', 'hashedpassword3'),
('Emily Davis', 'emily.davis@example.com', 'hashedpassword4'),
('David Wilson', 'david.wilson@example.com', 'hashedpassword5');

-- Create the Events table
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Unique event ID
    user_id INT NOT NULL,               -- Foreign key to the Users table
    event_title VARCHAR(200) NOT NULL,  -- Title of the event
    event_description TEXT,             -- Detailed description of the event
    event_start_date DATETIME NOT NULL,  -- Start date and time of the event
    event_end_date DATETIME NOT NULL,    -- End date and time of the event
    event_location VARCHAR(255) NOT NULL, -- Location of the event
    event_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00, -- Price for the event
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp for event creation
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Timestamp for last update
    image_url VARCHAR(255),           -- URL of the event image
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Cascade delete if user is deleted
);

-- Populate the events table
INSERT INTO events (user_id, event_title, event_description, event_start_date, event_end_date, event_location, event_price, image_url) 
VALUES 
(1, 'Tech Conference 2025', 'A conference for tech enthusiasts.', '2025-03-15 09:00:00', '2025-03-15 17:00:00', 'New York City', 50.00, ''https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIsAxKjvKu7Fgo8gl_M3A3lS8AV2TQc_Ecuw&s''),
(2, 'Music Festival', 'A fun music festival for all ages.', '2025-04-20 12:00:00', '2025-04-20 22:00:00', 'Los Angeles', 75.00, ''https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSracS428Jk0ZQFibCGuIVcaKUj9BuIh1Fv3Q&s''),
(3, 'Art Exhibition', 'A showcase of local art talent.', '2025-05-05 10:00:00', '2025-05-05 18:00:00', 'Chicago', 25.00, ''https://media.istockphoto.com/id/1218961153/photo/art-museum.jpg?s=612x612&w=0&k=20&c=9fK54fu1mjzFjDOSqg_jfrMy4Hkp8vsmImB7rLrbhJs=''),
(4, 'Startup Pitch Night', 'Pitch night for entrepreneurs and investors.', '2025-06-10 18:00:00', '2025-06-10 21:00:00', 'San Francisco', 100.00, ''https://media.licdn.com/dms/image/v2/C5612AQFkpIXMgHfeEA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1540265171294?e=2147483647&v=beta&t=U72fngSz6iWHKsGd8C6z9joKg4dCgcvxvT9aOZnxTV0''),
(5, 'Food Fair', 'A fair featuring international cuisines.', '2025-07-01 11:00:00', '2025-07-01 20:00:00', 'Houston', 30.00, ''https://media.istockphoto.com/id/1051006024/photo/happy-kids-eating-junk-food-at-an-amusement-park.jpg?s=612x612&w=0&k=20&c=of7zLl75fr_QWi3tuvZ-c2lMFffCfpB-pNzmNUO8Kwc='');

-- Create the Payments table
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Unique payment ID
    event_id INT NOT NULL,             -- Foreign key to the Events table
    participant_name VARCHAR(100) NOT NULL, -- Name of the participant
    participant_number VARCHAR(20) NOT NULL, -- Contact number of the participant
    amount DECIMAL(10, 2) NOT NULL,    -- Payment amount
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp for payment
    payment_method VARCHAR(20) ENUM('Credit Card', 'PayPal', 'M-Pesa', 'Bank Transfer') NOT NULL, -- Payment method
    transaction_id VARCHAR(100) UNIQUE NOT NULL, -- Unique transaction ID
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE -- Cascade delete if event is deleted
);

-- Populate the payments table
INSERT INTO payments (event_id, participant_name, participant_number, amount, payment_method, transaction_id) 
VALUES 
(6, 'Alice Johnson', '1234567890', 50.00, 'Credit Card', 'TXN12345'),
(7, 'Robert Lee', '9876543210', 50.00, 'PayPal', 'TXN12346'),
(8, 'Sophia Martinez', '1122334455', 75.00, 'M-Pesa', 'TXN12347'),
(9, 'James Anderson', '5566778899', 25.00, 'Bank Transfer', 'TXN12348'),
(10, 'Charlotte Wilson', '2233445566', 100.00, 'Credit Card', 'TXN12349');