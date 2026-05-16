import { RefreshCw } from 'lucide-react';

export default function PullToRefreshIndicator({ pullY, progress, refreshing }) {
  if (!refreshing && pullY === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 flex justify-center z-50 pointer-events-none"
      style={{ transform: `translateY(${Math.max(pullY - 20, 0)}px)` }}
    >
      <div className="bg-card border border-border shadow-md rounded-full p-2 mt-2">
        <RefreshCw
          className="w-5 h-5 text-primary transition-transform"
          style={{
            transform: `rotate(${refreshing ? 0 : progress * 360}deg)`,
            animation: refreshing ? 'spin 0.8s linear infinite' : 'none',
          }}
        />
      </div>
    </div>
  );
}