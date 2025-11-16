// src/ui/components/MetricsPanel.tsx
import React, { useMemo } from 'react';
import { useMetrics } from '../state/metrics';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts';

export default function MetricsPanel() {
  const { buffer, count } = useMetrics();

  const latest = count ? buffer[(buffer.length === 0 ? 0 : (buffer.length >= count ? (buffer.length - (buffer.length - count)) : 0) , (buffer.length ? (buffer.length - 1) : 0))] : null;
  const kpis = useMemo(() => {
    if (!count) return { fps: 0, fpsEma: 0, changed: 0, pct: 0, triggers: 0 };
    const s = buffer[(buffer.length + ((buffer as any).head || 0) - 1) % (buffer.length || 1)] ?? buffer[count - 1] ?? latest;
    return {
      fps: Math.round((s?.fps || 0) * 10) / 10,
      fpsEma: Math.round((s?.fpsEma || 0) * 10) / 10,
      changed: s?.changedVoxels || 0,
      pct: Math.round((s?.percentChanged || 0) * 10) / 10,
      triggers: s?.ruleTriggers || 0,
    };
  }, [buffer, count]);

  const chartData = useMemo(() => {
    const arr = buffer.slice(-200).map(s => ({
      step: s.step,
      fps: Math.round(s.fpsEma * 10) / 10,
      pct: Math.round(s.percentChanged * 10) / 10,
    }));
    return arr;
  }, [buffer]);

  const topRules = useMemo(() => {
    const totals: Record<string, number> = {};
    buffer.slice(-200).forEach(s => {
      Object.entries(s.ruleCounts).forEach(([k, v]) => {
        totals[k] = (totals[k] || 0) + (v as number);
      });
    });
    const entries = Object.entries(totals).sort((a,b) => b[1]-a[1]).slice(0, 8);
    return entries.map(([ruleId, count]) => ({ ruleId, count }));
  }, [buffer]);

  return (
    <div className="p-3 rounded-xl bg-neutral-900 text-neutral-100 shadow space-y-4">
      <div className="text-xs opacity-80">Metrics</div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <Kpi label="FPS" value={kpis.fpsEma.toFixed(1)} />
        <Kpi label="% Changed" value={`${kpis.pct.toFixed(1)}%`} />
        <Kpi label="Δ Voxels" value={String(kpis.changed)} />
        <Kpi label="Rule Triggers" value={String(kpis.triggers)} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-3">
        <ChartCard title="FPS (EMA)">
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="step" hide />
              <YAxis hide />
              <Tooltip />
              <Line type="monotone" dataKey="fps" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="% Voxels Changed">
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="step" hide />
              <YAxis hide />
              <Tooltip />
              <Line type="monotone" dataKey="pct" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Top Rules (last 200 ticks)">
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={topRules} layout="vertical" margin={{ left: 24, right: 8, top: 8, bottom: 8 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="ruleId" width={120} />
            <Tooltip />
            <Bar dataKey="count" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-neutral-800 p-3">
      <div className="text-[10px] opacity-70">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-neutral-800 p-2">
      <div className="text-[11px] opacity-70 px-1 pb-1">{title}</div>
      {children}
    </div>
  );
}