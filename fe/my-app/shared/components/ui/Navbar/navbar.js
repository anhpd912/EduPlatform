"use client";
import { useSnapshot } from "valtio";
import Logo from "./logo";
import NavItem from "./nav-item";
import styles from "./navbar.module.css";
import { authStore, logoutAction } from "@/store/authStore";
import { AccountCircle, Logout, Settings, Person } from "@mui/icons-material";
import Link from "next/link";
import { AuthService } from "@/shared/services/api/Auth/AuthService";
import { useEffect } from "react";

export default function NavBar() {
  const { isAuthenticated } = useSnapshot(authStore);
  const { username } = useSnapshot(authStore);
  const { refreshToken } = useSnapshot(authStore);
  const { role } = useSnapshot(authStore);
  const handleLogOut = () => {
    logoutAction();
  };
  useEffect(() => {
    // Debugging logs
    console.log("NavBar - isAuthenticated:", isAuthenticated);
    console.log("NavBar - username:", username);
    console.log("NavBar - role:", role);
    console.log("NavBar - refreshToken:", refreshToken);
  }, [isAuthenticated, username, role, refreshToken]);
  return (
    <div>
      <ul className={styles.NavBar}>
        <Logo />
        {isAuthenticated ? (
          <div className={styles.UserSection}>
            <span className={styles.UserName}>{username.toUpperCase()}</span>
            <AccountCircle color="primary" fontSize="large" />
            <div className={styles.DropdownMenu}>
              <Link href="/profile" className={styles.DropdownItem}>
                <Person fontSize="small" />
                <span>Profile</span>
              </Link>
              <Link href="/settings" className={styles.DropdownItem}>
                <Settings fontSize="small" />
                <span>Settings</span>
              </Link>
              <div className={styles.Divider}></div>
              <Link
                href="/login"
                onClick={handleLogOut}
                className={styles.DropdownItem}
              >
                <Logout fontSize="small" />
                <span>Logout</span>
              </Link>
            </div>
          </div>
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
