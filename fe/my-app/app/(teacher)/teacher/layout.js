"use client";
import NavBar from "@/shared/components/ui/Navbar/navbar";
import { RequiredAuth } from "@/shared/components/ui/RequiredAuth/requiredauth";

export default function TeacherLayout({ children }) {
  return (
    <RequiredAuth allowedRoles={["TEACHER"]}>
      <div>
        <nav>
          <NavBar />
        </nav>
        {children}
      </div>
    </RequiredAuth>
  );
}
