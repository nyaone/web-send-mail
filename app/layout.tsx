import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import React from "react";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { theme } from "@/theme";
import { Notifications } from "@mantine/notifications";

export const metadata = {
  title: "Web Send Mail",
  description: "在网页上发送邮件",
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="zh">
      <head>
        <ColorSchemeScript />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Notifications />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
