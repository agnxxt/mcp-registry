import { tools as typebots } from "./typebots.js";
import { tools as results } from "./results.js";
import { tools as workspaces } from "./workspaces.js";
import { tools as chat } from "./chat.js";

export const allTools = [
  ...typebots,
  ...results,
  ...workspaces,
  ...chat,
];
