import type { Tool } from "../types.js";
import { tools as search } from "./search.js";

export const allTools: Tool[] = [
  ...search,
];
