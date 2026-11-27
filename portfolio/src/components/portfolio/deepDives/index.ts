import type { TechDive } from "./types";
import csa from "./csa";
import nursie from "./nursie";
import resqLink from "./resq-link";
import robot from "./reforestation-robot";
import pump from "./axial-piston-pump";
import trace from "./trace";
import crm from "./crm-outreach-tool";
import mechprep from "./mechprep";
import lazycare from "./lazycare";
import interview from "./interview-assistant";

/** Timeline deep dive per project id; a project without one keeps its summary sections. */
const byId: Record<string, TechDive | null> = {
  "P-1": csa,
  "P-5": nursie,
  "P-4": resqLink,
  "P-3": robot,
  "P-2": pump,
  "P-14": trace,
  "P-9": crm,
  "P-11": mechprep,
  "P-12": lazycare,
  "P-13": interview,
};

export const techDiveFor = (id: string) => byId[id] ?? null;
