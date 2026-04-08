import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

const HealthCheckPage = ({ serverStatus = 'loading', onRetry }) => {
  const isLoading = serverStatus === 'loading';
  const isOnline = serverStatus === 'online';

  const message = isLoading
    ? 'Establishing live backend connection...'
    : isOnline
      ? 'Backend connection is healthy.'
      : 'Waiting for the backend connection to return. You will be brought back automatically.';

  const statusLabel = isLoading ? 'Connecting...' : isOnline ? 'Online' : 'Offline';

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden selection:bg-emerald-500/30">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-24">
        <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-2xl shadow-emerald-500/10 backdrop-blur-3xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-black/40 shadow-xl">
              <AlertTriangle className="h-10 w-10 text-rose-400" />
            </div>
            <h1 className="mb-3 text-4xl font-black uppercase tracking-tighter text-white">
              {isLoading ? 'Checking server' : 'Server unavailable'}
            </h1>
            <p className="text-sm uppercase tracking-[0.35em] text-white/50">
              {isLoading ? 'Establishing live backend link...' : 'Nocturne is currently offline'}
            </p>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-black/50 p-6">
              <p className="mb-3 text-sm text-white/70">Status</p>
              <p className="text-xl font-semibold text-white">{statusLabel}</p>
              <p className="mt-3 text-sm text-white/60">{message}</p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500/15 px-6 py-3 text-sm font-black uppercase tracking-[0.25em] text-emerald-200 transition hover:bg-emerald-500/25"
              >
                <RefreshCcw className="h-4 w-4" /> Retry
              </button>

              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.25em] text-black transition hover:bg-white/90"
              >
                <Home className="h-4 w-4" /> Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCheckPage;
