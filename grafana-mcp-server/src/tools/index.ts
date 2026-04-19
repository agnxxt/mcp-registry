import { dashboardTools } from "./dashboards.js";
import { datasourceTools } from "./datasources.js";
import { alertTools } from "./alerts.js";
import { folderTools } from "./folders.js";
import { userTools } from "./users.js";
import { orgTools } from "./orgs.js";

export const allTools = [
  ...dashboardTools,
  ...datasourceTools,
  ...alertTools,
  ...folderTools,
  ...userTools,
  ...orgTools,
];
