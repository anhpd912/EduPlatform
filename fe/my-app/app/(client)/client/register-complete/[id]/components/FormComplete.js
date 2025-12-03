"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { School, Person, MenuBook } from "@mui/icons-material";
import styles from "./form-complete.module.css";
import { UserService } from "@/shared/services/api/User/UserService";

export default function FormComplete({ id }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const roles = [
    {
      id: "STUDENT",
      name: "Student",
      icon: <Person style={{ fontSize: 40 }} />,
      description: "I want to learn and take courses",
      color: "#4a90e2",
    },
    {
      id: "TEACHER",
      name: "Teacher",
      icon: <MenuBook style={{ fontSize: 40 }} />,
      description: "I want to create and teach courses",
      color: "#6051e6",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedRole) {
      toast.error("Please select a role to continue");
      return;
    }

    setLoading(true);

    try {
      const response = await UserService.completeRegistration({
        userId: id,
        roleName: selectedRole,
      });
      if (response.statusCode === 200) {
        router.push(
          "/login?message=Registration completed successfully. Please log in."
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to complete registration"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.FormComplete}>
      <div className={styles.FormHeader}>
        <div className={styles.Logo}>
          <School style={{ fontSize: 40 }} htmlColor="#fff" />
        </div>
        <h2 className={styles.Title}>You are new here</h2>
        <p className={styles.Subtitle}>Choose your role to get started</p>
      </div>

      <form className={styles.FormBody} onSubmit={handleSubmit}>
        <div className={styles.RoleContainer}>
          {roles.map((role) => (
            <div
              key={role.id}
              className={`${styles.RoleCard} ${
                selectedRole === role.id ? styles.Selected : ""
              }`}
              onClick={() => setSelectedRole(role.id)}
              style={{
                borderColor: selectedRole === role.id ? role.color : "#e2e8f0",
              }}
            >
              <div
                className={styles.RoleIcon}
                style={{
                  backgroundColor:
                    selectedRole === role.id ? role.color : "#f1f5f9",
                  color: selectedRole === role.id ? "#fff" : role.color,
                }}
              >
                {role.icon}
              </div>
              <h3 className={styles.RoleName}>{role.name}</h3>
              <p className={styles.RoleDescription}>{role.description}</p>
              <div
                className={`${styles.RadioCircle} ${
                  selectedRole === role.id ? styles.RadioSelected : ""
                }`}
                style={{
                  borderColor:
                    selectedRole === role.id ? role.color : "#cbd5e1",
                  backgroundColor:
                    selectedRole === role.id ? role.color : "transparent",
                }}
              >
                {selectedRole === role.id && (
                  <span className={styles.RadioCheck}>✓</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.FormButton}>
          <button type="submit" disabled={loading || !selectedRole}>
            {loading ? "Completing..." : "Complete Registration"}
          </button>
        </div>

        <div className={styles.FormFooter}>
          <p>
            Already have an account?{" "}
            <a href="/login" className={styles.LoginLink}>
              Login here
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
