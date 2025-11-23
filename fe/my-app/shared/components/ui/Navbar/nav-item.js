import Link from "next/link";
import styles from "./nav-item.module.css";
import clsx from "clsx";
export default function NavItem({
  children,
  href,
  isLogin,
  isBack,
  isRegister,
  isLink,
}) {
  const navItemClass = clsx(styles.NavItem, {
    [styles.Login]: isLogin,
    [styles.Back]: isBack,
    [styles.Register]: isRegister,
    [styles.Link]: isLink,
  });

  return (
    <li className={navItemClass}>
      <Link href={href}>{children}</Link>
    </li>
  );
}
