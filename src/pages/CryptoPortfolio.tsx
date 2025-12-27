import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2, RefreshCw, ArrowLeft, Trash2 } from 'lucide-react';
import { API_URL } from '@/lib/config';
import { cn } from '@/lib/utils';

interface Position {
  id: string;
  name: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  entry_price: number;
  current_price: number;
  quantity: number;
  stop_loss: number;
  take_profit: number;
  pnl: number;
  pnl_pct: number;
  status: string;
  created_at: string;
}

interface Summary {
  total_pnl: number;
  open_positions: number;
  win_rate: number;
  winning_trades: number;
  losing_trades: number;
}

export default function CryptoPortfolio() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [isSelling, setIsSelling] = useState(false);
  const [sellError, setSellError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCount, setDeleteCount] = useState(0);


  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    await Promise.all([loadPositions(), loadSummary()]);
  };

  const loadPositions = async () => {
    const token = localStorage.getItem('token');
    if (!token) { setIsLoading(false); return; }
    setIsLoading(true);
    try {
      let url = `${API_URL}/crypto/positions`;
      if (statusFilter && statusFilter !== 'all') url += `?status=${statusFilter}`;
      const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) { setPositions(await res.json()); setSelectedIds(new Set()); }
    } catch (e) { console.error('Failed to load positions:', e); }
    finally { setIsLoading(false); }
  };

  const loadSummary = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/crypto/positions/summary`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setSummary(await res.json());
    } catch (e) { console.error('Failed to load summary:', e); }
  };

  useEffect(() => { loadPositions(); }, [statusFilter]);

  const openSellModal = (pos: Position) => { setSelectedPosition(pos); setSellError(''); setShowSellModal(true); };
  const closeSellModal = () => { setShowSellModal(false); setSelectedPosition(null); setSellError(''); };

  const confirmSell = async () => {
    if (!selectedPosition) return;
    setIsSelling(true); setSellError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/crypto/positions/${selectedPosition.id}/sell`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) { await loadData(); closeSellModal(); }
      else { const data = await res.json(); setSellError(data.detail || 'Failed to sell'); }
    } catch (e) { setSellError('Failed to sell position'); }
    finally { setIsSelling(false); }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const closedPositions = positions.filter(p => p.status !== 'OPEN');
  const isAllSelected = closedPositions.length > 0 && closedPositions.every(p => selectedIds.has(p.id));
  const isSomeSelected = selectedIds.size > 0;

  const toggleSelectAll = () => {
    if (isAllSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(closedPositions.map(p => p.id)));
  };

  const openDeleteModal = () => { if (selectedIds.size === 0) return; setDeleteCount(selectedIds.size); setShowDeleteModal(true); };
  const closeDeleteModal = () => { setShowDeleteModal(false); };
  const deletePosition = (id: string) => { setSelectedIds(new Set([id])); setDeleteCount(1); setShowDeleteModal(true); };

  const confirmDelete = async () => {
    if (selectedIds.size === 0) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      await Promise.all(Array.from(selectedIds).map(id => fetch(`${API_URL}/crypto/positions/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })));
      setSelectedIds(new Set()); await loadData(); closeDeleteModal();
    } catch (e) { console.error('Failed to delete positions:', e); }
    finally { setIsDeleting(false); }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-500/20 text-blue-500';
      case 'CLOSED': return 'bg-muted text-muted-foreground';
      case 'STOPPED': return 'bg-destructive/20 text-destructive';
      case 'TARGET': return 'bg-success/20 text-success';
      default: return 'bg-muted text-muted-foreground';
    }
  };


  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Crypto Portfolio</h1>
            <p className="text-muted-foreground text-sm">Track your manual trades</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="All Positions" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                <SelectItem value="OPEN">Open Only</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
                <SelectItem value="STOPPED">Stopped Out</SelectItem>
                <SelectItem value="TARGET">Target Hit</SelectItem>
              </SelectContent>
            </Select>
            {isSomeSelected && (
              <Button variant="destructive" size="sm" onClick={openDeleteModal} disabled={isDeleting}>
                {isDeleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                Delete ({selectedIds.size})
              </Button>
            )}
            <Button onClick={loadData} variant="secondary"><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
            <Link to="/crypto"><Button><ArrowLeft className="h-4 w-4 mr-2" />Back to Signals</Button></Link>
          </div>
        </div>

        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <p className="text-muted-foreground text-sm">Total P&L</p>
              <p className={cn('text-2xl font-bold', summary.total_pnl >= 0 ? 'text-success' : 'text-destructive')}>{summary.total_pnl >= 0 ? '+' : ''}${summary.total_pnl?.toFixed(2)}</p>
            </Card>
            <Card className="p-4"><p className="text-muted-foreground text-sm">Open Positions</p><p className="text-2xl font-bold text-foreground">{summary.open_positions}</p></Card>
            <Card className="p-4"><p className="text-muted-foreground text-sm">Win Rate</p><p className="text-2xl font-bold text-foreground">{summary.win_rate}%</p></Card>
            <Card className="p-4">
              <p className="text-muted-foreground text-sm">W / L</p>
              <p className="text-2xl font-bold"><span className="text-success">{summary.winning_trades}</span><span className="text-muted-foreground"> / </span><span className="text-destructive">{summary.losing_trades}</span></p>
            </Card>
          </div>
        )}

        {isLoading ? (
          <Card className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 text-primary animate-spin" /></Card>
        ) : positions.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-muted-foreground">No positions yet</p>
            <p className="text-sm text-muted-foreground mt-2">Add positions from the Crypto Signals page</p>
            <Link to="/crypto"><Button className="mt-4">Go to Signals</Button></Link>
          </Card>
        ) : (
          <Card className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-muted-foreground text-sm border-b border-border">
                  <th className="p-4 w-12"><Checkbox checked={isAllSelected} onCheckedChange={toggleSelectAll} /></th>
                  <th className="p-4">Asset</th><th className="p-4">Side</th><th className="p-4">Qty</th>
                  <th className="p-4">Entry Value</th><th className="p-4">Current Value</th><th className="p-4">P&L</th>
                  <th className="p-4">Status</th><th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((pos) => (
                  <tr key={pos.id} className={cn('border-b border-border/50 hover:bg-muted/30', selectedIds.has(pos.id) && 'bg-primary/5')}>
                    <td className="p-4">{pos.status !== 'OPEN' && <Checkbox checked={selectedIds.has(pos.id)} onCheckedChange={() => toggleSelect(pos.id)} />}</td>
                    <td className="p-4">
                      <p className="text-foreground font-medium">{pos.name}</p>
                      <p className="text-xs text-muted-foreground">{pos.symbol}</p>
                      <p className="text-xs text-muted-foreground">{new Date(pos.created_at).toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta', day: 'numeric', month: 'short' })}</p>
                    </td>
                    <td className="p-4"><span className={cn('px-2 py-1 rounded text-sm font-bold', pos.side === 'BUY' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive')}>{pos.side}</span></td>
                    <td className="p-4 text-foreground">{pos.quantity}</td>
                    <td className="p-4 text-foreground">${(pos.entry_price * pos.quantity)?.toFixed(2)}</td>
                    <td className="p-4 text-foreground font-medium">${(pos.current_price * pos.quantity)?.toFixed(2)}</td>
                    <td className="p-4">
                      <p className={cn('font-bold', pos.pnl >= 0 ? 'text-success' : 'text-destructive')}>{pos.pnl >= 0 ? '+' : ''}${pos.pnl?.toFixed(2)}</p>
                      <p className={cn('text-xs', pos.pnl_pct >= 0 ? 'text-success' : 'text-destructive')}>{pos.pnl_pct >= 0 ? '+' : ''}{pos.pnl_pct?.toFixed(2)}%</p>
                    </td>
                    <td className="p-4"><span className={cn('px-2 py-1 rounded text-xs font-medium', getStatusColor(pos.status))}>{pos.status}</span></td>
                    <td className="p-4">
                      {pos.status === 'OPEN' ? (
                        <Button size="sm" variant="destructive" className="rounded" onClick={() => openSellModal(pos)}>Sell</Button>
                      ) : (
                        <button onClick={() => deletePosition(pos.id)} className="text-xs text-destructive hover:text-destructive/80">Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>


      <Dialog open={showSellModal} onOpenChange={closeSellModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Sell</DialogTitle></DialogHeader>
          {selectedPosition && (
            <div className="space-y-3 py-4">
              <div className="flex justify-between"><span className="text-muted-foreground">Asset</span><span className="font-medium">{selectedPosition.name} ({selectedPosition.symbol})</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Quantity</span><span>{selectedPosition.quantity}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Entry Price</span><span>${selectedPosition.entry_price?.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Current Price</span><span className="font-medium">${selectedPosition.current_price?.toLocaleString()}</span></div>
              <div className="border-t pt-3 flex justify-between"><span className="text-muted-foreground">Est. P&L</span><span className={cn('font-bold', selectedPosition.pnl >= 0 ? 'text-success' : 'text-destructive')}>{selectedPosition.pnl >= 0 ? '+' : ''}${selectedPosition.pnl?.toFixed(2)} ({selectedPosition.pnl_pct?.toFixed(2)}%)</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">You will receive</span><span className="text-success font-bold">${(selectedPosition.current_price * selectedPosition.quantity)?.toFixed(2)}</span></div>
            </div>
          )}
          {sellError && <p className="text-destructive text-sm">{sellError}</p>}
          <DialogFooter>
            <Button variant="secondary" onClick={closeSellModal}>Cancel</Button>
            <Button variant="destructive" onClick={confirmSell} disabled={isSelling}>{isSelling ? 'Selling...' : 'Confirm Sell'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteModal} onOpenChange={closeDeleteModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Delete</DialogTitle></DialogHeader>
          <p className="text-muted-foreground py-4">Are you sure you want to delete {deleteCount} position{deleteCount > 1 ? 's' : ''} from history?</p>
          <DialogFooter>
            <Button variant="secondary" onClick={closeDeleteModal}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>{isDeleting ? 'Deleting...' : 'Delete'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
