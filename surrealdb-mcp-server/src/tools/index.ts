import type { Tool } from "../types.js";
import { queryTools } from "./query.js";
import { recordsTools } from "./records.js";
import { adminTools } from "./admin.js";

export const allTools: Tool[] = [...queryTools, ...recordsTools, ...adminTools];
