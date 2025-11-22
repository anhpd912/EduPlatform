"use client";
import FormItem from "@/shared/components/ui/Form/FormItem";
import { School } from "@mui/icons-material";
import styles from "./form.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useSnapshot } from "valtio";
import { authStore, loginAction } from "@/store/authStore";
import { AuthService } from "@/shared/services/api/Auth/AuthService";
import { useRouter } from "next/navigation";
export default function FormLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const snap = useSnapshot(authStore);
  const router = useRouter();
  if (snap.isAuthenticated) {
    router.push("/courses");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.login({ username, password });
      if (response.statusCode === 200) {
        loginAction(
          response.token,
          response.token,
          response.userResponse.username
        );
      }
      router.push("/courses");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
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
          <button onClick={handleSubmit} disabled={loading} type="submit">
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && <span style={{ color: "red" }}>{error}</span>}
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
