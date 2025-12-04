'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface WarParticipant {
  id: string;
  playerTag: string;
  playerName: string;
  townHallLevel: number;
  mapPosition: number;
  attacks: number;
  opponentAttacks: number;
}

interface Attack {
  id: string;
  attackerTag: string;
  defenderTag: string;
  stars: number;
  destructionPercent: number;
  order: number;
  isFresh: boolean;
}

interface War {
  id: string;
  opponentName: string;
  opponentTag: string;
  teamSize: number;
  startTime: string;
  endTime: string;
  state: string;
  result: string | null;
  teamStars: number;
  opponentStars: number;
  teamDestruction: number;
  opponentDestruction: number;
  participants: WarParticipant[];
  attacks: Attack[];
}

function getBaseStatus(attacks: Attack[], defenderTag: string) {
  const relevant = attacks.filter((a) => a.defenderTag === defenderTag);
  if (relevant.length === 0) {
    return { stars: 0, destruction: 0, color: 'bg-slate-200' };
  }
  const best = relevant.reduce(
    (best, curr) =>
      curr.stars > best.stars ||
      (curr.stars === best.stars && curr.destructionPercent > best.destructionPercent)
        ? curr
        : best,
    relevant[0],
  );
  let color = 'bg-yellow-100';
  if (best.stars === 3) color = 'bg-green-100';
  if (best.stars === 0) color = 'bg-red-100';
  return { stars: best.stars, destruction: best.destructionPercent, color };
}

export default function WarRoomPage() {
  const params = useParams<{ tenantId: string }>();
  const { user, loading: authLoading } = useAuth();
  const [war, setWar] = useState<War | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const tenantId = params?.tenantId as string;

  const fetchWar = async () => {
    if (!tenantId) return;
    try {
      const data = await api.get<War>(`/tenants/${tenantId}/wars/active`);
      setWar(data || null);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load war data');
      setWar(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!tenantId) return;

    fetchWar();
    const interval = setInterval(fetchWar, 20000); // poll every 20s
    return () => clearInterval(interval);
  }, [tenantId, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Loading War Room...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4">War Room</h1>
          <p className="text-red-600 mb-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!war) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">War Room</h1>
          <p className="text-gray-700 mb-2">No active war for this clan.</p>
        </div>
      </div>
    );
  }

  const enemyBases = [...war.participants]
    .sort((a, b) => a.mapPosition - b.mapPosition);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">War Room</h1>
            <p className="text-sm text-gray-600">
              VS {war.opponentName} ({war.opponentTag})
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 capitalize">
              {war.state}
            </span>
            {user && (
              <span className="text-sm text-gray-700">
                Logged in as <strong>{user.displayName || user.username}</strong>
              </span>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Stars</h2>
            <p className="text-2xl font-bold">
              {war.teamStars} <span className="text-gray-500 text-lg">vs</span> {war.opponentStars}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Destruction</h2>
            <p className="text-2xl font-bold">
              {war.teamDestruction.toFixed(1)}%
              <span className="text-gray-500 text-lg"> vs </span>
              {war.opponentDestruction.toFixed(1)}%
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Team Size</h2>
            <p className="text-2xl font-bold">{war.teamSize} vs {war.teamSize}</p>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb 4">
              <h2 className="font-semibold text-lg mb-2">Enemy Bases</h2>
              <p className="text-xs text-gray-500">Auto-refresh every 20 seconds</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {enemyBases.map((base) => {
                const status = getBaseStatus(war.attacks, base.playerTag);
                return (
                  <div
                    key={base.id}
                    className={`${status.color} rounded-lg p-3 border border-gray-200 flex flex-col gap-1`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-gray-600">
                        #{base.mapPosition}
                      </span>
                      <span className="text-xs text-gray-500">TH{base.townHallLevel}</span>
                    </div>
                    <div className="text-sm font-semibold truncate">{base.playerName}</div>
                    <div className="text-xs text-gray-700 mt-1">
                      Stars: <span className="font-bold">{status.stars}</span>
                    </div>
                    <div className="text-xs text-gray-700">
                      Destruction: <span className="font-bold">{status.destruction.toFixed(1)}%</span>
                    </div>
                    <div className="text-[10px] text-gray-500 mt-auto">
                      Attacked: {base.attacks}x | Hit by opp: {base.opponentAttacks}x
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold text-lg mb-2">Participants</h2>
            <div className="max-h-[480px] overflow-y-auto divide-y">
              {war.participants
                .slice()
                .sort((a, b) => a.mapPosition - b.mapPosition)
                .map((p) => (
                  <div key={p.id} className="py-2 text-sm flex justify-between items-center">
                    <div>
                      <div className="font-semibold truncate">{p.playerName}</div>
                      <div className="text-xs text-gray-500">
                        TH{p.townHallLevel} • #{p.mapPosition}
                      </div>
                    </div>
                    <div className="text-right text-xs">
                      <div>Attacks: {p.attacks}</div>
                      <div className={p.attacks === 0 ? 'text-red-600 font-semibold' : 'text-gray-500'}>
                        {p.attacks === 0 ? 'Pending' : 'Done'}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
