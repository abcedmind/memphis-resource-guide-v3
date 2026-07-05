"use client";

import { useEffect, useState } from "react";
import { CAT } from "@/lib/constants";
import type { CategoryId, Resource, ResourceGroup } from "@/lib/types";
import GroupBlock, { type AdminApi } from "./GroupBlock";

const CACHE_KEY = "mfrg-groups-cache-v3";

export type Filter = CategoryId | "all";

export default function BrowseView({
  initialGroups,
  fromDb,
  adminApi,
}: {
  initialGroups: ResourceGroup[];
  fromDb: boolean;
  adminApi?: AdminApi;
}) {
  const [groups, setGroups] = useState(initialGroups);
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  // Offline support: cache the live dataset on first load; if the DB was
  // unreachable this visit, prefer a previously cached copy over seed data.
  useEffect(() => {
    try {
      if (fromDb) {
        localStorage.setItem(CACHE_KEY, JSON.stringify(initialGroups));
      } else {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) setGroups(JSON.parse(cached));
      }
    } catch {
      // storage unavailable (private mode etc.) — seed fallback still works
    }
  }, [fromDb, initialGroups]);

  const ALL_CATS: { id: Filter; label: string }[] = [
    { id: "all", label: "ALL" },
    ...Object.entries(CAT).map(([id, v]) => ({
      id: id as CategoryId,
      label: v.label,
    })),
  ];
  const matches = (r: Resource) => filter === "all" || r.cat === filter;

  const ageGroups = groups.filter((g) => g.kind === "age");
  const demoGroups = groups.filter((g) => g.kind === "demo");

  return (
    <div>
      {/* Filter bar */}
      <div
        className="bg-white border-b border-line-sand px-3.5 py-2.5 flex gap-1.5 flex-wrap sticky top-0 z-10"
        role="toolbar"
        aria-label="Filter by category"
      >
        {ALL_CATS.map((c) => {
          const col = c.id === "all" ? "#444" : CAT[c.id as CategoryId].color;
          const on = filter === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              aria-pressed={on}
              className="text-[9px] tracking-[0.06em] px-[9px] py-1 rounded-xl border-[1.5px]"
              style={{
                borderColor: on ? col : "#ddd",
                background: on ? col : "transparent",
                color: on ? "#fff" : "#888",
                fontWeight: on ? 700 : 400,
              }}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {ageGroups.map((g) => (
        <GroupBlock
          key={g.id}
          g={g}
          matches={matches}
          expanded={expanded}
          setExpanded={setExpanded}
          adminApi={adminApi}
        />
      ))}

      {/* Demographic divider */}
      <div className="bg-ink text-white px-[18px] pt-4 pb-3.5 mt-1.5">
        <div className="text-[9px] tracking-[0.2em] text-[#6666aa] mb-1">
          SPECIFIC COMMUNITIES &amp; NEEDS
        </div>
        <div className="text-xs text-[#aab] leading-relaxed">
          Identity- and needs-specific supports. These work alongside
          everything above — a child can use both their age-group resources
          and these.
        </div>
      </div>

      {demoGroups.map((g) => (
        <GroupBlock
          key={g.id}
          g={g}
          matches={matches}
          expanded={expanded}
          setExpanded={setExpanded}
          adminApi={adminApi}
          demo
        />
      ))}

      <footer className="px-4 pt-5 pb-9 text-[10px] text-[#bbb] text-center leading-[1.7]">
        v3 · Resources gathered June 2026 · Verify before relying on any
        single program
        <br />
        Tap a card to expand · Tap a category chip to filter
      </footer>
    </div>
  );
}
