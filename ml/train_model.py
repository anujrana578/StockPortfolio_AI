import os
import json
import joblib
import pandas as pd
from xgboost import XGBRegressor
from sklearn.model_selection import TimeSeriesSplit
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import numpy as np

from feature_engineering import engineer_features

def evaluate_metrics(y_true, y_pred):
    mae = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    r2 = r2_score(y_true, y_pred)
    # Avoid division by zero
    mape = np.mean(np.abs((y_true - y_pred) / (y_true + 1e-8))) * 100
    return {
        "mae": round(float(mae), 2),
        "rmse": round(float(rmse), 2),
        "r2": round(float(r2), 4),
        "mape": round(float(mape), 2)
    }

def train_model(data_path, model_dir="ml/models", target_horizon=30):
    print(f"Loading data from {data_path}...")
    df = pd.read_csv(data_path)
    
    # Preprocessing
    df['Date'] = pd.to_datetime(df['Date'])
    df = df.sort_values('Date').reset_index(drop=True)
    
    print("Engineering features...")
    df = engineer_features(df)
    
    # Target variable: Price after `target_horizon` days
    df['target'] = df['Close'].shift(-target_horizon)
    
    # Drop NaNs created by shifting and rolling
    df_clean = df.dropna().copy()
    
    features = [
        'Open', 'High', 'Low', 'Close', 'Volume',
        'daily_return', 'return_5d', 'return_10d', 'return_20d',
        'SMA_7', 'SMA_20', 'SMA_50', 'EMA_12', 'EMA_26',
        'volatility_7d', 'volatility_20d',
        'RSI_14', 'MACD', 'MACD_signal', 'MACD_histogram',
        'BB_middle', 'BB_upper', 'BB_lower',
        'momentum_5', 'momentum_10', 'momentum_20'
    ]
    
    X = df_clean[features]
    y = df_clean['target']
    
    # Chronological Split (80% train, 20% test)
    split_idx = int(len(df_clean) * 0.8)
    X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
    y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]
    
    print("Training XGBoost Regressor...")
    model = XGBRegressor(n_estimators=100, learning_rate=0.1, random_state=42)
    model.fit(X_train, y_train)
    
    print("Evaluating model...")
    y_pred = model.predict(X_test)
    metrics = evaluate_metrics(y_test, y_pred)
    
    # Estimate standard deviation of residuals for Prediction Interval
    residuals = y_test - y_pred
    residual_std = np.std(residuals)
    
    # Calculate global error margins (e.g. 1.96 * std for 95% interval)
    pi_margin = 1.96 * residual_std
    
    print(f"Metrics: {metrics}")
    
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, "stock_model.pkl")
    metadata_path = os.path.join(model_dir, "metadata.json")
    
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")
    
    metadata = {
        "model": "XGBoost",
        "version": "1.0",
        "features": features,
        "metrics": metrics,
        "pi_margin": float(pi_margin),
        "trainedAt": pd.Timestamp.now().isoformat()
    }
    
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=4)
    print("Metadata saved.")
    
if __name__ == "__main__":
    # Use GSPC as the primary training data
    train_model("data/GSPC.csv")
