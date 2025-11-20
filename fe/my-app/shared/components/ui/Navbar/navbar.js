import Logo from "./logo";
import NavItem from "./nav-item";
import styles from "./navbar.module.css";
export default function NavBar() {
  return (
    <div>
      <ul className={styles.NavBar}>
        <Logo />
        <NavItem href="/login" isLogin={true}>
          Login
        </NavItem>
        <NavItem href="/register" isRegister={true}>
          Register
        </NavItem>
      </ul>
    </div>
  );
}
