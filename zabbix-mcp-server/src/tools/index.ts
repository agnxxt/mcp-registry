import { tools as hosts } from "./hosts.js";
import { tools as items } from "./items.js";
import { tools as triggers } from "./triggers.js";
import { tools as events } from "./events.js";
import { tools as templates } from "./templates.js";
import { tools as maintenance } from "./maintenance.js";
import { tools as misc } from "./misc.js";

export const allTools = [
  ...hosts,
  ...items,
  ...triggers,
  ...events,
  ...templates,
  ...maintenance,
  ...misc,
];
