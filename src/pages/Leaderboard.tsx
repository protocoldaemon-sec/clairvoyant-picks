import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { leaderboardApi } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';

interface LeaderboardEntry {
  rank: number;
  wallet_address: string;
  total_profit: number;
  win_rate: number;
  total_trades: number;
}

interface MyRank {
  rank: number;
  total_profit: number;
}

export default function Leaderboard() {
  const { user, token } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<MyRank | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    
    try {
      const [lb, rank] = await Promise.all([
        leaderboardApi.get(20),
        token ? leaderboardApi.getMyRank(token).catch(() => null) : null,
      ]);
      
      console.log('Leaderboard response:', lb);
      console.log('My rank response:', rank);
      
      // Handle both array and object with entries
      const entries = Array.isArray(lb) ? lb : (lb as { entries?: LeaderboardEntry[] })?.entries || [];
      setLeaderboard(entries);
      setMyRank(rank as MyRank);
    } catch (e) {
      console.error('Failed to load leaderboard:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankBadge = (rank: number): string => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const shortenAddress = (address: string): string => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isCurrentUser = (walletAddress: string): boolean => {
    return !!user && user.wallet_address === walletAddress;
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">Leaderboard</h1>

        {/* My Rank */}
        {myRank && myRank.rank && (
          <Card className="bg-primary/10 border-primary/30 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl">{getRankBadge(myRank.rank)}</div>
                <div>
                  <p className="text-sm text-muted-foreground">Your Rank</p>
                  <p className="text-xl font-bold text-foreground">#{myRank.rank}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Profit</p>
                <p className={`text-xl font-bold ${myRank.total_profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {myRank.total_profit >= 0 ? '+' : ''}${myRank.total_profit.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Leaderboard Table */}
        {isLoading ? (
          <Card className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </Card>
        ) : leaderboard.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-muted-foreground">No traders on the leaderboard yet</p>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="text-left text-sm text-muted-foreground">
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Trader</th>
                  <th className="px-4 py-3 text-right">Total Profit</th>
                  <th className="px-4 py-3 text-right">Win Rate</th>
                  <th className="px-4 py-3 text-right">Trades</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leaderboard.map((entry) => (
                  <tr 
                    key={entry.rank} 
                    className={`transition-colors ${
                      isCurrentUser(entry.wallet_address) 
                        ? 'bg-primary/10 border-l-2 border-l-primary' 
                        : 'hover:bg-muted/30'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span className="text-xl">{getRankBadge(entry.rank)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-mono ${isCurrentUser(entry.wallet_address) ? 'text-primary font-semibold' : 'text-foreground'}`}>
                        {shortenAddress(entry.wallet_address)}
                        {isCurrentUser(entry.wallet_address) && <span className="ml-2 text-xs text-primary">(You)</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-semibold ${entry.total_profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {entry.total_profit >= 0 ? '+' : ''}${entry.total_profit.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-foreground">
                      {entry.win_rate > 1 ? entry.win_rate.toFixed(1) : (entry.win_rate * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {entry.total_trades}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
