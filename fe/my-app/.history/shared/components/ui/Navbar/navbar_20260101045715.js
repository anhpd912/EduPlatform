"use client";
import { useSnapshot } from "valtio";
import Logo from "./logo";
import NavItem from "./nav-item";
import styles from "./navbar.module.css";
import { authStore, logoutAction } from "@/store/authStore";
import {
  AccountCircle,
  Logout,
  Settings,
  Person,
  Language,
  Chat,
} from "@mui/icons-material";
import Link from "next/link";
import { AuthService } from "@/shared/services/api/Auth/AuthService";
import { useEffect } from "react";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";

export default function NavBar() {
  const { isAuthenticated } = useSnapshot(authStore);
  const { username } = useSnapshot(authStore);
  const { refreshToken } = useSnapshot(authStore);
  const { role } = useSnapshot(authStore);
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];

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
        <button className={styles.LanguageToggle} onClick={toggleLanguage}>
          <Language fontSize="small" />
          <span>{language === "en" ? "EN" : "VI"}</span>
        </button>
        {isAuthenticated ? (
          <div className={styles.UserSection}>
            <span className={styles.UserName}>{username.toUpperCase()}</span>
            <AccountCircle color="primary" fontSize="large" />
            <div className={styles.DropdownMenu}>
              <Link href="/profile" className={styles.DropdownItem}>
                <Person fontSize="small" />
                <span>{t.profile}</span>
              </Link>
              <Link href="/setting" className={styles.DropdownItem}>
                <Settings fontSize="small" />
                <span>{t.settings}</span>
              </Link>
              <div className={styles.Divider}></div>
              <Link
                href="/login"
                onClick={handleLogOut}
                className={styles.DropdownItem}
              >
                <Logout fontSize="small" />
                <span>{t.logout}</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <NavItem href="/login" isLogin={true}>
              {t.login}
            </NavItem>
            <NavItem href="/register" isRegister={true}>
              {t.register}
            </NavItem>
          </>
        )}
      </ul>
    </div>
  );
}
