import { tools as visits } from "./visits.js";
import { tools as actions } from "./actions.js";
import { tools as referrers } from "./referrers.js";
import { tools as goals } from "./goals.js";
import { tools as sites } from "./sites.js";
import { tools as usersAccess } from "./users_access.js";
import { tools as devices } from "./devices.js";
import { tools as custom } from "./custom.js";

export const allTools = [
  ...visits,
  ...actions,
  ...referrers,
  ...goals,
  ...sites,
  ...usersAccess,
  ...devices,
  ...custom,
];
