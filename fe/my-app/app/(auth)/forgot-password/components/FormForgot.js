"use client";
import { School } from "@mui/icons-material";
import styles from "./form.module.css";
import FormItem from "@/shared/components/ui/Form/FormItem";
import { useEffect, useState } from "react";
import { AuthService } from "@/shared/services/api/Auth/AuthService";
import { toast } from "react-toastify";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    document.title = "Forgot Password - MyApp";
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Handle form submission logic here
    console.log("Email:", email);
    AuthService.resetPassword({ email })
      .then((response) => {
        toast.success("Password reset link has been sent to your email.");
      })
      .catch((error) => {
        toast.error("Failed to send password reset link.");
      })
      .finally(() => {
        setLoading(false);
      });
  };
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
      <form className={styles.FormBody} onSubmit={handleSubmit}>
        <FormItem
          type="email"
          id="email"
          name="email"
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={"Enter your email address"}
          required
        />

        <div className={styles.FormButton}>
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </div>
      </form>
    </div>
  );
}
