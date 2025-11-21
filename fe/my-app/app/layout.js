"use client";

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
