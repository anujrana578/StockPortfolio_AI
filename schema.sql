-- =========================================================
-- FinSight Financial & Portfolio Database Schema
-- Compatible with: PostgreSQL, MySQL, SQLite, Supabase
-- =========================================================

-- 1. Users & Authentication
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'Portfolio Manager',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Portfolio Holdings Table (For holdings.csv)
CREATE TABLE IF NOT EXISTS holdings (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    shares DECIMAL(12, 4) NOT NULL,
    avg_buy_price DECIMAL(12, 2) NOT NULL,
    current_price DECIMAL(12, 2) NOT NULL,
    daily_change DECIMAL(12, 2) DEFAULT 0.0,
    daily_change_percent DECIMAL(8, 4) DEFAULT 0.0,
    allocation_percent DECIMAL(8, 4) DEFAULT 0.0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Transactions Ledger (For transactions.csv)
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('BUY', 'SELL', 'DIVIDEND')),
    shares DECIMAL(12, 4) NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    total DECIMAL(14, 2) NOT NULL,
    transaction_date TIMESTAMP NOT NULL,
    status VARCHAR(30) DEFAULT 'Completed'
);

-- 4. AI Stock Predictions Table (For predictions.csv)
CREATE TABLE IF NOT EXISTS predictions (
    id VARCHAR(64) PRIMARY KEY,
    symbol VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    current_price DECIMAL(12, 2) NOT NULL,
    predicted_price_30d DECIMAL(12, 2) NOT NULL,
    predicted_change_percent DECIMAL(8, 4) NOT NULL,
    confidence_score INT NOT NULL CHECK (confidence_score BETWEEN 0 AND 100),
    sentiment VARCHAR(30) NOT NULL,
    support_level DECIMAL(12, 2),
    resistance_level DECIMAL(12, 2),
    target_high DECIMAL(12, 2),
    target_low DECIMAL(12, 2),
    rsi DECIMAL(6, 2),
    pe_ratio DECIMAL(8, 2),
    macd_signal VARCHAR(20),
    volatility VARCHAR(20),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Prediction Forecast Points (For chart series)
CREATE TABLE IF NOT EXISTS prediction_forecast_series (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(20) REFERENCES predictions(symbol) ON DELETE CASCADE,
    time_label VARCHAR(30) NOT NULL, -- e.g. 'Day -14', 'Today', 'Day +30'
    actual_price DECIMAL(12, 2),
    predicted_price DECIMAL(12, 2),
    lower_bound DECIMAL(12, 2),
    upper_bound DECIMAL(12, 2),
    step_order INT NOT NULL
);

-- 6. Watchlist Table (For watchlist.csv)
CREATE TABLE IF NOT EXISTS watchlist (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    current_price DECIMAL(12, 2) NOT NULL,
    daily_change DECIMAL(12, 2),
    daily_change_percent DECIMAL(8, 4),
    week_52_high DECIMAL(12, 2),
    week_52_low DECIMAL(12, 2),
    volume VARCHAR(30),
    market_cap VARCHAR(30),
    pe_ratio DECIMAL(8, 2),
    alert_price DECIMAL(12, 2)
);

-- =========================================================
-- SEED DEFAULT USER (arpit / arpit@980)
-- =========================================================
INSERT INTO users (id, username, password_hash, full_name, email, role)
VALUES (
    'usr_1', 
    'arpit', 
    'arpit@980', -- In production, use bcrypt hash
    'Arpit Sharma', 
    'arpit.finquant@finsight.io', 
    'Lead Quantitative Portfolio Manager'
) ON CONFLICT (username) DO NOTHING;

-- =========================================================
-- HOW TO IMPORT CSV FILES (PostgreSQL Syntax Example):
-- =========================================================
-- COPY holdings(id, user_id, symbol, name, category, shares, avg_buy_price, current_price, daily_change, daily_change_percent, allocation_percent)
-- FROM '/path/to/holdings.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY transactions(id, user_id, symbol, name, type, shares, price, total, transaction_date, status)
-- FROM '/path/to/transactions.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY predictions(id, symbol, name, category, current_price, predicted_price_30d, predicted_change_percent, confidence_score, sentiment, support_level, resistance_level, target_high, target_low, rsi, pe_ratio, macd_signal, volatility)
-- FROM '/path/to/predictions.csv'
-- DELIMITER ','
-- CSV HEADER;
