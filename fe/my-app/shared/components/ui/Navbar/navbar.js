"use client";
import { useSnapshot } from "valtio";
import Logo from "./logo";
import NavItem from "./nav-item";
import styles from "./navbar.module.css";
import { authStore } from "@/store/authStore";
import { useState, useEffect } from "react";

export default function NavBar() {
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated } = useSnapshot(authStore);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div>
      <ul className={styles.NavBar}>
        <Logo />
        {mounted && (
          <>
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
          </>
        )}
      </ul>
    </div>
  );
}
