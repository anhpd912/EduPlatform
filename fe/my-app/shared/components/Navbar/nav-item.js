import Link from "next/link";
import styles from "./nav-item.module.css";
export default function NavItem({ children, href, type }) {
  return (
    <li
      className={`${styles.NavItem} ${type === "Login" ? styles.Login : styles.Register}`}
    >
      <Link href={href}>{children}</Link>
    </li>
  );
}
