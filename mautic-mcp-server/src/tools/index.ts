import { tools as contacts } from "./contacts.js";
import { tools as segments } from "./segments.js";
import { tools as campaigns } from "./campaigns.js";
import { tools as emails } from "./emails.js";
import { tools as forms } from "./forms.js";

export const allTools = [
  ...contacts,
  ...segments,
  ...campaigns,
  ...emails,
  ...forms,
];
