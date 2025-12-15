"use client";
import "@/app/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LanguageProvider } from "@/shared/contexts/LanguageContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <LanguageProvider>
          <div>
            <main>{children}</main>
          </div>
          <ToastContainer />
        </LanguageProvider>
      </body>
    </html>
  );
}
