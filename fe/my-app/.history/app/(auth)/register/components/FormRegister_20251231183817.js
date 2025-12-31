"use client";
import { useState } from "react";
import { School } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import styles from "./form.module.css";
import FormItem from "@/shared/components/ui/Form/FormItem";
import Link from "next/link";
import { AuthService } from "@/shared/services/api/Auth/AuthService";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";

export default function FormRegister() {
  const { language } = useLanguage();
  const t = translations[language];

  const [currentStep, setCurrentStep] = useState(1);

  // Basic info
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");

  // Parent info for Student role
  const [parentData, setParentData] = useState({
    parentName: "",
    parentPhone: "",
  });

  // Teacher info for Teacher role
  const [teacherData, setTeacherData] = useState({
    expertise: "",
  });

  const [errorPassword, setErrorPassword] = useState(null);
  const [errorPasswordFormat, setErrorPasswordFormat] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateStep1 = () => {
    if (!fullName.trim()) {
      toast.error(t.fullNameRequired || "Full name is required");
      return false;
    }
    if (!username.trim()) {
      toast.error(t.usernameRequired || "Username is required");
      return false;
    }
    if (!email.trim()) {
      toast.error(t.emailRequired || "Email is required");
      return false;
    }
    if (!dateOfBirth) {
      toast.error(t.dateOfBirthRequired || "Date of birth is required");
      return false;
    }
    if (!password) {
      toast.error(t.passwordRequired || "Password is required");
      return false;
    }
    if (errorPasswordFormat) {
      toast.error(errorPasswordFormat);
      return false;
    }
    if (!confirmPassword) {
      toast.error(t.confirmPasswordRequired || "Please confirm your password");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error(t.passwordsDoNotMatch || "Passwords do not match");
      return false;
    }
    if (!role) {
      toast.error(t.selectRoleRequired || "Please select a role");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (!validateStep1()) return;
    setCurrentStep(2);
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleParentChange = (e) => {
    const { name, value } = e.target;
    setParentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTeacherChange = (e) => {
    const { name, value } = e.target;
    setTeacherData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    const submitData = {
      fullName,
      username,
      email,
      dateOfBirth,
      gender,
      password,
      role,
    };

    // Add studentInfo for Student role
    if (role === "STUDENT") {
      submitData.studentInfo = {
        parentName: parentData.parentName || null,
        parentPhone: parentData.parentPhone || null,
      };
    }

    // Add teacherInfo for Teacher role
    if (role === "TEACHER") {
      submitData.teacherInfo = {
        expertise: teacherData.expertise || null,
      };
    }

    AuthService.register(submitData)
      .then((response) => {
        setLoading(false);
        if (response.statusCode === 200) {
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

    if (confirmPassword.length > 0 && newPassword !== confirmPassword) {
      setErrorPassword("Passwords do not match");
    } else {
      setErrorPassword(null);
    }
  };

  // Dynamic options based on language
  const genderOptions = [
    { value: true, label: t.male || "Male" },
    { value: false, label: t.female || "Female" },
  ];

  const roleOptions = [
    { value: "STUDENT", label: t.student || "Student" },
    { value: "TEACHER", label: t.teacher || "Teacher" },
  ];

  const renderStep1 = () => (
    <>
      <FormItem
        label={t.fullName || "Full Name"}
        type="text"
        id="fullName"
        name="fullName"
        placeholder={t.enterFullName || "Enter your full name"}
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />
      <FormItem
        label={t.username || "Username"}
        type="text"
        id="username"
        name="username"
        placeholder={t.enterUsername || "Enter your username"}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <FormItem
        label={t.email || "Email"}
        type="email"
        id="email"
        name="email"
        placeholder={t.enterEmail || "your.email@eduplatform.edu"}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <FormItem
        label={t.dateOfBirth || "Date of Birth"}
        type="date"
        id="dateOfBirth"
        name="dateOfBirth"
        placeholder={t.selectDateOfBirth || "Select your date of birth"}
        value={dateOfBirth}
        onChange={(e) => setDateOfBirth(e.target.value)}
        required
      />
      <FormItem
        label={t.gender || "Gender"}
        select
        id="gender"
        name="gender"
        placeholder={t.selectGender || "Select your gender"}
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        options={genderOptions}
        required
      />
      <FormItem
        label={t.password || "Password"}
        type="password"
        id="password"
        name="password"
        placeholder={t.enterPassword || "Enter your password"}
        value={password}
        onChange={handlePasswordChange}
        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
        title={
          t.passwordRequirements ||
          "Password must contain at least one number, one uppercase and lowercase letter, and at least 8 or more characters"
        }
        required
        error={errorPasswordFormat}
      />
      <FormItem
        label={t.confirmPassword || "Confirm Password"}
        type="password"
        id="confirm-password"
        name="confirm-password"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        placeholder={t.confirmYourPassword || "Confirm your password"}
        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
        title={
          t.passwordRequirements ||
          "Password must contain at least one number, one uppercase and lowercase letter, and at least 8 or more characters"
        }
        required
        error={errorPassword}
      />
      <FormItem
        label={t.role || "Role"}
        select
        id="role"
        name="role"
        placeholder={t.selectRole || "Select your role"}
        value={role}
        onChange={(e) => setRole(e.target.value)}
        options={roleOptions}
        required
      />
      <div className={styles.FormButton}>
        <button
          type="button"
          onClick={handleNextStep}
          disabled={loading || !role}
        >
          {t.next || "Next"}
          <ArrowForwardIcon fontSize="small" style={{ marginLeft: 4 }} />
        </button>
      </div>
    </>
  );

  const renderStep2 = () => {
    if (role === "STUDENT") {
      return (
        <>
          <div className={styles.StepHeader}>
            <h3>{t.parentInformation || "Parent Information"}</h3>
            <p className={styles.StepDescription}>
              {t.parentInfoDescription ||
                "Please provide parent/guardian contact information."}
            </p>
          </div>

          <FormItem
            label={t.parentName || "Parent Name"}
            type="text"
            id="parentName"
            name="parentName"
            placeholder={t.enterParentName || "Enter parent name"}
            value={parentData.parentName}
            onChange={handleParentChange}
          />
          <FormItem
            label={t.parentPhone || "Parent Phone"}
            type="tel"
            id="parentPhone"
            name="parentPhone"
            placeholder={t.enterParentPhone || "Enter parent phone"}
            value={parentData.parentPhone}
            onChange={handleParentChange}
          />

          <div className={styles.FormButtonGroup}>
            <button
              type="button"
              onClick={handlePrevStep}
              className={styles.SecondaryButton}
              disabled={loading}
            >
              <ArrowBackIcon fontSize="small" style={{ marginRight: 4 }} />
              {t.back || "Back"}
            </button>
            <button type="button" onClick={handleSubmit} disabled={loading}>
              {loading
                ? t.registering || "Registering..."
                : t.register || "Register"}
            </button>
          </div>
        </>
      );
    }

    // TEACHER role
    return (
      <>
        <div className={styles.StepHeader}>
          <h3>{t.teacherInformation || "Teacher Information"}</h3>
          <p className={styles.StepDescription}>
            {t.teacherInfoDescription ||
              "Please provide your area of expertise."}
          </p>
        </div>

        <FormItem
          label={t.expertise || "Expertise"}
          type="text"
          id="expertise"
          name="expertise"
          placeholder={
            t.enterExpertise ||
            "Enter area of expertise (e.g., Mathematics, Physics)"
          }
          value={teacherData.expertise}
          onChange={handleTeacherChange}
        />

        <div className={styles.FormButtonGroup}>
          <button
            type="button"
            onClick={handlePrevStep}
            className={styles.SecondaryButton}
            disabled={loading}
          >
            <ArrowBackIcon fontSize="small" style={{ marginRight: 4 }} />
            {t.back || "Back"}
          </button>
          <button type="button" onClick={handleSubmit} disabled={loading}>
            {loading
              ? t.registering || "Registering..."
              : t.register || "Register"}
          </button>
        </div>
      </>
    );
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
          {t.createAccount || "Create Account"}
        </p>
        <p>{t.joinEduPlatform || "Join EduPlatform"}</p>
      </div>

      {/* Step Indicator */}
      {role && (
        <div className={styles.StepIndicator}>
          <div
            className={`${styles.Step} ${
              currentStep >= 1 ? styles.StepActive : ""
            }`}
          >
            <span className={styles.StepNumber}>1</span>
            <span className={styles.StepLabel}>
              {t.basicInfo || "Basic Info"}
            </span>
          </div>
          <div className={styles.StepLine}></div>
          <div
            className={`${styles.Step} ${
              currentStep >= 2 ? styles.StepActive : ""
            }`}
          >
            <span className={styles.StepNumber}>2</span>
            <span className={styles.StepLabel}>
              {role === "STUDENT"
                ? t.parentInfo || "Parent Info"
                : t.teacherInfo || "Teacher Info"}
            </span>
          </div>
        </div>
      )}

      <form className={styles.FormBody} onSubmit={(e) => e.preventDefault()}>
        {currentStep === 1 ? renderStep1() : renderStep2()}

        {currentStep === 1 && (
          <div className={styles.FormFooter}>
            <p>
              {t.alreadyHaveAccount || "Already have an account?"}{" "}
              <Link href="/login">{t.loginHere || "Login here"}</Link>
            </p>
          </div>
        )}
      </form>
      <ToastContainer autoClose={3000} closeButton />
    </div>
  );
}
