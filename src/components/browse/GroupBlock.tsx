"use client";

import { useState } from "react";
import PixelChar from "@/components/PixelChar";
import ResourceEditor from "@/components/admin/ResourceEditor";
import { CAT } from "@/lib/constants";
import { resourceDistanceMiles, sortByDistance } from "@/lib/geo";
import { useLang } from "@/lib/i18n";
import type { Resource, ResourceGroup, ServeType } from "@/lib/types";

export interface AdminApi {
  updateResource: (gid: string, rid: string, patch: Partial<Resource>) => void;
  deleteResource: (gid: string, rid: string) => void;
  addResource: (gid: string, res: Omit<Resource, "id">) => void;
}

const SERVE_COLOR: Record<ServeType, string> = {
  online: "#3aab7c",
  inperson: "#e07c45",
  navigator: "#9b59b6",
};

export default function GroupBlock({
  g,
  matches,
  expanded,
  setExpanded,
  adminApi,
  userLoc,
  demo,
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

  return (
    <section aria-label={g.label}>
      <div
        className={`flex items-end gap-3.5 px-4 pt-4 pb-2.5 border-t border-[#ddd5c8] ${
          demo ? "bg-band-demo" : "bg-band-sand"
        }`}
        style={{ borderBottom: `3px solid ${g.color}` }}
      >
        {g.charStage !== null && (
          <div className="shrink-0 pb-0.5">
            <PixelChar stageIndex={g.charStage} ps={5} />
          </div>
        )}
        <div className="flex-1 pb-[3px]">
          <h2
            className="text-[11px] font-extrabold tracking-[0.12em]"
            style={{ color: g.color }}
          >
            {g.label}
          </h2>
          {g.note && (
            <div className="text-[10px] text-[#998] mt-[3px] leading-normal italic">
              {g.note}
            </div>
          )}
          <div className="text-[10px] text-[#aaa] mt-[3px]">
            {visible.length}{" "}
            {visible.length === 1 ? t.browse.program : t.browse.programs}
          </div>
        </div>
      </div>

      <div className="px-3 py-2 bg-cream">
        {visible.map((res) => {
          const key = `${g.id}-${res.id}`;
          const open = expanded === key;
          const col = CAT[res.cat]?.color || "#777";
          const dist = userLoc
            ? resourceDistanceMiles(res, userLoc.lat, userLoc.lng)
            : null;
          if (admin && editing === res.id)
            return (
              <ResourceEditor
                key={key}
                res={res}
                color={col}
                onSave={(p) => {
                  adminApi!.updateResource(g.id, res.id, p);
                  setEditing(null);
                }}
                onCancel={() => setEditing(null)}
              />
            );
          return (
            <article
              key={key}
              className="bg-white rounded-md mb-1.5 border border-line-sand overflow-hidden"
              style={{ borderLeft: `4px solid ${col}` }}
            >
              <button
                className="w-full text-left flex items-center px-3 py-2.5 gap-2.5"
                onClick={() => setExpanded(open ? null : key)}
                aria-expanded={open}
              >
                <span className="flex-1 min-w-0">
                  <span className="block text-[13px] font-semibold text-ink">
                    {res.name}
                  </span>
                  {!open && (
                    <span className="block text-[11px] text-[#aaa] mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap">
                      {res.desc.slice(0, 72)}…
                    </span>
                  )}
                </span>
                {dist !== null && (
                  <span className="text-[7px] tracking-[0.04em] px-1 py-0.5 rounded-[3px] shrink-0 whitespace-nowrap border border-[#1a1a2e33] text-ink font-bold">
                    {dist < 10 ? dist.toFixed(1) : Math.round(dist)}{" "}
                    {t.browse.miAway}
                  </span>
                )}
                {res.serve && (
                  <span
                    className="text-[7px] tracking-[0.04em] px-1 py-0.5 rounded-[3px] shrink-0 whitespace-nowrap border"
                    style={{
                      color: SERVE_COLOR[res.serve],
                      borderColor: `${SERVE_COLOR[res.serve]}55`,
                    }}
                  >
                    {t.serve[res.serve].toUpperCase()}
                  </span>
                )}
                <span
                  className="text-[8px] tracking-[0.05em] px-1.5 py-0.5 rounded-[3px] shrink-0 border"
                  style={{ color: col, borderColor: `${col}44` }}
                >
                  {t.cat[res.cat] ?? CAT[res.cat]?.label}
                </span>
              </button>
              {open && (
                <div className="px-3 pb-3 border-t border-[#f0ece4]">
                  <p className="text-xs text-[#444] mt-2 mb-1.5 leading-[1.65]">
                    {res.desc}
                  </p>
                  <div className="text-[11px] text-[#666] px-2 py-1.5 bg-[#f5f1eb] rounded mb-[7px] leading-normal">
                    <b>{t.browse.howToAccess}</b>
                    {res.how}
                  </div>
                  {res.url && (
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] no-underline"
                      style={{ color: col }}
                    >
                      ↗{" "}
                      {res.url
                        .replace("https://www.", "")
                        .replace("https://", "")}
                    </a>
                  )}
                  {admin && (
                    <div className="mt-2">
                      <button
                        onClick={() => setEditing(res.id)}
                        className="bg-cat-education text-white rounded px-2.5 py-1 text-[10px] mr-1.5"
                      >
                        EDIT
                      </button>
                      <button
                        onClick={() => {
                          if (confirmId === res.id) {
                            adminApi!.deleteResource(g.id, res.id);
                            setConfirmId(null);
                          } else setConfirmId(res.id);
                        }}
                        className={`rounded px-2.5 py-1 text-[10px] border border-[#e0a8c4] ${
                          confirmId === res.id
                            ? "bg-cat-identity text-white"
                            : "bg-transparent text-cat-identity"
                        }`}
                      >
                        {confirmId === res.id ? "TAP AGAIN TO DELETE" : "DELETE"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}

        {admin &&
          (editing === "new" ? (
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
              color="#3aab7c"
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
          ) : (
            <button
              onClick={() => setEditing("new")}
              className="w-full bg-transparent border-[1.5px] border-dashed border-[#c4bbae] rounded-md py-[9px] text-[11px] text-[#998] mt-0.5"
            >
              + Add resource to {g.label}
            </button>
          ))}
      </div>
    </section>
  );
}
