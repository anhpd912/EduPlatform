"use client";
import { useEffect } from "react";
import { useSnapshot } from "valtio";
import { useRouter } from "next/navigation";
import { authStore } from "@/store/authStore";

export const RequiredAuth = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, role } = useSnapshot(authStore);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Check role if allowedRoles is specified
    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      router.push("/403");
    }
  }, [isAuthenticated, role, router, allowedRoles]);

  // Show nothing while checking auth
  if (!isAuthenticated) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  // Check role access
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return null;
  }

  return children;
};
