"use client";

import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Custom Dashboard</title>
        <link rel="icon" type="image/x-icon" href="../favicon.ico"></link>
      </head>
      <body>{children}</body>
    </html>
  );
}
