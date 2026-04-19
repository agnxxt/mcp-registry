import { tools as workflows } from "./workflows.js";
import { tools as executions } from "./executions.js";
import { tools as credentials } from "./credentials.js";
import { tools as tags } from "./tags.js";
import { tools as users } from "./users.js";
import { tools as variables } from "./variables.js";

export const allTools = [
  ...workflows,
  ...executions,
  ...credentials,
  ...tags,
  ...users,
  ...variables,
];
