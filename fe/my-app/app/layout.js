"use client";
import "@/app/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <div>
          <main>{children}</main>
        </div>
        <ToastContainer />
      </body>
    </html>
  );
}
