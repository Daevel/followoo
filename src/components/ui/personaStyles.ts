import type { UserPersona } from "@/types/instagram.types";

// One color per persona from the data palette, shared by every persona UI
// (filter, badge, charts) so the same persona always looks the same.
export const personaStyles: Record<
  UserPersona,
  { label: string; dotClass: string }
> = {
  SUPER_FAN: { label: "Super Fan", dotClass: "bg-data-3" },
  ENGAGED: { label: "Engaged", dotClass: "bg-data-1" },
  FICKLE: { label: "Fickle", dotClass: "bg-data-2" },
  LURKER: { label: "Lurker", dotClass: "bg-data-4" },
  DORMANT: { label: "Dormant", dotClass: "bg-data-5" },
};
