import { tools as surveys } from "./surveys.js";
import { tools as questions } from "./questions.js";
import { tools as responses } from "./responses.js";
import { tools as participants } from "./participants.js";

export const allTools = [
  ...surveys,
  ...questions,
  ...responses,
  ...participants,
];
