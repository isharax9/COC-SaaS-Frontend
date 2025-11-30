'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

interface PlayerVerificationProps {
  onSuccess?: () => void;
}

export default function PlayerVerification({ onSuccess }: PlayerVerificationProps) {
  const [playerTag, setPlayerTag] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/users/me/players/link', {
        playerTag: playerTag.startsWith('#') ? playerTag : `#${playerTag}`,
        apiToken,
      });
      setSuccess('Player linked successfully!');
      setPlayerTag('');
      setApiToken('');
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to link player');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Link Your Clash of Clans Account</h2>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">How to get your API Token:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Open Clash of Clans</li>
          <li>Go to Settings</li>
          <li>Tap "More Settings"</li>
          <li>Copy your API Token</li>
        </ol>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="playerTag" className="block text-sm font-medium mb-2">
            Player Tag
          </label>
          <input
            id="playerTag"
            type="text"
            value={playerTag}
            onChange={(e) => setPlayerTag(e.target.value)}
            placeholder="#ABC123XYZ"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="apiToken" className="block text-sm font-medium mb-2">
            API Token
          </label>
          <input
            id="apiToken"
            type="text"
            value={apiToken}
            onChange={(e) => setApiToken(e.target.value)}
            placeholder="Your in-game API token"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {loading ? 'Verifying...' : 'Link Player'}
        </button>
      </form>
    </div>
  );
}