import FormItem from "@/shared/components/ui/Form/FormItem";
import { School } from "@mui/icons-material";
import styles from "./form.module.css";
import Link from "next/link";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
export default function FormLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  return (
    <div className={styles.FormLogin}>
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
          Login to Your Account
        </p>
        <p>Welcome back to EduPlatform</p>
      </div>
      <form className={styles.FormBody}>
        <FormItem
          label="Username"
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={"Enter your username"}
          required
        />

        <FormItem
          label="Password"
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={"Enter your password"}
          required
        />
        <div className={styles.FormOptions}>
          <label>
            <input type="checkbox" name="rememberMe" /> Remember Me
          </label>
          <Link href="/forgot-password" className={styles.ForgotLink}>
            Forgot Password?
          </Link>
        </div>
        <div className={styles.FormButton}>
          <button type="submit">Login</button>
        </div>
        <div className={styles.FormFooter}>
          <p>
            {"Don't have an account? "}
            <Link href="/register" className={styles.RegisterLink}>
              Register here
            </Link>
          </p>
        </div>
        <ToastContainer autoClose={3000} hideProgressBar />
      </form>
    </div>
  );
}
