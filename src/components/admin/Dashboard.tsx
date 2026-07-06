import { CAT } from "@/lib/constants";
import type { CategoryId } from "@/lib/types";

export interface WeekBin {
  label: string; // e.g. "Jun 2"
  count: number;
}

export interface DashboardData {
  dbReady: boolean;
  pending: number;
  approved: number;
  rejected: number;
  registrationsTotal: number;
  resourcesTotal: number;
  submissionsByWeek: WeekBin[];
  registrationsByWeek: WeekBin[];
  resourcesByCategory: { cat: CategoryId; count: number }[];
}

/**
 * Weekly counts as a small single-series bar chart.
 * Magnitude is encoded by bar length in one hue (ink); identity comes from
 * the axis labels, so nothing depends on color alone. Values are labeled
 * selectively (max + latest); the full series is in a screen-reader table.
 */
function WeeklyBars({
  title,
  data,
  chartId,
}: {
  title: string;
  data: WeekBin[];
  chartId: string;
}) {
  const W = 320;
  const H = 96;
  const PAD_BOTTOM = 18;
  const PAD_TOP = 14;
  const max = Math.max(1, ...data.map((d) => d.count));
  const maxIdx = data.findIndex((d) => d.count === max);
  const n = data.length;
  const gap = 6;
  const barW = (W - gap * (n - 1)) / n;

  return (
    <figure className="bg-white border border-line-sand rounded-lg p-3 m-0">
      <figcaption className="text-[10px] font-extrabold tracking-[0.08em] text-[#888] mb-2">
        {title.toUpperCase()}
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-labelledby={`${chartId}-title`}
      >
        <title id={`${chartId}-title`}>
          {title}: {data.map((d) => `${d.label}: ${d.count}`).join(", ")}
        </title>
        {/* baseline */}
        <line
          x1={0}
          y1={H - PAD_BOTTOM}
          x2={W}
          y2={H - PAD_BOTTOM}
          stroke="#e8e2da"
          strokeWidth={1}
        />
        {data.map((d, i) => {
          const h =
            d.count === 0
              ? 0
              : Math.max(3, (d.count / max) * (H - PAD_BOTTOM - PAD_TOP));
          const x = i * (barW + gap);
          const y = H - PAD_BOTTOM - h;
          const labeled = d.count > 0 && (i === maxIdx || i === n - 1);
          return (
            <g key={d.label}>
              {d.count === 0 ? (
                <circle
                  cx={x + barW / 2}
                  cy={H - PAD_BOTTOM - 2}
                  r={1.5}
                  fill="#d8d0c4"
                />
              ) : (
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={h}
                  rx={3}
                  fill="#1a1a2e"
                >
                  <title>{`${d.label}: ${d.count}`}</title>
                </rect>
              )}
              {labeled && (
                <text
                  x={x + barW / 2}
                  y={y - 4}
                  textAnchor="middle"
                  fontSize={9}
                  fill="#555"
                  fontWeight={700}
                >
                  {d.count}
                </text>
              )}
              <text
                x={x + barW / 2}
                y={H - 6}
                textAnchor="middle"
                fontSize={7.5}
                fill="#aaa"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
      <table className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">Week of</th>
            <th scope="col">Count</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.label}>
              <td>{d.label}</td>
              <td>{d.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

function StatTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div
      className="bg-white border border-line-sand rounded-lg px-3 py-2.5 flex-1 min-w-[88px]"
      style={{ borderLeft: `3px solid ${accent}` }}
    >
      <div className="text-[22px] font-extrabold text-ink leading-none">
        {value}
      </div>
      <div className="text-[9px] tracking-[0.08em] text-[#998] mt-1 uppercase">
        {label}
      </div>
    </div>
  );
}

export default function Dashboard({ data }: { data: DashboardData }) {
  const catMax = Math.max(1, ...data.resourcesByCategory.map((c) => c.count));
  return (
    <div className="px-4 pt-4 pb-10">
      <h2 className="text-[15px] font-extrabold text-ink m-0 mb-1">
        Dashboard
      </h2>
      <p className="text-[11px] text-[#998] m-0 mb-4">
        Live counts from the database
        {!data.dbReady && " — database not reachable yet"}
        .
      </p>

      {!data.dbReady && (
        <div
          className="bg-[#fdf8ec] border border-[#eee2c0] rounded-lg px-3.5 py-3 mb-4 text-xs text-[#7a6a3a] leading-relaxed"
          role="status"
        >
          <b>Database not set up yet.</b> Run{" "}
          <code className="bg-[#f0e8d0] px-1 rounded">supabase/schema.sql</code>{" "}
          in the Supabase SQL Editor, then{" "}
          <code className="bg-[#f0e8d0] px-1 rounded">npm run seed</code>. The
          public site works from bundled data in the meantime — see README.
        </div>
      )}

      {/* Status tiles: label + number, color as accent only */}
      <div className="flex gap-2 flex-wrap mb-4">
        <StatTile label="Pending" value={data.pending} accent="#b8860b" />
        <StatTile label="Approved" value={data.approved} accent="#3aab7c" />
        <StatTile label="Rejected" value={data.rejected} accent="#c0397b" />
        <StatTile
          label="Families saved"
          value={data.registrationsTotal}
          accent="#4a7fcf"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 mb-4">
        <WeeklyBars
          chartId="subs-week"
          title="Submissions · last 8 weeks"
          data={data.submissionsByWeek}
        />
        <WeeklyBars
          chartId="regs-week"
          title="Family registrations · last 8 weeks"
          data={data.registrationsByWeek}
        />
      </div>

      {/* Resources by category: magnitude = length (single hue); identity =
          text label + the guide's existing colored chip convention. */}
      <figure className="bg-white border border-line-sand rounded-lg p-3 m-0">
        <figcaption className="text-[10px] font-extrabold tracking-[0.08em] text-[#888] mb-2.5">
          RESOURCES BY CATEGORY · {data.resourcesTotal} TOTAL
        </figcaption>
        <div className="flex flex-col gap-2">
          {data.resourcesByCategory.map(({ cat, count }) => (
            <div key={cat} className="flex items-center gap-2">
              <span
                className="text-[8px] tracking-[0.05em] px-1.5 py-0.5 rounded-[3px] border shrink-0 w-[118px] text-center"
                style={{
                  color: CAT[cat].color,
                  borderColor: `${CAT[cat].color}44`,
                }}
              >
                {CAT[cat].label}
              </span>
              <div
                className="h-[10px] rounded-[3px] bg-ink min-w-[3px]"
                style={{ width: `${(count / catMax) * 100 * 0.62}%` }}
                aria-hidden="true"
              />
              <span className="text-[10px] font-bold text-ink">{count}</span>
            </div>
          ))}
        </div>
      </figure>
    </div>
  );
}
