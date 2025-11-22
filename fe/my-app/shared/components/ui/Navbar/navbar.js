"use client";
import { useSnapshot } from "valtio";
import Logo from "./logo";
import NavItem from "./nav-item";
import styles from "./navbar.module.css";
import { authStore } from "@/store/authStore";
export default function NavBar() {
  const snap = useSnapshot(authStore);
  const isAuthenticated = snap.isAuthenticated;
  return (
    <div>
      <ul className={styles.NavBar}>
        <Logo />
        {!isAuthenticated && (
          <>
            <NavItem href="/login" isLogin={true}>
              Login
            </NavItem>
            <NavItem href="/register" isRegister={true}>
              Register
            </NavItem>
          </>
        )}
        {isAuthenticated && <NavItem>Log Out</NavItem>}
      </ul>
    </div>
  );
}
