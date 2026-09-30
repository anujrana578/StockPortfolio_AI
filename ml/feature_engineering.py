import pandas as pd
import numpy as np

def calculate_rsi(series, period=14):
    delta = series.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
    rs = gain / loss
    return 100 - (100 / (1 + rs))

def calculate_macd(series, fast=12, slow=26, signal=9):
    exp1 = series.ewm(span=fast, adjust=False).mean()
    exp2 = series.ewm(span=slow, adjust=False).mean()
    macd = exp1 - exp2
    signal_line = macd.ewm(span=signal, adjust=False).mean()
    macd_hist = macd - signal_line
    return macd, signal_line, macd_hist

def calculate_bollinger_bands(series, window=20, num_std=2):
    rolling_mean = series.rolling(window=window).mean()
    rolling_std = series.rolling(window=window).std()
    upper_band = rolling_mean + (rolling_std * num_std)
    lower_band = rolling_mean - (rolling_std * num_std)
    return rolling_mean, upper_band, lower_band

def engineer_features(df):
    """
    Expects a DataFrame with at least Date, Open, High, Low, Close, Volume.
    Returns the DataFrame with additional features.
    """
    df = df.copy()
    
    # Ensure datetime and sorted
    if 'Date' in df.columns:
        df['Date'] = pd.to_datetime(df['Date'])
        df = df.sort_values('Date').reset_index(drop=True)
    
    # Price and Return features
    df['daily_return'] = df['Close'].pct_change()
    df['return_5d'] = df['Close'].pct_change(5)
    df['return_10d'] = df['Close'].pct_change(10)
    df['return_20d'] = df['Close'].pct_change(20)
    
    # Moving averages
    df['SMA_7'] = df['Close'].rolling(window=7).mean()
    df['SMA_20'] = df['Close'].rolling(window=20).mean()
    df['SMA_50'] = df['Close'].rolling(window=50).mean()
    df['EMA_12'] = df['Close'].ewm(span=12, adjust=False).mean()
    df['EMA_26'] = df['Close'].ewm(span=26, adjust=False).mean()
    
    # Volatility
    df['volatility_7d'] = df['daily_return'].rolling(window=7).std() * np.sqrt(252)
    df['volatility_20d'] = df['daily_return'].rolling(window=20).std() * np.sqrt(252)
    
    # RSI
    df['RSI_14'] = calculate_rsi(df['Close'], 14)
    
    # MACD
    macd, signal, hist = calculate_macd(df['Close'])
    df['MACD'] = macd
    df['MACD_signal'] = signal
    df['MACD_histogram'] = hist
    
    # Bollinger Bands
    bb_mid, bb_upper, bb_lower = calculate_bollinger_bands(df['Close'])
    df['BB_middle'] = bb_mid
    df['BB_upper'] = bb_upper
    df['BB_lower'] = bb_lower
    
    # Momentum
    df['momentum_5'] = df['Close'] - df['Close'].shift(5)
    df['momentum_10'] = df['Close'] - df['Close'].shift(10)
    df['momentum_20'] = df['Close'] - df['Close'].shift(20)
    
    return df
