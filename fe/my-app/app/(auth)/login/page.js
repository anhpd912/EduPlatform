import NavItem from "@/shared/components/ui/Navbar/nav-item";
import styles from "./page.module.css";
import { ArrowBack } from "@mui/icons-material";
import FormLogin from "./components/FormLogin";

export const metadata = {
  title: "EduPlatform - Login",
  description:
    "Access your EduPlatform account and continue learning and teaching.",
};

export default function LoginPage() {
  return (
    <div className={styles.Container}>
      <div className={styles.ButtonGroup}>
        <NavItem href={"/"} isBack={true}>
          <ArrowBack sx={{ color: "black" }} />
          Back to Home
        </NavItem>
      </div>
      <div className={styles.LoginContainer}>
        <FormLogin />
      </div>
    </div>
  );
}
