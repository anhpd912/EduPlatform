import { School } from "@mui/icons-material";
import styles from "./form.module.css";
import FormItem from "./FormItem";
export default function FormRegister() {
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
      <form className={styles.FormBody}>
        <FormItem
          label="Full Name"
          type="text"
          id="fullname"
          name="fullname"
          placeholder={"Enter your full name"}
          required
        />
        <FormItem
          label="Username"
          type="text"
          id="username"
          name="username"
          placeholder={"Enter your username"}
          required
        />
        <FormItem
          label="Email"
          type="email"
          id="email"
          name="email"
          placeholder={"your.email@eduplatform.edu"}
          required
        />
        <FormItem
          label="Date of Birth"
          type="date"
          id="dob"
          name="dob"
          placeholder={"Select your date of birth"}
          required
        />
        <FormItem
          label="Password"
          type="password"
          id="password"
          name="password"
          placeholder={"Enter your password"}
          required
        />

        <FormItem
          label="Confirm Password"
          type="password"
          id="confirm-password"
          name="confirm-password"
          placeholder={"Confirm your password"}
          required
        />
        <FormItem
          label="Role"
          select
          id="role"
          name="role"
          placeholder="Select your role"
          options={[
            { value: "student", label: "Student" },
            { value: "teacher", label: "Teacher" },
          ]}
          required
        />
        <button className={styles.FormButton} type="submit">
          Register
        </button>
      </form>
    </div>
  );
}
