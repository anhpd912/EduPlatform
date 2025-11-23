"use client";
import { useState } from "react";
import { School } from "@mui/icons-material";
import styles from "./form.module.css";
import FormItem from "@/shared/components/ui/Form/FormItem";
import Link from "next/link";
import { ROLES_REGISTER, GENDERS } from "@/shared/constants/constants";
import { AuthService } from "@/shared/services/api/Auth/AuthService";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
export default function FormRegister() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState(null);
  const [errorPasswordFormat, setErrorPasswordFormat] = useState(null);
  const [role, setRole] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
    setLoading(true);
    setError(null);
    AuthService.register({
      fullName,
      username,
      email,
      dateOfBirth,
      gender,
      password,
      role,
    })
      .then((response) => {
        setLoading(false);
        if (response.statusCode === 200) {
          // Registration successful
          router.push("/login?message=Registration successful. Please log in.");
        } else {
          setError(response.message);
          toast.error("Registration failed: " + response.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        const errorMessage =
          err.response?.data?.message || "An unexpected error occurred.";
        setError(errorMessage);
        toast.error("Registration failed: " + errorMessage);
      });
  };
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

  return (
    <div className={styles.FormRegister}>
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
          Create Account
        </p>
        <p>Join EduPlatform</p>
      </div>
      <form className={styles.FormBody} onSubmit={handleSubmit}>
        <FormItem
          label="Full Name"
          type="text"
          id="fullName"
          name="fullName"
          placeholder={"Enter your full name"}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <FormItem
          label="Username"
          type="text"
          id="username"
          name="username"
          placeholder={"Enter your username"}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <FormItem
          label="Email"
          type="email"
          id="email"
          name="email"
          placeholder={"your.email@eduplatform.edu"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <FormItem
          label="Date of Birth"
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          placeholder={"Select your date of birth"}
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          required
        />
        <FormItem
          label="Gender"
          select
          id="gender"
          name="gender"
          placeholder="Select your gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          options={GENDERS}
          required
        />
        <FormItem
          label="Password"
          type="password"
          id="password"
          name="password"
          placeholder={"Enter your password"}
          value={password}
          onChange={handlePasswordChange}
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          title="Password must contain at least one number, one uppercase and lowercase letter, and at least 8 or more characters"
          required
          error={errorPasswordFormat}
        />

        <FormItem
          label="Confirm Password"
          type="password"
          id="confirm-password"
          name="confirm-password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          placeholder={"Confirm your password"}
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          title="Password must contain at least one number, one uppercase and lowercase letter, and at least 8 or more characters"
          required
          error={errorPassword}
        />

        <FormItem
          label="Role"
          select
          id="role"
          name="role"
          placeholder="Select your role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          options={ROLES_REGISTER}
          required
        />
        <div className={styles.FormButton}>
          <button type="submit">
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
        <div className={styles.FormFooter}>
          <p>
            Already have an account? <Link href="/login">Login here</Link>
          </p>
        </div>
      </form>
      <ToastContainer autoClose={3000} closeButton />
    </div>
  );
}
