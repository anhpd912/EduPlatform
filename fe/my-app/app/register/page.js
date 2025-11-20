import NavItem from "@/shared/components/ui/Navbar/nav-item";
import FormRegister from "./components/FormRegister";
import styles from "./page.module.css";
import { ArrowBack } from "@mui/icons-material";
export default function RegisterPage() {
  return (
    <div className={styles.Container}>
      <div className={styles.ButtonGroup}>
        <NavItem href={"/"} isBack={true}>
          <ArrowBack sx={{ color: "black" }} />
          Back to Home
        </NavItem>
      </div>
      <div className={styles.RegisterContainer}>
        <FormRegister />
      </div>
    </div>
  );
}
