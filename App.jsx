import React, { useState, useEffect } from 'react';
import { Trophy, RefreshCw, TrendingUp, Award } from 'lucide-react';
import Papa from 'papaparse';

// ========================================
// 🔧 CONFIGURATION - Edit these settings
// ========================================
const CONFIG = {
  csvPath: '/leaderboard.csv', // Change to your CSV path or URL
  autoRefresh: true,            // Enable/disable auto-refresh
  refreshInterval: 5000,        // Refresh interval in milliseconds (5000 = 5 seconds)
};
// ========================================

export default function LeaderboardDashboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadCSV = async () => {
    setError(null);

    try {
      const response = await fetch(CONFIG.csvPath);
      if (!response.ok) {
        throw new Error(`Failed to load CSV: ${response.statusText}`);
      }
      
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const processed = results.data
              .map((row, idx) => ({
                id: idx,
                name: (row.name || row.Name || row.player || row.Player || '').toString().trim(),
                score: parseFloat(row.score || row.Score || row.points || row.Points || 0),
                level: row.level || row.Level || row.rank || row.Rank || '-',
                wins: parseInt(row.wins || row.Wins || row.games || row.Games || 0)
              }))
              .filter(item => item.name)
              .sort((a, b) => b.score - a.score);
            
            setLeaderboardData(processed);
            setLastUpdated(new Date());
            setLoading(false);
          } catch (err) {
            setError('Error processing CSV data: ' + err.message);
            setLoading(false);
          }
        },
        error: (err) => {
          setError('Error parsing CSV: ' + err.message);
          setLoading(false);
        }
      });
    } catch (err) {
      setError('Error loading CSV file: ' + err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCSV();
    
    if (CONFIG.autoRefresh) {
      const interval = setInterval(() => {
        loadCSV();
      }, CONFIG.refreshInterval);

      return () => clearInterval(interval);
    }
  }, []);

  const getMedalColor = (index) => {
    switch(index) {
      case 0: return 'text-yellow-600';
      case 1: return 'text-gray-400';
      case 2: return 'text-amber-700';
      default: return 'text-gray-300';
    }
  };

  const getRankBadge = (index) => {
    if (index < 3) {
      return (
        <div className={`w-10 h-10 rounded-full ${index === 0 ? 'bg-yellow-50 border-2 border-yellow-600' : index === 1 ? 'bg-gray-50 border-2 border-gray-400' : 'bg-amber-50 border-2 border-amber-700'} flex items-center justify-center`}>
          <Trophy className={`w-5 h-5 ${getMedalColor(index)}`} />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center">
        <span className="text-sm font-semibold text-gray-600">{index + 1}</span>
      </div>
    );
  };

  const getRowStyle = (index) => {
    if (index < 3) return 'bg-red-50/30 hover:bg-red-50/50';
    if (index < 10) return 'bg-white hover:bg-gray-50';
    return 'bg-white hover:bg-gray-50';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-600 rounded flex items-center justify-center">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Performance Leaderboard</h1>
                <p className="text-sm text-gray-500 mt-0.5">Real-time rankings and metrics</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {lastUpdated && (
                <div className="text-right">
                  <p className="text-xs text-gray-500">Last updated</p>
                  <p className="text-sm font-medium text-gray-900">{lastUpdated.toLocaleTimeString()}</p>
                </div>
              )}
              <button
                onClick={loadCSV}
                className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                title="Refresh data"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm font-medium text-red-900">Error: {error}</p>
            <p className="text-xs text-red-700 mt-1">CSV Path: {CONFIG.csvPath}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && leaderboardData.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-block w-12 h-12 border-3 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 mt-4">Loading data...</p>
          </div>
        )}

        {/* Stats Cards */}
        {leaderboardData.length > 0 && (
          <>
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Participants</p>
                    <p className="text-3xl font-semibold text-gray-900 mt-2">{leaderboardData.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Top Score</p>
                    <p className="text-3xl font-semibold text-gray-900 mt-2">{leaderboardData[0]?.score.toLocaleString() || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Leader</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-2 truncate">{leaderboardData[0]?.name || 'N/A'}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Leaderboard Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Participant</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Level</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Wins</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {leaderboardData.map((player, index) => (
                      <tr key={player.id} className={`${getRowStyle(index)} transition-colors`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {getRankBadge(index)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{player.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {player.level}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {player.wins}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-lg font-bold text-gray-900">{player.score.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">points</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${error ? 'bg-red-600' : 'bg-green-600'}`}></div>
                <span>{CONFIG.autoRefresh ? `Auto-refresh enabled (${CONFIG.refreshInterval / 1000}s)` : 'Manual refresh mode'}</span>
              </div>
              <div>
                Showing {leaderboardData.length} {leaderboardData.length === 1 ? 'participant' : 'participants'}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
