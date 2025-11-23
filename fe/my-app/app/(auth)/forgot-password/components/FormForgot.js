import NavItem from "@/shared/components/ui/Navbar/nav-item";
import { School } from "@mui/icons-material";
import styles from "./form.module.css";
import FormItem from "@/shared/components/ui/Form/FormItem";
export default function ForgotPasswordForm() {
  return (
    <div className={styles.FormForgotPassword}>
      <div className={styles.FormHeader}>
        <div className={styles.Logo}>
          <School style={{ fontSize: 40 }} htmlColor="#fff" />
        </div>
        <p
          style={{
            color: "#1140a7ff",
            marginBottom: "10px",
          }}
        >
          Reset Your Password
        </p>
        <p>Please enter your email to receive a password reset link.</p>
      </div>
      <form className={styles.FormBody}>
        <FormItem
          type="email"
          id="email"
          name="email"
          placeholder={"Enter your email address"}
          required
        />

        <div className={styles.FormButton}>
          <button type="submit">Send Reset Link</button>
        </div>
      </form>
    </div>
  );
}
