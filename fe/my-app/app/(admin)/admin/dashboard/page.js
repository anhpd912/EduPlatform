"use client";
import { authStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useSnapshot } from "valtio";

export default function DashBoardPage() {
  const snap = useSnapshot(authStore);
  const role = snap.role;
  const router = useRouter();
  if (role !== "ADMIN") {
    router.push("/login");
  }
  return <div>Dashboard Page</div>;
}
