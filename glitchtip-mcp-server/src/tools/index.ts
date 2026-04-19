import { tools as organizations } from "./organizations.js";
import { tools as projects } from "./projects.js";
import { tools as issues } from "./issues.js";
import { tools as events } from "./events.js";
import { tools as teams } from "./teams.js";
import { tools as alerts } from "./alerts.js";

export const allTools = [
  ...organizations,
  ...projects,
  ...issues,
  ...events,
  ...teams,
  ...alerts,
];
