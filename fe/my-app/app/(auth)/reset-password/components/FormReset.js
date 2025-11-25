"use client";
import { useEffect, useState } from "react";
import { AuthService } from "@/shared/services/api/Auth/AuthService";
import FormItem from "@/shared/components/ui/Form/FormItem";
import styles from "./form-reset.module.css";
import { toast } from "react-toastify";
import { School } from "@mui/icons-material";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState(null);
  const [errorPasswordFormat, setErrorPasswordFormat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      return searchParams.get("token") || "";
    }
    return "";
  });

  useEffect(() => {
    document.title = "Reset Password - Eduplatform";
  }, []);
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    const passwordConfirm = e.target.value;
    if (passwordConfirm.length > 0 && password !== passwordConfirm) {
      setErrorPassword("Passwords do not match");
    } else {
      setErrorPassword(null);
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (newPassword.length > 0 && !passwordPattern.test(newPassword)) {
      setErrorPasswordFormat(
        "Password must contain at least one number, one uppercase and lowercase letter, and at least 8 characters"
      );
    } else {
      setErrorPasswordFormat(null);
    }

    // Also check if confirm password still matches
    if (confirmPassword.length > 0 && newPassword !== confirmPassword) {
      setErrorPassword("Passwords do not match");
    } else {
      setErrorPassword(null);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }
    setLoading(true);
    AuthService.changePassword({ token, newPassword: password })
      .then(() => {
        toast.success("Your password has been reset successfully.");
        // Redirect to login page or show a success message
      })
      .catch((error) => {
        toast.error(
          "Failed to reset password. The token may be invalid or expired."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className={styles.FormResetPassword}>
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
        <p>Please enter your new password to reset your password.</p>
      </div>
      <form className={styles.FormBody} onSubmit={handleSubmit}>
        <FormItem
          type="password"
          id="password"
          name="password"
          label="Password"
          value={password}
          onChange={handlePasswordChange}
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          title="Password must contain at least one number, one uppercase and lowercase letter, and at least 8 or more characters"
          placeholder={"Enter your password"}
          error={errorPasswordFormat}
          required
        />

        <FormItem
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          title="Password must contain at least one number, one uppercase and lowercase letter, and at least 8 or more characters"
          placeholder={"Confirm your password"}
          error={errorPassword}
          required
        />
        <div className={styles.FormButton}>
          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
