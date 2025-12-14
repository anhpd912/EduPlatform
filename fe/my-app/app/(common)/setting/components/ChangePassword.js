"use client";

import { useState } from "react";
import FormItem from "@/shared/components/ui/Form/FormItem";
import styles from "./change-password.module.css";
import { AuthService } from "@/shared/services/api/Auth/AuthService";

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = "Mật khẩu mới phải khác mật khẩu hiện tại";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await AuthService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setSuccess(true);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      setErrors({
        submit:
          error.response?.data?.message ||
          "Đã xảy ra lỗi. Vui lòng thử lại sau.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.ChangePasswordContainer}>
      <form onSubmit={handleSubmit} className={styles.Form}>
        <FormItem
          label="Mật khẩu hiện tại"
          type="password"
          id="currentPassword"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          placeholder="Nhập mật khẩu hiện tại"
          required
        />
        {errors.currentPassword && (
          <p className={styles.ErrorText}>{errors.currentPassword}</p>
        )}

        <FormItem
          label="Mật khẩu mới"
          type="password"
          id="newPassword"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="Nhập mật khẩu mới"
          required
        />
        {errors.newPassword && (
          <p className={styles.ErrorText}>{errors.newPassword}</p>
        )}

        <FormItem
          label="Xác nhận mật khẩu mới"
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Nhập lại mật khẩu mới"
          required
        />
        {errors.confirmPassword && (
          <p className={styles.ErrorText}>{errors.confirmPassword}</p>
        )}

        {errors.submit && (
          <div className={styles.ErrorBox}>{errors.submit}</div>
        )}

        {success && (
          <div className={styles.SuccessBox}>Đổi mật khẩu thành công!</div>
        )}

        <button
          type="submit"
          className={styles.SubmitButton}
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
        </button>
      </form>
    </div>
  );
}
