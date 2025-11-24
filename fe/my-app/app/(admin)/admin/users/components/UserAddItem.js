"use client";
import { useState } from "react";
import { Close } from "@mui/icons-material";
import styles from "./user-add.module.css";
import { toast } from "react-toastify";
import { UserService } from "@/shared/services/api/User/UserService";

export default function UserAddItem({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    gender: true,
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    avatarUrl: "",
    authProvider: "LOCAL",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? e.target.checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await UserService.createUser(formData);
      toast.success("User created successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.Overlay} onClick={onClose}>
      <div className={styles.Modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.Header}>
          <h2>Add New User</h2>
          <button onClick={onClose} className={styles.CloseButton}>
            <Close />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.Form}>
          <div className={styles.FormGrid}>
            <div className={styles.FormGroup}>
              <label htmlFor="username">Username *</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.FormGroup}>
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.FormGroup}>
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <div className={styles.FormGroup}>
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className={styles.FormGroup}>
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div className={styles.FormGroup}>
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            <div className={styles.FormGroup}>
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className={styles.FormGroup}>
              <label htmlFor="avatarUrl">Avatar URL</label>
              <input
                type="url"
                id="avatarUrl"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className={styles.FormGroup}>
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    gender: e.target.value === "true",
                  }))
                }
              >
                <option value="true">Male</option>
                <option value="false">Female</option>
              </select>
            </div>

            <div className={styles.FormGroup}>
              <label htmlFor="authProvider">Auth Provider</label>
              <select
                id="authProvider"
                name="authProvider"
                value={formData.authProvider}
                onChange={handleChange}
              >
                <option value="LOCAL">LOCAL</option>
                <option value="GOOGLE">GOOGLE</option>
                <option value="FACEBOOK">FACEBOOK</option>
                <option value="GITHUB">GITHUB</option>
              </select>
            </div>
          </div>

          <div className={styles.Footer}>
            <button
              type="button"
              onClick={onClose}
              className={styles.CancelBtn}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.SubmitBtn}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
