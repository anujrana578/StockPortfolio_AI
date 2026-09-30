import React, { useState } from 'react';
import { 
  Database, 
  Check, 
  Copy
} from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { mockHoldings, mockMarketIndices } from '../data/mockData';

export const DatabaseViewerModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [activeTable, setActiveTable] = useState<'holdings' | 'market_index_history' | 'users'>('holdings');
  const [copiedQuery, setCopiedQuery] = useState(false);

  if (!isOpen) return null;

  const handleCopySQL = (sql: string) => {
    navigator.clipboard.writeText(sql);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in text-neutral-100">
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-black font-bold flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                SQL Database Explorer <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-200 border border-neutral-700">finsight.db Connected</span>
              </h3>
              <p className="text-xs text-neutral-400">Live inspection of imported CSV tables and SQL records</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* Table Selector Pills */}
        <div className="px-6 py-3 border-b border-neutral-800 bg-neutral-950 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {[
              { id: 'holdings', name: 'holdings (27 Rows)', count: 27 },
              { id: 'market_index_history', name: 'market_index_history (GSPC, DJI, IXIC)', count: 3930 },
              { id: 'users', name: 'users (Admin: arpit)', count: 1 },
            ].map((tbl) => (
              <button
                key={tbl.id}
                onClick={() => setActiveTable(tbl.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTable === tbl.id
                    ? 'bg-white text-black'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {tbl.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleCopySQL(`SELECT * FROM ${activeTable};`)}
            className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            {copiedQuery ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Query</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {activeTable === 'holdings' && (
            <div className="space-y-3">
              <div className="border border-neutral-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs text-neutral-300">
                  <thead className="bg-neutral-900 text-neutral-400 uppercase font-semibold border-b border-neutral-800">
                    <tr>
                      <th className="py-3 px-4">Ticker</th>
                      <th className="py-3 px-4">Company Name</th>
                      <th className="py-3 px-4">Sector</th>
                      <th className="py-3 px-4 text-right">Quantity</th>
                      <th className="py-3 px-4 text-right">Close Price ($)</th>
                      <th className="py-3 px-4 text-right">Weight (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {mockHoldings.map((h) => (
                      <tr key={h.id} className="hover:bg-neutral-900/40">
                        <td className="py-3 px-4 font-bold text-white">{h.symbol}</td>
                        <td className="py-3 px-4">{h.name}</td>
                        <td className="py-3 px-4 text-neutral-400">{h.category}</td>
                        <td className="py-3 px-4 text-right font-semibold">{h.shares}</td>
                        <td className="py-3 px-4 text-right font-bold text-white">{formatCurrency(h.currentPrice)}</td>
                        <td className="py-3 px-4 text-right font-semibold text-white">{h.allocationPercent}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTable === 'market_index_history' && (
            <div className="space-y-3">
              <div className="border border-neutral-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs text-neutral-300">
                  <thead className="bg-neutral-900 text-neutral-400 uppercase font-semibold border-b border-neutral-800">
                    <tr>
                      <th className="py-3 px-4">Ticker</th>
                      <th className="py-3 px-4">Benchmark Index Name</th>
                      <th className="py-3 px-4 text-right">Latest Settlement</th>
                      <th className="py-3 px-4 text-right">Day Change (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {mockMarketIndices.slice(0, 3).map((idx) => (
                      <tr key={idx.symbol} className="hover:bg-neutral-900/40">
                        <td className="py-3 px-4 font-bold text-white">{idx.symbol}</td>
                        <td className="py-3 px-4 text-neutral-300">{idx.name}</td>
                        <td className="py-3 px-4 text-right font-bold text-white">{idx.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                        <td className="py-3 px-4 text-right font-semibold text-white font-mono">{formatPercent(idx.changePercent)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTable === 'users' && (
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2 text-xs">
              <div className="font-bold text-white text-sm">Authenticated User Record:</div>
              <pre className="p-3 rounded-xl bg-black border border-neutral-800 text-neutral-200 font-mono text-[11px] overflow-x-auto">
{`{
  "id": "usr_1",
  "username": "arpit",
  "password_hash": "arpit@980",
  "full_name": "Arpit Sharma",
  "email": "arpit.finquant@finsight.io",
  "role": "Lead Quantitative Portfolio Manager"
}`}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
