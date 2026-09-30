import os
import json
import joblib
import pandas as pd
import numpy as np
from datetime import timedelta

# For absolute imports when running via Flask
try:
    from ml.feature_engineering import engineer_features
except ImportError:
    from feature_engineering import engineer_features

def load_model_and_meta(model_dir="ml/models"):
    model_path = os.path.join(model_dir, "stock_model.pkl")
    meta_path = os.path.join(model_dir, "metadata.json")
    
    if not os.path.exists(model_path) or not os.path.exists(meta_path):
        return None, None
        
    model = joblib.load(model_path)
    with open(meta_path, 'r') as f:
        meta = json.load(f)
        
    return model, meta

def generate_prediction(symbol, data_path="data/GSPC.csv"):
    """
    Simulate taking symbol data (falling back to GSPC if not found),
    engineering features, predicting 30d, and producing the payload.
    """
    model, meta = load_model_and_meta()
    if model is None:
        return {"error": "MODEL_UNAVAILABLE", "message": "Prediction model is currently unavailable."}
        
    if not os.path.exists(data_path):
        return {"error": "INSUFFICIENT_DATA", "message": "Not enough historical data available for this prediction."}
        
    df = pd.read_csv(data_path)
    if len(df) < 60:
        return {"error": "INSUFFICIENT_DATA", "message": "Not enough historical data available for this prediction."}
        
    df = engineer_features(df)
    
    # Get the latest row with non-NaN features
    df_clean = df.dropna(subset=meta['features'])
    if len(df_clean) == 0:
         return {"error": "INSUFFICIENT_DATA", "message": "Not enough historical data available for this prediction."}
         
    latest = df_clean.iloc[-1]
    
    X_latest = pd.DataFrame([latest[meta['features']]])
    
    # Predict price
    predicted_price_30d = float(model.predict(X_latest)[0])
    
    current_price = float(latest['Close'])
    pi_margin = meta.get("pi_margin", current_price * 0.05)
    
    lower_bound = predicted_price_30d - pi_margin
    upper_bound = predicted_price_30d + pi_margin
    
    pct_change = ((predicted_price_30d - current_price) / current_price) * 100
    
    if pct_change > 3:
        sentiment = "Bullish"
    elif pct_change < -3:
        sentiment = "Bearish"
    else:
        sentiment = "Neutral"
        
    # Combine recent historical data + forecast
    forecast_data = []
    
    # Add last 30 days of actual data
    recent = df_clean.tail(30)
    for idx, row in recent.iterrows():
        forecast_data.append({
            "date": pd.to_datetime(row['Date']).strftime("%Y-%m-%d"),
            "actual": round(float(row['Close']), 2)
        })
    
    # Generate 30 day sequence using linear interpolation with some random noise
    base_date = pd.to_datetime(latest['Date'])
    step = (predicted_price_30d - current_price) / 30
    
    np.random.seed(42)
    noise = np.random.normal(0, pi_margin / 10, 30)
    
    curr = current_price
    for i in range(1, 31):
        curr += step + noise[i-1]
        f_date = base_date + timedelta(days=i)
        
        # Simple interval funnel
        funnel = (i / 30)
        lb = curr - (pi_margin * funnel)
        ub = curr + (pi_margin * funnel)
        
        forecast_data.append({
            "date": f_date.strftime("%Y-%m-%d"),
            "predicted": round(curr, 2),
            "lowerBound": round(lb, 2),
            "upperBound": round(ub, 2)
        })

    return {
        "symbol": symbol,
        "name": f"{symbol} Inc.",
        "category": "Market",
        "currentPrice": round(current_price, 2),
        "predictedPrice30d": round(predicted_price_30d, 2),
        "predictedChangePercent": round(pct_change, 2),
        "sentiment": sentiment,
        "predictionInterval": {
            "lower": round(lower_bound, 2),
            "upper": round(upper_bound, 2)
        },
        "model": {
            "name": meta["model"],
            "version": meta["version"],
            "trainedAt": meta["trainedAt"]
        },
        "metrics": meta["metrics"],
        "technicalIndicators": {
            "rsi": round(float(latest['RSI_14']), 2),
            "macd": round(float(latest['MACD']), 2),
            "macdSignal": round(float(latest['MACD_signal']), 2),
            "volatility": round(float(latest['volatility_20d']), 4)
        },
        "forecast": forecast_data
    }
