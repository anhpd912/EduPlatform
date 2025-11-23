"use client";
import { logoutAction } from "@/store/authStore";

export default function Logout() {
  logoutAction();
}
