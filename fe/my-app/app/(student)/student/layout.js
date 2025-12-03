"use client";
import NavBar from "@/shared/components/ui/Navbar/navbar";
import { RequiredAuth } from "@/shared/components/ui/RequiredAuth/requiredauth";

export default function StudentLayout({ children }) {
  return (
    <RequiredAuth allowedRoles={["STUDENT"]}>
      <div>
        <nav>
          <NavBar />
        </nav>
        {children}
      </div>
    </RequiredAuth>
  );
}
