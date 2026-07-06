export type CategoryId =
  | "education"
  | "health"
  | "food"
  | "enrichment"
  | "technology"
  | "identity";

export type ServeType = "online" | "inperson" | "navigator";

export type FlagId = "disability" | "lgbtq" | "immigrant";

export interface Resource {
  id: string;
  name: string;
  cat: CategoryId;
  desc: string;
  how: string;
  url: string;
  minAge: number;
  maxAge: number;
  flags: FlagId[];
  serve: ServeType;
  basicInfoOnly?: boolean;
}

export interface ResourceGroup {
  id: string;
  label: string;
  kind: "age" | "demo";
  charStage: number | null;
  color: string;
  note?: string;
  sortOrder: number;
  resources: Resource[];
}

/** A resource annotated with the group it belongs to (v2's `_group`). */
export interface FlatResource extends Resource {
  _group: string;
}

export interface ChildInput {
  name: string;
  age: string; // kept as string to match v2 form behavior ("" = not filled in)
  disability: boolean;
  lgbtq: boolean;
}

export interface FamilyNeeds {
  immigrant: boolean;
  food: boolean;
}

export interface ChildPlan {
  child: ChildInput;
  programs: FlatResource[];
}

export interface FamilyPlan {
  childPlans: ChildPlan[];
  family: FlatResource[];
  familyData: {
    parent: string;
    contact: string;
    zip: string;
    children: ChildInput[];
    fam: FamilyNeeds;
  };
}

export interface Submission {
  id: string;
  name: string;
  cat: CategoryId;
  desc: string;
  how: string;
  url: string;
  minAge: number;
  maxAge: number;
  serve: ServeType;
  targetGroup: string;
  submitter: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface Registration {
  id: string;
  parent: string;
  contact: string;
  zip: string;
  children: { name: string; age: string | number }[];
  familyNeeds: FamilyNeeds;
  createdAt: string;
}

// ── Database row shapes (snake_case, as stored in Supabase) ──
export interface DbGroup {
  id: string;
  label: string;
  kind: "age" | "demo";
  char_stage: number | null;
  color: string;
  note: string | null;
  sort_order: number;
}

export interface DbResource {
  id: string;
  group_id: string;
  name: string;
  category: CategoryId;
  description: string;
  how_to_access: string;
  url: string | null;
  min_age: number;
  max_age: number;
  flags: FlagId[];
  serve: ServeType;
  basic_info_only: boolean;
  is_approved: boolean;
  sort_order: number;
}

export interface DbSubmission {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  how_to_access: string | null;
  url: string | null;
  min_age: number;
  max_age: number;
  serve: ServeType;
  target_group: string;
  submitter_name: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export interface DbRegistration {
  id: string;
  parent_name: string | null;
  contact: string | null;
  zip: string | null;
  children: { name: string; age: string | number }[];
  family_needs: Partial<FamilyNeeds>;
  created_at: string;
}
