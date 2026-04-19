import { getEventTypeTools } from "./event-types.js";
import { getBookingTools } from "./bookings.js";
import { getAvailabilityTools } from "./availability.js";
import { getScheduleTools } from "./schedules.js";
import { getUserTools } from "./users.js";
import { getTeamTools } from "./teams.js";
import { getWebhookTools } from "./webhooks.js";

export const allTools = [
  ...getEventTypeTools(),
  ...getBookingTools(),
  ...getAvailabilityTools(),
  ...getScheduleTools(),
  ...getUserTools(),
  ...getTeamTools(),
  ...getWebhookTools(),
];
