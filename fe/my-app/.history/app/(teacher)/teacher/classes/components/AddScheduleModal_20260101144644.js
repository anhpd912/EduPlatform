"use client";

import { useState } from "react";
import styles from "./AddScheduleModal.module.css";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";

export default function AddScheduleModal({ classData, onClose, onSave }) {
  const { language } = useLanguage();
  const t = translations[language];

  const [formData, setFormData] = useState({
    dayOfWeek: "MONDAY",
    startTime: "08:00",
    endTime: "09:30",
    room: "",
    subjectName: "",
  });

  const [loading, setLoading] = useState(false);

  const daysOfWeek = [
    { value: "MONDAY", label: t.monday || "Monday" },
    { value: "TUESDAY", label: t.tuesday || "Tuesday" },
    { value: "WEDNESDAY", label: t.wednesday || "Wednesday" },
    { value: "THURSDAY", label: t.thursday || "Thursday" },
    { value: "FRIDAY", label: t.friday || "Friday" },
    { value: "SATURDAY", label: t.saturday || "Saturday" },
    { value: "SUNDAY", label: t.sunday || "Sunday" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const scheduleData = {
        ...formData,
        classId: classData.id,
      };
      await onSave(scheduleData);
      onClose();
    } catch (err) {
      console.error("Error saving schedule:", err);
      alert(t.errorSavingSchedule || "Error saving schedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.Overlay}>
      <div className={styles.Modal}>
        <div className={styles.ModalHeader}>
          <div className={styles.HeaderInfo}>
            <CalendarMonthIcon />
            <div>
              <h2>{t.addSchedule || "Add Schedule"}</h2>
              <p>{classData.name}</p>
            </div>
          </div>
          <button className={styles.CloseButton} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.Form}>
          <div className={styles.FormGroup}>
            <label>{t.dayOfWeek || "Day of Week"}</label>
            <select
              name="dayOfWeek"
              value={formData.dayOfWeek}
              onChange={handleChange}
              required
            >
              {daysOfWeek.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.FormRow}>
            <div className={styles.FormGroup}>
              <label>{t.startTime || "Start Time"}</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.FormGroup}>
              <label>{t.endTime || "End Time"}</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.FormGroup}>
            <label>{t.subjectName || "Subject Name"}</label>
            <input
              type="text"
              name="subjectName"
              value={formData.subjectName}
              onChange={handleChange}
              placeholder={t.enterSubjectName || "Enter subject name"}
            />
          </div>

          <div className={styles.FormGroup}>
            <label>{t.room || "Room"}</label>
            <input
              type="text"
              name="room"
              value={formData.room}
              onChange={handleChange}
              placeholder={t.enterRoom || "Enter room (e.g., A101)"}
            />
          </div>

          <div className={styles.FormActions}>
            <button
              type="button"
              className={styles.CancelButton}
              onClick={onClose}
            >
              {t.cancel || "Cancel"}
            </button>
            <button
              type="submit"
              className={styles.SaveButton}
              disabled={loading}
            >
              {loading ? t.saving || "Saving..." : t.save || "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
