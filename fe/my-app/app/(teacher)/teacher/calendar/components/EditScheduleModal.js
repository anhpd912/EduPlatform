"use client";

import { useState } from "react";
import styles from "./EditScheduleModal.module.css";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";
import { TimetableService } from "@/shared/services/api/Timetable/TimetableService";

export default function EditScheduleModal({ timetable, onClose, onSave }) {
  const { language } = useLanguage();
  const t = translations[language];

  const [formData, setFormData] = useState({
    dayOfWeek: timetable.dayOfWeek || 2,
    startTime: timetable.startTime || "08:00",
    endTime: timetable.endTime || "09:30",
    fromDate: timetable.fromDate || "",
    toDate: timetable.toDate || "",
    room: timetable.room || "",
    note: timetable.note || "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const daysOfWeek = [
    { value: 1, label: t.monday || "Monday" },
    { value: 2, label: t.tuesday || "Tuesday" },
    { value: 3, label: t.wednesday || "Wednesday" },
    { value: 4, label: t.thursday || "Thursday" },
    { value: 5, label: t.friday || "Friday" },
    { value: 6, label: t.saturday || "Saturday" },
    { value: 7, label: t.sunday || "Sunday" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "dayOfWeek" ? parseInt(value) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.startTime) {
      newErrors.startTime = t.startTimeRequired || "Start time is required";
    }
    if (!formData.endTime) {
      newErrors.endTime = t.endTimeRequired || "End time is required";
    }
    if (
      formData.startTime &&
      formData.endTime &&
      formData.startTime >= formData.endTime
    ) {
      newErrors.endTime =
        t.endTimeAfterStart || "End time must be after start time";
    }
    if (!formData.fromDate) {
      newErrors.fromDate = t.fromDateRequired || "From date is required";
    }
    if (!formData.toDate) {
      newErrors.toDate = t.toDateRequired || "To date is required";
    }
    if (
      formData.fromDate &&
      formData.toDate &&
      formData.fromDate > formData.toDate
    ) {
      newErrors.toDate =
        t.toDateAfterFromDate || "To date must be after from date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        dayOfWeek: formData.dayOfWeek,
        startTime: formData.startTime,
        endTime: formData.endTime,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        room: formData.room,
        note: formData.note,
      };

      await TimetableService.update(timetable.id, updateData);

      if (onSave) {
        onSave();
      }
      onClose();
    } catch (err) {
      console.error("Error updating schedule:", err);
      alert(
        err.response?.data?.message ||
          t.errorUpdatingSchedule ||
          "Error updating schedule"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.Overlay} onClick={onClose}>
      <div className={styles.Modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.ModalHeader}>
          <div className={styles.HeaderInfo}>
            <EditIcon />
            <div>
              <h2>{t.editSchedule || "Edit Schedule"}</h2>
              <p>
                {timetable.className} - {timetable.subjectName}
              </p>
            </div>
          </div>
          <button className={styles.CloseButton} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.Form}>
          <div className={styles.InfoSection}>
            <div className={styles.InfoItem}>
              <label>{t.class || "Class"}</label>
              <span>{timetable.className}</span>
            </div>
            <div className={styles.InfoItem}>
              <label>{t.subject || "Subject"}</label>
              <span>{timetable.subjectName}</span>
            </div>
            <div className={styles.InfoItem}>
              <label>{t.teacher || "Teacher"}</label>
              <span>{timetable.teacherName}</span>
            </div>
          </div>

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
              <label>
                {t.startTime || "Start Time"}{" "}
                <span className={styles.Required}>*</span>
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className={errors.startTime ? styles.InputError : ""}
                required
              />
              {errors.startTime && (
                <span className={styles.ErrorText}>{errors.startTime}</span>
              )}
            </div>
            <div className={styles.FormGroup}>
              <label>
                {t.endTime || "End Time"}{" "}
                <span className={styles.Required}>*</span>
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className={errors.endTime ? styles.InputError : ""}
                required
              />
              {errors.endTime && (
                <span className={styles.ErrorText}>{errors.endTime}</span>
              )}
            </div>
          </div>

          <div className={styles.FormRow}>
            <div className={styles.FormGroup}>
              <label>
                {t.fromDate || "From Date"}{" "}
                <span className={styles.Required}>*</span>
              </label>
              <input
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                className={errors.fromDate ? styles.InputError : ""}
                required
              />
              {errors.fromDate && (
                <span className={styles.ErrorText}>{errors.fromDate}</span>
              )}
            </div>
            <div className={styles.FormGroup}>
              <label>
                {t.toDate || "To Date"}{" "}
                <span className={styles.Required}>*</span>
              </label>
              <input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                className={errors.toDate ? styles.InputError : ""}
                required
              />
              {errors.toDate && (
                <span className={styles.ErrorText}>{errors.toDate}</span>
              )}
            </div>
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

          <div className={styles.FormGroup}>
            <label>{t.note || "Note"}</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder={t.enterNote || "Enter note (optional)"}
              rows={3}
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
