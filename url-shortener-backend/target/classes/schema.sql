-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    approved BOOLEAN DEFAULT FALSE
);

-- Short URLs Table
CREATE TABLE short_url (
    id SERIAL PRIMARY KEY,
    short_code VARCHAR(20) UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER,
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Click Analytics Table
CREATE TABLE click_analytics (
    id SERIAL PRIMARY KEY,
    short_code VARCHAR(20) NOT NULL,
    ip_address VARCHAR(50),
    user_agent TEXT,
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
