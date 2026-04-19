import { customerTools } from "./customers.js";
import { subscriptionTools } from "./subscriptions.js";
import { invoiceTools } from "./invoices.js";
import { planTools } from "./plans.js";
import { eventTools } from "./events.js";
import { walletTools } from "./wallets.js";

export const allTools = [
  ...customerTools,
  ...subscriptionTools,
  ...invoiceTools,
  ...planTools,
  ...eventTools,
  ...walletTools,
];
