"use client";
import "react-toastify/dist/ReactToastify.css";
import FormItem from "@/shared/components/ui/Form/FormItem";
import styles from "./form.module.css";
import Link from "next/link";
import { Google, School } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSnapshot } from "valtio";
import { authStore, loginAction } from "@/store/authStore";
import { AuthService } from "@/shared/services/api/Auth/AuthService";
import { useRouter, useSearchParams } from "next/navigation";
import { getRedirectPath } from "@/shared/utils/authHelpers";
import { useDeviceInfo } from "@/hooks/useDeviceInfo";
import { BASE_BACKEND_URL } from "@/shared/constants/constants";
import { UserService } from "@/shared/services/api/User/UserService";
export default function FormLogin() {
  const snap = useSnapshot(authStore);
  const deviceInfo = useDeviceInfo();
  const searchParams = useSearchParams();
  const router = useRouter();
  const message = searchParams.get("message");
  const token = searchParams.get("token");
  const errorMsg = searchParams.get("error");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(errorMsg || null);
  const [loading, setLoading] = useState(false);
  // Redirect if already authenticated
  useEffect(() => {
    if (snap.isAuthenticated) {
      let redirectPath = getRedirectPath(snap.isAuthenticated, snap.role);
      router.push(redirectPath);
    }
    if (deviceInfo) {
      console.log("Device Info:", deviceInfo?.friendlyName || "Unknown Device");
    }
  }, [snap.isAuthenticated, snap.role, router, deviceInfo]);
  // Show message if provided
  useEffect(() => {
    if (message) {
      console.log("Log message", message);
      toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    if (errorMsg) {
      setError(errorMsg);
    }
    if (token) {
      console.log("Token received:", token);
      authStore.jwtToken = token;
      const response = UserService.getProfile();
      response.then((res) => {
        if (res.statusCode === 200) {
          loginAction(
            token,
            null,
            res.data.username,
            res.data.roles[0].name,
            res.data.id
          );
          console.log(res.data);
        }
      });
    }
  }, [message, errorMsg, token]);

  /**
   * Async handler for the login form submit event.
   *
   * @async
   * @param {React.FormEvent<HTMLFormElement> | Event} e - The submit event; used to prevent default browser submission.
   * @returns {Promise<void>} A promise that resolves when the login flow completes and the loading state is reset.
   *
   * @sideEffects
   * - Prevents default form submission.
   * - Sets local loading state via setLoading(true/false).
   * - Clears or sets error state via setError.
   * - Logs deviceInfo to the console.
   * - Calls AuthService.login with the current username, password, rememberMe flag and deviceInfo (falls back to "Unknown Device").
   * - On success (response.statusCode === 200) dispatches loginAction with accessToken, refreshToken, username and primary role name.
   * - On failure updates error state with response.message or the caught error payload (err.response?.data?.message).
   *
   * @notes
   * - The function uses outer-scope values: username, password, rememberMe, deviceInfo, setLoading, setError, AuthService, and loginAction.
   * - Exceptions from AuthService.login are caught and converted to UI state; the function does not rethrow.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Log để debug
    console.log("Device Info khi submit:", deviceInfo);

    try {
      const response = await AuthService.login({
        username,
        password,
        rememberMe,
        deviceInfo: deviceInfo?.friendlyName || "Unknown Device",
        ipAddress: deviceInfo?.ipAddress || "Unknown IP",
        location: deviceInfo?.location || "Unknown Location",
      });
      console.log(response);
      if (response.statusCode === 200) {
        loginAction(
          response.data.accessToken,
          response.data.refreshToken,
          response.data.userResponse.username,
          response.data.userResponse.roles[0].name,
          response.data.userResponse.id
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
  const handleLoginGoogle = async (e) => {
    e.preventDefault();
    window.location.href = BASE_BACKEND_URL + "/auth/login/google";
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
              checked={rememberMe}
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
          <button
            onClick={handleLoginGoogle}
            disabled={loading}
            type="submit"
            className={styles.LoginGoogleButton}
          >
            Login with Google <Google />
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
      </form>
    </div>
  );
}
