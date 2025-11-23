import NavItem from "@/shared/components/ui/Navbar/nav-item";
import { ArrowBack } from "@mui/icons-material";
import ForgotPasswordForm from "./components/FormForgot";
import styles from "./page.module.css";
export const metadata = {
  title: "Forgot Password",
  description: "Reset your password",
};
export default function ForgotPasswordPage() {
  return (
    <div className={styles.Container}>
      <div className={styles.ButtonGroup}>
        <NavItem href={"/"} isBack={true}>
          <ArrowBack sx={{ color: "black" }} />
          Back to Home
        </NavItem>
      </div>
      <div className={styles.ForgotContainer}>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
