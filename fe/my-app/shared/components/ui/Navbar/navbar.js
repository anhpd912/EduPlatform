"use client";
import { useSnapshot } from "valtio";
import Logo from "./logo";
import NavItem from "./nav-item";
import styles from "./navbar.module.css";
import { authStore } from "@/store/authStore";

export default function NavBar() {
  const { isAuthenticated } = useSnapshot(authStore);

  return (
    <div>
      <ul className={styles.NavBar}>
        <Logo />
        {isAuthenticated ? (
          <NavItem href="/logout">Log Out</NavItem>
        ) : (
          <>
            <NavItem href="/login" isLogin={true}>
              Login
            </NavItem>
            <NavItem href="/register" isRegister={true}>
              Register
            </NavItem>
          </>
        )}
      </ul>
    </div>
  );
}
