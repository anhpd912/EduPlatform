"use client";
import "@/app/globals.css";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <div>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
