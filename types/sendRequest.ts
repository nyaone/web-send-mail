import type { Server } from "./server";
import type { Template } from "./template";

export type SendRequest = {
  server: Omit<Server, "senders">;
  sender: string;
  receivers: string[];
  mail: Template;
};
