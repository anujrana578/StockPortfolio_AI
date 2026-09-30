import sqlite3
import os
import bcrypt

DB_FILE = "finsight.db"

def migrate_database():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Inspect current columns in users table
    cursor.execute("PRAGMA table_info(users);")
    columns = [row[1] for row in cursor.fetchall()]
    print("Existing columns in users table:", columns)

    # 1. Create or ensure modern users schema
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users_v2 (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT,
        auth_provider TEXT DEFAULT 'local',
        google_id TEXT UNIQUE,
        profile_picture TEXT,
        is_email_verified INTEGER DEFAULT 0,
        role TEXT DEFAULT 'Portfolio Manager',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
    );
    """)

    # Check if we need to migrate from users to users_v2
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users';")
    has_old_users = cursor.fetchone() is not None

    if has_old_users:
        cursor.execute("SELECT * FROM users;")
        old_users = cursor.fetchall()
        
        # Check column names of old users
        cursor.execute("PRAGMA table_info(users);")
        old_cols = [r[1] for r in cursor.fetchall()]
        
        for u in old_users:
            u_dict = dict(zip(old_cols, u))
            user_id = u_dict.get('id', 'usr_1')
            username = u_dict.get('username', 'arpit')
            email = u_dict.get('email', 'arpit.finquant@finsight.io')
            raw_password = u_dict.get('password', u_dict.get('password_hash', 'arpit@980'))
            role = u_dict.get('role', 'Lead Quantitative Portfolio Manager')
            
            # Hash password if plaintext or missing
            if raw_password and not raw_password.startswith('$2b$'):
                pw_hash = bcrypt.hashpw(raw_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            else:
                pw_hash = raw_password

            cursor.execute("""
            INSERT OR IGNORE INTO users_v2 
            (id, username, email, password_hash, auth_provider, is_email_verified, role, created_at, updated_at)
            VALUES (?, ?, ?, ?, 'local', 1, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
            """, (user_id, username, email, pw_hash, role))

        # Replace old users table with users_v2
        cursor.execute("DROP TABLE users;")
        cursor.execute("ALTER TABLE users_v2 RENAME TO users;")
        print("Migrated existing users table safely to new schema with bcrypt hashing.")
    else:
        cursor.execute("ALTER TABLE users_v2 RENAME TO users;")

    # Add indexes for speed & uniqueness
    cursor.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username);")
    cursor.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);")
    cursor.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id) WHERE google_id IS NOT NULL;")

    conn.commit()
    conn.close()
    print("Database migration completed successfully.")

if __name__ == "__main__":
    migrate_database()
