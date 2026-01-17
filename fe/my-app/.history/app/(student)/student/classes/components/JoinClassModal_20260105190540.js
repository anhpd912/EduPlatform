"use client";

import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { ClassStudentService } from "@/shared/services/api/ClassStudent/ClassStudentService";
import styles from "./JoinClassModal.module.css";

export default function JoinClassModal({ isOpen, onClose, onSuccess, translations }) {
  const t = translations;
  const [classCode, setClassCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!classCode.trim()) {
      setError(t.classCodeRequired || "Please enter a class code");
      return;
    }

    try {
      setJoining(true);
      setError("");
      await ClassStudentService.joinByClassCode({
        classCode: classCode.trim(),
      });
      setClassCode("");
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error joining class:", err);
      setError(
        err.response?.data?.message ||
          t.errorJoiningClass ||
          "Error joining class. Please check the code and try again."
      );
    } finally {
      setJoining(false);
    }
  };

  const handleClose = () => {
    setClassCode("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.ModalOverlay} onClick={handleClose}>
      <div className={styles.Modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.ModalHeader}>
          <h2>{t.joinClass || "Join Class"}</h2>
          <button className={styles.CloseButton} onClick={handleClose}>
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.ModalBody}>
          <p className={styles.ModalDescription}>
            {t.enterClassCodeToJoin ||
              "Enter the class code provided by your teacher to join the class."}
          </p>

          <div className={styles.FormGroup}>
            <label>{t.classCode || "Class Code"}</label>
            <input
              type="text"
              value={classCode}
              onChange={(e) => {
                setClassCode(e.target.value.toUpperCase());
                setError("");
              }}
              placeholder={t.enterClassCode || "Enter class code"}
              className={error ? styles.InputError : ""}
              autoFocus
            />
            {error && <span className={styles.ErrorText}>{error}</span>}
          </div>

          <div className={styles.ModalActions}>
            <button
              type="button"
              className={styles.CancelButton}
              onClick={handleClose}
            >
              {t.cancel || "Cancel"}
            </button>
            <button
              type="submit"
              className={styles.SubmitButton}
              disabled={joining}
            >
              {joining ? (
                <>
                  <AutorenewIcon className={styles.SpinnerSmall} />
                  {t.joining || "Joining..."}
                </>
              ) : (
                <>
                  <AddIcon />
                  {t.joinClass || "Join Class"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
