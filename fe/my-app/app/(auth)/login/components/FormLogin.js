"use client";
import FormItem from "@/shared/components/ui/Form/FormItem";
import { School } from "@mui/icons-material";
import styles from "./form.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSnapshot } from "valtio";
import { authStore, loginAction } from "@/store/authStore";
import { AuthService } from "@/shared/services/api/Auth/AuthService";
import { useRouter, useSearchParams } from "next/navigation";
import { getRedirectPath } from "@/shared/utils/authHelpers";
export default function FormLogin() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const snap = useSnapshot(authStore);
  const router = useRouter();
  // Redirect if already authenticated
  useEffect(() => {
    if (snap.isAuthenticated) {
      let redirectPath = getRedirectPath(snap.isAuthenticated, snap.role);
      router.push(redirectPath);
    }
  }, [snap.isAuthenticated, snap.role, router]);
  // Show message if provided
  useEffect(() => {
    console.log("Log message", message);
    if (message) {
      toast.success(message);
    }
  }, [message]);
  useEffect(() => {
    // Check for remembered credentials
    const rememberedUsername = localStorage.getItem("rememberedUsername");
    const rememberedPassword = localStorage.getItem("rememberedPassword");
    if (rememberedUsername && rememberedPassword) {
      setUsername(rememberedUsername);
      setPassword(rememberedPassword);
      setRememberMe(true);
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (rememberMe) {
      localStorage.setItem("rememberedUsername", username);
      localStorage.setItem("rememberedPassword", password);
    }
    try {
      const response = await AuthService.login({ username, password });
      console.log(response);
      if (response.statusCode === 200) {
        loginAction(
          response.data.token,
          response.data.token,
          response.data.userResponse.username,
          response.data.userResponse.roles[0].name
        );
      } else {
        setError(response.message);
      }
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
          <label htmlFor="rememberMe">
            <input
              onChange={(e) => setRememberMe(e.target.checked)}
              type="checkbox"
              name="rememberMe"
              id="rememberMe"
            />{" "}
            Remember Me
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
        <ToastContainer autoClose={2000} closeButton closeOnClick />
      </form>
    </div>
  );
}
