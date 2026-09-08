"use client";

import { useEffect, useState } from "react";
import { CAT } from "@/lib/constants";
import { useLang } from "@/lib/i18n";
import type { CategoryId, Resource, ResourceGroup } from "@/lib/types";
import GroupBlock, { type AdminApi } from "./GroupBlock";
import PartnerCallout from "./PartnerCallout";
import { partnerAgreed, partnerOn } from "@/lib/partner";

const CACHE_KEY = "mfrg-groups-cache-v3";

export type Filter = CategoryId | "all";

type GeoState =
  | { status: "off" }
  | { status: "locating" }
  | { status: "on"; lat: number; lng: number }
  | { status: "denied" }
  | { status: "unavailable" };

export default function BrowseView({
  initialGroups,
  fromDb,
  adminApi,
}: {
  initialGroups: ResourceGroup[];
  fromDb: boolean;
  adminApi?: AdminApi;
}) {
  const { t } = useLang();
  const [groups, setGroups] = useState(initialGroups);
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [geo, setGeo] = useState<GeoState>({ status: "off" });

  // Offline support: cache the live dataset on first load; if the DB was
  // unreachable this visit, prefer a previously cached copy over seed data.
  // Admin mode is excluded: its dataset includes unapproved resources and
  // must never leak into the public offline cache.
  useEffect(() => {
    if (adminApi) return;
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
  }, [fromDb, initialGroups, adminApi]);

  const toggleNearMe = () => {
    if (geo.status === "on" || geo.status === "locating") {
      setGeo({ status: "off" });
      return;
    }
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeo({ status: "unavailable" });
      return;
    }
    setGeo({ status: "locating" });
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setGeo({
          status: "on",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      (err) =>
        setGeo(
          err.code === err.PERMISSION_DENIED
            ? { status: "denied" }
            : { status: "unavailable" }
        ),
      { timeout: 12000, maximumAge: 300000 }
    );
  };

  const userLoc = geo.status === "on" ? { lat: geo.lat, lng: geo.lng } : null;
  const nearOn = geo.status === "on" || geo.status === "locating";

  const ALL_CATS: { id: Filter; label: string }[] = [
    { id: "all", label: t.browse.all },
    ...(Object.keys(CAT) as CategoryId[]).map((id) => ({
      id: id as Filter,
      label: t.cat[id],
    })),
  ];
  const matches = (r: Resource) => filter === "all" || r.cat === filter;

  // Admin mode is controlled: AdminResources owns the dataset (optimistic
  // updates + rollback), so render straight from props. Public mode renders
  // local state so the offline cache can substitute when the DB is down.
  const displayGroups = adminApi ? initialGroups : groups;
  const ageGroups = displayGroups.filter((g) => g.kind === "age");
  const demoGroups = displayGroups.filter((g) => g.kind === "demo");

  return (
    <div>
      {/* Filter bar */}
      <div
        className="bg-white border-b border-line-sand px-3.5 py-2.5 flex gap-1.5 flex-wrap sticky top-0 z-10"
        role="group"
        aria-label={t.browse.filterAria}
      >
        {ALL_CATS.map((c) => {
          const col = c.id === "all" ? "#444" : CAT[c.id as CategoryId].color;
          const on = filter === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              aria-pressed={on}
              className="text-[9px] tracking-[0.06em] px-[9px] py-1 rounded-chip border-[1.5px]"
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
        <button
          onClick={toggleNearMe}
          aria-pressed={nearOn}
          className="text-[9px] tracking-[0.06em] px-[9px] py-1 rounded-chip border-[1.5px]"
          style={{
            borderColor: nearOn ? "var(--color-ink)" : "#ddd",
            background: nearOn ? "var(--color-ink)" : "transparent",
            color: nearOn ? "#fff" : "#888",
            fontWeight: nearOn ? 700 : 400,
          }}
        >
          {geo.status === "locating"
            ? "📍 …"
            : geo.status === "on"
              ? t.browse.nearMeActive
              : t.browse.nearMe}
        </button>
      </div>

      {(geo.status === "denied" || geo.status === "unavailable") && (
        <p
          role="status"
          className="text-[10px] text-[#996] bg-[#fdf8ec] border-b border-[#eee2c0] px-4 py-2 m-0"
        >
          {geo.status === "denied"
            ? t.browse.nearMeDenied
            : t.browse.nearMeUnavailable}
        </p>
      )}

      {/* Partner mode (2026-09-07): the library card is the one free thing that unlocks the most below. Public view only. */}
      {!adminApi && <PartnerCallout />}

      {ageGroups.map((g) => (
        <GroupBlock
          key={g.id}
          g={g}
          matches={matches}
          expanded={expanded}
          setExpanded={setExpanded}
          adminApi={adminApi}
          userLoc={userLoc}
        />
      ))}

      {/* Demographic divider */}
      <div className="bg-ink text-white px-[18px] pt-4 pb-3.5 mt-1.5">
        <div className="text-[9px] tracking-[0.2em] text-[var(--chrome-eyebrow)] mb-1">
          {t.browse.dividerTitle}
        </div>
        <div className="text-xs text-[var(--chrome-subtitle)] leading-relaxed">
          {t.browse.dividerBody}
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
          userLoc={userLoc}
          demo
        />
      ))}

      <footer className="px-4 pt-5 pb-9 text-[10px] text-[#bbb] text-center leading-[1.7]">
        {t.browse.footerLine1}
        <br />
        {t.browse.footerLine2}
        {partnerOn && (
          <>
            <br />
            {partnerAgreed ? t.partner.footerAgreed : t.partner.footerProposed}
          </>
        )}
      </footer>
    </div>
  );
}
