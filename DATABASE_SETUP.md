# FinSight Database Integration Guide (CSV to SQL)

This guide explains how to connect your CSV datasets into a **SQL Database** (PostgreSQL, MySQL, SQLite, or Supabase) and connect it to your FinSight frontend.

---

## Step 1: SQL Schema & Table Structure

A production-ready database schema has been prepared for you in [`schema.sql`](file:///c:/Users/ASUS/OneDrive/Desktop/hcl%20project/schema.sql):

1. **`users`**: Investor authentication and profile details.
2. **`holdings`**: Portfolio assets, quantities, buy prices, current market values.
3. **`transactions`**: Ledger records of buys, sells, and dividends.
4. **`predictions`**: AI price targets, confidence intervals, RSI, and valuation metrics.
5. **`prediction_forecast_series`**: 30-day projection corridor data points.
6. **`watchlist`**: Tracked tickers with 52-week metrics and alerts.

---

## Step 2: Ingesting Your CSV Files into SQL

### Option A: Using the Automated Python Script ([`import_csv_to_sql.py`](file:///c:/Users/ASUS/OneDrive/Desktop/hcl%20project/import_csv_to_sql.py))

1. Copy your CSV files (`holdings.csv`, `transactions.csv`, `predictions.csv`, `watchlist.csv`) into this project folder.
2. Run the ingestion script:
   ```bash
   python import_csv_to_sql.py
   ```
   This will automatically initialize `finsight.db` (SQLite) and load all CSV rows into their respective tables.

---

### Option B: Native SQL Import Commands

#### **For PostgreSQL / Supabase:**
```sql
-- 1. Import Holdings
\copy holdings FROM 'holdings.csv' WITH (FORMAT csv, HEADER true);

-- 2. Import Transactions
\copy transactions FROM 'transactions.csv' WITH (FORMAT csv, HEADER true);

-- 3. Import AI Predictions
\copy predictions FROM 'predictions.csv' WITH (FORMAT csv, HEADER true);

-- 4. Import Watchlist
\copy watchlist FROM 'watchlist.csv' WITH (FORMAT csv, HEADER true);
```

#### **For MySQL:**
```sql
LOAD DATA LOCAL INFILE 'holdings.csv'
INTO TABLE holdings
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
```

---

## Step 3: Connecting SQL Database to FinSight Frontend

To serve your SQL data directly to the React application, choose one of these two setups:

### Setup 1: Supabase / PostgREST (Zero Backend Code)
1. Upload your schema and CSVs directly to [Supabase](https://supabase.com).
2. Install the client: `npm install @supabase/supabase-js`
3. Fetch data inside `src/data/api.ts`:
   ```ts
   import { createClient } from '@supabase/supabase-js';
   export const supabase = createClient('SUPABASE_URL', 'SUPABASE_ANON_KEY');

   export async function getHoldings() {
     const { data } = await supabase.from('holdings').select('*');
     return data;
   }
   ```

### Setup 2: Node.js / Express Backend
Create a small server file (`server.js`):
```js
import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';

const app = express();
app.use(cors());
const db = new sqlite3.Database('./finsight.db');

app.get('/api/holdings', (req, res) => {
  db.all('SELECT * FROM holdings', [], (err, rows) => {
    res.json(rows);
  });
});

app.listen(5000, () => console.log('API Server running on http://localhost:5000'));
```
