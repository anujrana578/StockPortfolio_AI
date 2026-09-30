"""
FinSight CSV to SQLite / PostgreSQL Database Importer & API Generator
Run this script to load your CSV files directly into an SQL database.
"""

import sqlite3
import pandas as pd
import os
import glob

DB_FILE = "finsight.db"

def init_database():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # 1. Users
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        role TEXT
    );
    """)

    # Seed Default User
    cursor.execute("""
    INSERT OR IGNORE INTO users (id, username, password, full_name, email, role)
    VALUES ('usr_1', 'arpit', 'arpit@980', 'Arpit Sharma', 'arpit.finquant@finsight.io', 'Lead Portfolio Manager');
    """)

    # 2. Holdings
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS holdings (
        id TEXT PRIMARY KEY,
        symbol TEXT NOT NULL,
        name TEXT NOT NULL,
        category TEXT,
        shares REAL NOT NULL,
        avgBuyPrice REAL NOT NULL,
        currentPrice REAL NOT NULL,
        dailyChange REAL,
        dailyChangePercent REAL,
        allocationPercent REAL
    );
    """)

    # 3. Transactions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        symbol TEXT NOT NULL,
        name TEXT,
        type TEXT NOT NULL,
        shares REAL NOT NULL,
        price REAL NOT NULL,
        total REAL NOT NULL,
        date TEXT NOT NULL,
        status TEXT
    );
    """)

    # 4. Predictions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS predictions (
        symbol TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT,
        currentPrice REAL NOT NULL,
        predictedPrice30d REAL NOT NULL,
        predictedChangePercent REAL NOT NULL,
        confidenceScore INT NOT NULL,
        sentiment TEXT,
        supportLevel REAL,
        resistanceLevel REAL,
        targetHigh REAL,
        targetLow REAL,
        rsi REAL,
        peRatio REAL,
        macdSignal TEXT,
        volatility TEXT
    );
    """)

    # 5. Watchlist
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS watchlist (
        id TEXT PRIMARY KEY,
        symbol TEXT NOT NULL,
        name TEXT NOT NULL,
        category TEXT,
        currentPrice REAL NOT NULL,
        dailyChange REAL,
        dailyChangePercent REAL,
        week52High REAL,
        week52Low REAL,
        volume TEXT,
        marketCap TEXT,
        peRatio REAL,
        alertPrice REAL
    );
    """)

    conn.commit()
    print("Database tables initialized successfully.")
    return conn

def import_csv_files(conn):
    """
    Scans the current folder for any CSV files and automatically maps them to tables.
    """
    csv_files = glob.glob("*.csv")
    if not csv_files:
        print("No CSV files found in the project root directory yet.")
        print("Place your CSV files (e.g. holdings.csv, transactions.csv, predictions.csv, watchlist.csv) here and rerun.")
        return

    for file_path in csv_files:
        table_name = os.path.splitext(os.path.basename(file_path))[0].lower()
        print(f"Importing {file_path} into table '{table_name}'...")
        try:
            df = pd.read_csv(file_path)
            df.to_sql(table_name, conn, if_exists="replace", index=False)
            print(f"Successfully loaded {len(df)} rows into '{table_name}'.")
        except Exception as e:
            print(f"Error importing {file_path}: {e}")

if __name__ == "__main__":
    connection = init_database()
    import_csv_files(connection)
    connection.close()
