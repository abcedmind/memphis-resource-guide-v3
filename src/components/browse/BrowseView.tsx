"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CAT } from "@/lib/constants";
import { useLang } from "@/lib/i18n";
import type { CategoryId, Resource, ResourceGroup } from "@/lib/types";
import GroupBlock, { type AdminApi } from "./GroupBlock";

const CACHE_KEY = "mfrg-groups-cache-v3";

export type Filter = CategoryId | "all";

type GeoState =
  | { status: "off" }
  | { status: "locating" }
  | { status: "on"; lat: number; lng: number }
  | { status: "denied" }
  | { status: "unavailable" };

function PinIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

const chip =
  "inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full border text-sm whitespace-nowrap transition-colors";

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
  // Counted from the data on the page, never typed in.
  const programCount = new Set(
    displayGroups.flatMap((g) => g.resources.map((r) => r.id))
  ).size;

  return (
    <div>
      {!adminApi && (
        <div className="max-w-page mx-auto px-4 pt-6 pb-5">
          <p className="text-lg leading-relaxed text-ink m-0">
            {t.browse.lead.replace("{n}", String(programCount))}
          </p>
          <p className="text-base text-muted mt-2 mb-0">
            {t.browse.leadPlan}{" "}
            <Link href="/family" className="text-primary font-semibold underline underline-offset-2">
              {t.browse.leadPlanLink}
            </Link>
            .
          </p>
        </div>
      )}

      {/* Filter bar */}
      <div className="sticky top-0 z-10 bg-paper border-y border-line print:hidden">
        <div
          className="scroll-row max-w-page mx-auto px-4 py-2.5 flex gap-2 overflow-x-auto sm:flex-wrap sm:overflow-visible"
          role="group"
          aria-label={t.browse.filterAria}
        >
          {ALL_CATS.map((c) => {
            const on = filter === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setFilter(c.id)}
                aria-pressed={on}
                className={`${chip} ${
                  on
                    ? "bg-ink border-ink text-white font-semibold"
                    : "bg-paper border-line-strong text-ink hover:bg-canvas"
                }`}
              >
                {c.label}
              </button>
            );
          })}
          <span className="w-px shrink-0 bg-line my-1 sm:hidden" aria-hidden="true" />
          <button
            type="button"
            onClick={toggleNearMe}
            aria-pressed={nearOn}
            className={`${chip} ${
              nearOn
                ? "bg-primary border-primary text-white font-semibold"
                : "bg-paper border-line-strong text-primary hover:bg-primary-tint"
            }`}
          >
            <PinIcon />
            {geo.status === "locating"
              ? t.browse.locating
              : geo.status === "on"
                ? t.browse.nearMeActive
                : t.browse.nearMe}
          </button>
        </div>
      </div>

      {(geo.status === "denied" || geo.status === "unavailable") && (
        <div className="max-w-page mx-auto px-4 pt-3">
          <p
            role="status"
            className="text-sm text-ink bg-paper border border-line rounded px-3 py-2 m-0"
          >
            {geo.status === "denied"
              ? t.browse.nearMeDenied
              : t.browse.nearMeUnavailable}
          </p>
        </div>
      )}

      <div className="max-w-page mx-auto px-4">
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

        {/* Demographic section */}
        <div className="mt-12 pt-5 border-t-4 border-ink">
          <h2 className="text-2xl font-bold leading-tight text-ink m-0">
            {t.browse.dividerTitle}
          </h2>
          <p className="text-base leading-relaxed text-muted mt-2 mb-0">
            {t.browse.dividerBody}
          </p>
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
      </div>
    </div>
  );
}
