"use client";

import { useState } from "react";
import ResourceEditor from "@/components/admin/ResourceEditor";
import { CAT } from "@/lib/constants";
import { resourceDistanceMiles, sortByDistance } from "@/lib/geo";
import { useLang } from "@/lib/i18n";
import type { Resource, ResourceGroup } from "@/lib/types";

export interface AdminApi {
  updateResource: (gid: string, rid: string, patch: Partial<Resource>) => void;
  deleteResource: (gid: string, rid: string) => void;
  addResource: (gid: string, res: Omit<Resource, "id">) => void;
}

/** "https://www.example.org/path/" → "example.org/path" — shown as the link text. */
export function displayUrl(url: string) {
  return url
    .replace(/^https?:\/\/(www\.)?/, "")
    .replace(/\/$/, "");
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 mt-0.5 text-muted transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="M5 7.5l5 5 5-5" />
    </svg>
  );
}

export function ExternalIcon() {
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
      className="inline-block align-[-2px] ml-1"
    >
      <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

const tag = "inline-flex items-center h-6 px-2 rounded text-[0.8125rem] leading-none whitespace-nowrap";

export default function GroupBlock({
  g,
  matches,
  expanded,
  setExpanded,
  adminApi,
  userLoc,
}: {
  g: ResourceGroup;
  matches: (r: Resource) => boolean;
  expanded: string | null;
  setExpanded: (k: string | null) => void;
  adminApi?: AdminApi;
  userLoc?: { lat: number; lng: number } | null;
  demo?: boolean;
}) {
  const { t } = useLang();
  const admin = !!adminApi;
  const [editing, setEditing] = useState<string | null>(null); // rid or "new"
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const filtered = g.resources.filter(matches);
  const visible = userLoc
    ? sortByDistance(filtered, userLoc.lat, userLoc.lng)
    : filtered;
  if (visible.length === 0 && !admin) return null;
  const headingId = `group-${g.id}`;

  return (
    <section aria-labelledby={headingId} className="pt-8">
      <div className="flex items-baseline justify-between gap-4 border-b-2 border-ink pb-2">
        <h2
          id={headingId}
          className="text-[0.9375rem] font-bold tracking-[0.04em] text-ink m-0"
        >
          {g.label}
        </h2>
        <span className="text-sm text-muted whitespace-nowrap">
          {visible.length}{" "}
          {visible.length === 1 ? t.browse.program : t.browse.programs}
        </span>
      </div>
      {g.note && (
        <p className="text-[0.9375rem] leading-relaxed text-muted mt-2 mb-0">{g.note}</p>
      )}

      <ul className="list-none p-0 m-0 mt-3 flex flex-col gap-2">
        {visible.map((res) => {
          const key = `${g.id}-${res.id}`;
          const open = expanded === key;
          const cat = CAT[res.cat];
          const panelId = `panel-${key}`;
          const dist = userLoc
            ? resourceDistanceMiles(res, userLoc.lat, userLoc.lng)
            : null;
          if (admin && editing === res.id)
            return (
              <li key={key}>
                <ResourceEditor
                  res={res}
                  color="var(--accent)"
                  onSave={(p) => {
                    adminApi!.updateResource(g.id, res.id, p);
                    setEditing(null);
                  }}
                  onCancel={() => setEditing(null)}
                />
              </li>
            );
          return (
            <li
              key={key}
              className={`bg-paper rounded-md border ${open ? "border-line-strong" : "border-line"}`}
            >
              <button
                type="button"
                className="w-full text-left flex items-start gap-3 px-4 py-3.5"
                onClick={() => setExpanded(open ? null : key)}
                aria-expanded={open}
                aria-controls={panelId}
              >
                <span className="flex-1 min-w-0">
                  <span className="block text-base font-semibold leading-snug text-ink">
                    {res.name}
                  </span>
                  {!open && (
                    <span className="text-[0.9375rem] leading-normal text-muted mt-1 line-clamp-2">
                      {res.desc}
                    </span>
                  )}
                  <span className="flex flex-wrap gap-1.5 mt-2.5">
                    {cat && (
                      <span className={`${tag} bg-canvas text-ink`}>
                        {t.cat[res.cat] ?? cat.label}
                      </span>
                    )}
                    {res.serve && (
                      <span className={`${tag} border border-line text-muted`}>
                        {t.serve[res.serve]}
                      </span>
                    )}
                    {dist !== null && (
                      <span className={`${tag} border border-line text-ink font-semibold`}>
                        {dist < 10 ? dist.toFixed(1) : Math.round(dist)} {t.browse.miAway}
                      </span>
                    )}
                  </span>
                </span>
                <Chevron open={open} />
              </button>
              {open && (
                <div id={panelId} className="px-4 pb-4">
                  <p className="text-base leading-relaxed text-ink m-0">{res.desc}</p>
                  <div className="mt-3 rounded bg-canvas px-3 py-2.5">
                    <p className="text-sm font-semibold text-ink m-0">{t.browse.howToAccess}</p>
                    <p className="text-[0.9375rem] leading-normal text-ink mt-0.5 mb-0">{res.how}</p>
                  </div>
                  {res.url && (
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-[0.9375rem] font-semibold text-primary underline underline-offset-2 break-all"
                    >
                      {displayUrl(res.url)}
                      <ExternalIcon />
                    </a>
                  )}
                  {admin && (
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditing(res.id)}
                        className="bg-primary text-white rounded px-3 py-1.5 text-sm font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirmId === res.id) {
                            adminApi!.deleteResource(g.id, res.id);
                            setConfirmId(null);
                          } else setConfirmId(res.id);
                        }}
                        className={`rounded px-3 py-1.5 text-sm font-semibold border border-error ${
                          confirmId === res.id
                            ? "bg-error text-white"
                            : "bg-paper text-error"
                        }`}
                      >
                        {confirmId === res.id ? "Tap again to delete" : "Delete"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {admin &&
        (editing === "new" ? (
          <div className="mt-2">
            <ResourceEditor
              isNew
              res={{
                id: "",
                name: "",
                cat: "education",
                desc: "",
                how: "",
                url: "",
                minAge: 0,
                maxAge: 18,
                flags: [],
                serve: "navigator",
              }}
              color="var(--accent)"
              onSave={(p) => {
                adminApi!.addResource(g.id, {
                  name: p.name ?? "",
                  cat: p.cat ?? "education",
                  desc: p.desc ?? "",
                  how: p.how ?? "",
                  url: p.url ?? "",
                  minAge: p.minAge ?? 0,
                  maxAge: p.maxAge ?? 18,
                  serve: p.serve ?? "navigator",
                  flags: [],
                });
                setEditing(null);
              }}
              onCancel={() => setEditing(null)}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditing("new")}
            className="w-full mt-2 bg-paper border border-dashed border-line-strong rounded-md py-2.5 text-sm text-muted"
          >
            + Add resource to {g.label}
          </button>
        ))}
    </section>
  );
}
