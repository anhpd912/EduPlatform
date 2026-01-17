"use client";

import { useState, useEffect } from "react";
import styles from "./AddScheduleModal.module.css";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";
import { ClassSubjectService } from "@/shared/services/api/ClassSubject/ClassSubjectService";
import { TimetableService } from "@/shared/services/api/Timetable/TimetableService";

export default function AddScheduleModal({ classData, onClose, onSave }) {
  const { language } = useLanguage();
  const t = translations[language];

  const [classSubjects, setClassSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  const [formData, setFormData] = useState({
    classSubjectId: "", // This will store "subjectId|teacherId" combo
    dayOfWeek: 2, // Default to Monday (2 in backend enum)
    startTime: "08:00",
    endTime: "09:30",
    room: "",
    note: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const daysOfWeek = [
    { value: 2, label: t.monday || "Monday" },
    { value: 3, label: t.tuesday || "Tuesday" },
    { value: 4, label: t.wednesday || "Wednesday" },
    { value: 5, label: t.thursday || "Thursday" },
    { value: 6, label: t.friday || "Friday" },
    { value: 7, label: t.saturday || "Saturday" },
    { value: 1, label: t.sunday || "Sunday" },
  ];

  useEffect(() => {
    fetchClassSubjects();
  }, []);

  const fetchClassSubjects = async () => {
    try {
      setLoadingSubjects(true);
      const response = await ClassSubjectService.getByClassId(classData.id);
      const subjectsData = response?.data || [];
      setClassSubjects(Array.isArray(subjectsData) ? subjectsData : []);
    } catch (err) {
      console.error("Error fetching class subjects:", err);
      setClassSubjects([]);
    } finally {
      setLoadingSubjects(false);
    }
  };

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
    if (!formData.classSubjectId) {
      newErrors.classSubjectId =
        t.subjectRequired || "Please select a subject and teacher";
    }
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
      // Parse the selected subject and teacher
      const [subjectId, teacherId] = formData.classSubjectId.split("|");

      const timetableData = {
        classId: classData.id,
        subjectId: subjectId,
        teacherId: teacherId,
        dayOfWeek: formData.dayOfWeek,
        startTime: formData.startTime,
        endTime: formData.endTime,
        room: formData.room,
        note: formData.note,
      };

      await TimetableService.create(timetableData);

      if (onSave) {
        onSave(timetableData);
      }
      onClose();
    } catch (err) {
      console.error("Error saving schedule:", err);
      alert(
        err.response?.data?.message ||
          t.errorSavingSchedule ||
          "Error saving schedule"
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
            <label>
              {t.subjectAndTeacher || "Subject & Teacher"}{" "}
              <span className={styles.Required}>*</span>
            </label>
            {loadingSubjects ? (
              <div className={styles.LoadingSelect}>
                {t.loadingSubjects || "Loading subjects..."}
              </div>
            ) : classSubjects.length === 0 ? (
              <div className={styles.NoSubjects}>
                {t.noSubjectsInClass ||
                  "No subjects in this class. Please add a subject first."}
              </div>
            ) : (
              <select
                name="classSubjectId"
                value={formData.classSubjectId}
                onChange={handleChange}
                className={errors.classSubjectId ? styles.InputError : ""}
              >
                <option value="">
                  {t.selectSubjectTeacher || "-- Select subject & teacher --"}
                </option>
                {classSubjects.map((cs) => (
                  <option
                    key={`${cs.subjectId}-${cs.teacherId}`}
                    value={`${cs.subjectId}|${cs.teacherId}`}
                  >
                    {cs.subjectName || cs.subject?.name} -{" "}
                    {cs.teacherName || cs.teacher?.fullName}
                  </option>
                ))}
              </select>
            )}
            {errors.classSubjectId && (
              <span className={styles.ErrorText}>{errors.classSubjectId}</span>
            )}
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
              disabled={loading || classSubjects.length === 0}
            >
              {loading ? t.saving || "Saving..." : t.save || "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
