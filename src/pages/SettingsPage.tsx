import React, { useState } from 'react';
import { 
  Shield, 
  Sliders, 
  Check, 
  Sparkles,
  Moon
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [modelType, setModelType] = useState('transformer');
  const [confidenceThreshold, setConfidenceThreshold] = useState(80);
  const [currency, setCurrency] = useState('USD');
  const [autoRebalance, setAutoRebalance] = useState(true);
  const [highRiskAlerts, setHighRiskAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl text-neutral-100">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">System Settings & Parameters</h2>
        <p className="text-xs text-neutral-400 mt-1">
          Adjust AI prediction thresholds, risk parameters and preferences.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-neutral-800">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700 text-white flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">AI Predictor Hyperparameters</h3>
            <p className="text-xs text-neutral-400">Configure machine learning forecasting sensitivity</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              Neural Forecasting Model Architecture
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'transformer', title: 'FinBERT Transformer', desc: 'Synthesizes historical CSVs + order books' },
                { id: 'lstm', title: 'Deep LSTM Network', desc: 'Optimized for high-frequency volatility' },
                { id: 'arima', title: 'ARIMA + GARCH Hybrid', desc: 'Statistical mean-reverting model' },
              ].map((model) => (
                <div
                  key={model.id}
                  onClick={() => setModelType(model.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    modelType === model.id
                      ? 'bg-neutral-900 border-white text-white font-bold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="text-sm text-white mb-1">{model.title}</div>
                  <div className="text-[11px] text-neutral-400 font-normal">{model.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold text-neutral-300 uppercase tracking-wider">
                Minimum AI Confidence Threshold
              </label>
              <span className="font-bold text-white">{confidenceThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
              className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-neutral-800">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700 text-white flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Risk Automation</h3>
            <p className="text-xs text-neutral-400">Manage risk controls</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800">
            <div>
              <div className="font-semibold text-sm text-white">Portfolio Allocation Rebalancing Alerts</div>
              <div className="text-xs text-neutral-400">Warn if any single asset exceeds 25% weight</div>
            </div>
            <input
              type="checkbox"
              checked={autoRebalance}
              onChange={(e) => setAutoRebalance(e.target.checked)}
              className="w-4 h-4 accent-white cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800">
            <div>
              <div className="font-semibold text-sm text-white">High Volatility Alarms</div>
              <div className="text-xs text-neutral-400">Notify instantly if drawdown exceeds threshold</div>
            </div>
            <input
              type="checkbox"
              checked={highRiskAlerts}
              onChange={(e) => setHighRiskAlerts(e.target.checked)}
              className="w-4 h-4 accent-white cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        {savedSuccess && (
          <span className="text-xs text-white font-semibold flex items-center gap-1.5">
            <Check className="w-4 h-4" /> Settings Saved
          </span>
        )}
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs lg:text-sm font-bold shadow-lg transition-all cursor-pointer"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
