import sqlite3
import os

DB_FILE = "finsight.db"

def build_database_from_dataset():
    if os.path.exists(DB_FILE):
        os.remove(DB_FILE)
        
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # 1. Users table
    cursor.execute("""
    CREATE TABLE users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        role TEXT
    );
    """)

    cursor.execute("""
    INSERT INTO users (id, username, password, full_name, email, role)
    VALUES ('usr_1', 'arpit', 'arpit@980', 'Arpit Sharma', 'arpit.finquant@finsight.io', 'Lead Quantitative Portfolio Manager');
    """)

    # 2. Holdings table
    cursor.execute("""
    CREATE TABLE holdings (
        ticker TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        quantity REAL NOT NULL,
        sector TEXT NOT NULL,
        close REAL NOT NULL,
        weight REAL NOT NULL,
        avg_buy_price REAL NOT NULL
    );
    """)

    holdings_data = [
        ('AAPL', 'Apple Inc.', 1, 'IT', 218.270004, 3.46, 185.50),
        ('ADAP', 'Adaptimmune Therapeutics', 1, 'Pharmaceuticals', 0.291, 0.005, 0.35),
        ('AGCO', 'AGCO Corporation', 1, 'Agriculture', 93.089996, 1.48, 88.20),
        ('BA', 'Boeing Co.', 2, 'Military Engineering', 178.110001, 2.82, 192.00),
        ('BG', 'Bunge Global SA', 4, 'Agriculture', 73.25, 1.16, 70.10),
        ('CALM', 'Cal-Maine Foods', 5, 'Agriculture', 89.199997, 1.41, 78.50),
        ('CAT', 'Caterpillar Inc.', 1, 'Engineering', 335.779999, 5.32, 310.00),
        ('CSCO', 'Cisco Systems', 5, 'IT', 60.299999, 0.96, 52.40),
        ('CVX', 'Chevron Corporation', 2, 'Natural Resources', 164.75, 2.61, 155.00),
        ('DDOG', 'Datadog Inc.', 5, 'IT', 105.029999, 1.67, 98.40),
        ('DE', 'Deere & Company', 4, 'Agriculture', 472.429993, 7.49, 412.00),
        ('GRWG', 'GrowGeneration Corp', 2, 'Agriculture', 1.27, 0.02, 1.45),
        ('HUM', 'Humana Inc.', 1, 'Healthcare', 266.170013, 4.22, 290.00),
        ('IBKR', 'Interactive Brokers Group', 1, 'Finance', 173.360001, 2.75, 142.50),
        ('IEX', 'IDEX Corporation', 5, 'Engineering', 181.910004, 2.88, 175.00),
        ('JPM', 'JPMorgan Chase & Co.', 5, 'Finance', 241.630005, 3.83, 210.00),
        ('KO', 'The Coca-Cola Company', 5, 'Food & Beverages', 68.669998, 1.09, 62.10),
        ('LMT', 'Lockheed Martin Corp', 5, 'Military Engineering', 439.700012, 6.97, 415.00),
        ('MS', 'Morgan Stanley', 1, 'Finance', 120.139999, 1.91, 105.50),
        ('MSCI', 'MSCI Inc.', 1, 'Finance', 562.559998, 8.92, 510.00),
        ('MSFT', 'Microsoft Corporation', 3, 'IT', 391.26001, 6.20, 360.00),
        ('NFLX', 'Netflix Inc.', 1, 'Entertainment', 960.289978, 15.23, 820.00),
        ('OSK', 'Oshkosh Corporation', 3, 'Engineering', 95.779999, 1.52, 91.00),
        ('PFE', 'Pfizer Inc.', 2, 'Pharmaceuticals', 26.280001, 0.42, 28.50),
        ('PG', 'Procter & Gamble Co.', 2, 'Consumer Goods', 166.690002, 2.64, 158.00),
        ('SPY', 'SPDR S&P 500 ETF', 3, 'Finance', 563.97998, 8.94, 520.00),
        ('TMUS', 'T-Mobile US Inc.', 5, 'Telecommunications', 255.839996, 4.06, 215.00)
    ]

    cursor.executemany("""
    INSERT INTO holdings (ticker, name, quantity, sector, close, weight, avg_buy_price)
    VALUES (?, ?, ?, ?, ?, ?, ?);
    """, holdings_data)

    # 3. Market Index Time Series Table
    cursor.execute("""
    CREATE TABLE market_index_history (
        date TEXT NOT NULL,
        ticker TEXT NOT NULL,
        open REAL NOT NULL,
        high REAL NOT NULL,
        low REAL NOT NULL,
        close REAL NOT NULL,
        adjusted REAL NOT NULL,
        returns REAL,
        volume INTEGER NOT NULL,
        PRIMARY KEY (date, ticker)
    );
    """)

    conn.commit()
    print("Database built and seeded successfully.")
    conn.close()

if __name__ == "__main__":
    build_database_from_dataset()
