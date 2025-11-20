import Logo from "./logo";
import NavItem from "./nav-item";
import styles from "./navbar.module.css";
export default function NavBar() {
  return (
    <div>
      <ul className={styles.NavBar}>
        <Logo />
        <NavItem href="/login" type="Login">
          Login
        </NavItem>
        <NavItem href="/register" type="Register">
          Register
        </NavItem>
      </ul>
    </div>
  );
}
