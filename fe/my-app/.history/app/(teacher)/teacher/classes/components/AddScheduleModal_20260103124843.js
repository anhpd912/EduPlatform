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
    dayOfWeek: 1, // Default to Monday (1 in backend enum)
    startTime: "08:00",
    endTime: "09:30",
    fromDate: "",
    toDate: "",
    room: "",
    note: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Backend Java DayOfWeek: 1=Monday, 2=Tuesday, ..., 7=Sunday
  const daysOfWeek = [
    { value: 1, label: t.monday || "Monday" },
    { value: 2, label: t.tuesday || "Tuesday" },
    { value: 3, label: t.wednesday || "Wednesday" },
    { value: 4, label: t.thursday || "Thursday" },
    { value: 5, label: t.friday || "Friday" },
    { value: 6, label: t.saturday || "Saturday" },
    { value: 7, label: t.sunday || "Sunday" },
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

  // Helper: Map backend dayOfWeek (1=Monday, ..., 7=Sunday) to JS day (0=Sunday, 1=Monday, ..., 6=Saturday)
  const backendDayToJsDay = (backendDay) => {
    if (backendDay === 7) return 0; // Sunday
    return backendDay; // 1=Monday -> 1, 2=Tuesday -> 2, etc.
  };

  // Helper: Check if a date range contains at least one occurrence of the selected day
  const hasSelectedDayInRange = (fromDateStr, toDateStr, backendDayOfWeek) => {
    if (!fromDateStr || !toDateStr) return true; // Skip if dates not set

    const [fromYear, fromMonth, fromDay] = fromDateStr.split("-").map(Number);
    const [toYear, toMonth, toDay] = toDateStr.split("-").map(Number);

    const fromDate = new Date(fromYear, fromMonth - 1, fromDay);
    const toDate = new Date(toYear, toMonth - 1, toDay);
    const jsDayOfWeek = backendDayToJsDay(backendDayOfWeek);

    // Check each day in range
    let currentDate = new Date(fromDate);
    while (currentDate <= toDate) {
      if (currentDate.getDay() === jsDayOfWeek) {
        return true;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return false;
  };

  // Helper: Get the day name for display
  const getDayName = (backendDayOfWeek) => {
    const day = daysOfWeek.find((d) => d.value === backendDayOfWeek);
    return day ? day.label : "";
  };

  // Helper: Count occurrences of selected day in date range
  const countDaysInRange = (fromDateStr, toDateStr, backendDayOfWeek) => {
    if (!fromDateStr || !toDateStr) return 0;

    const [fromYear, fromMonth, fromDay] = fromDateStr.split("-").map(Number);
    const [toYear, toMonth, toDay] = toDateStr.split("-").map(Number);

    const fromDate = new Date(fromYear, fromMonth - 1, fromDay);
    const toDate = new Date(toYear, toMonth - 1, toDay);
    const jsDayOfWeek = backendDayToJsDay(backendDayOfWeek);

    let count = 0;
    let currentDate = new Date(fromDate);
    while (currentDate <= toDate) {
      if (currentDate.getDay() === jsDayOfWeek) {
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return count;
  };

  const validateForm = () => {
    const newErrors = {};

    // Subject validation
    if (!formData.classSubjectId) {
      newErrors.classSubjectId =
        t.subjectRequired || "Please select a subject and teacher";
    }

    // Time validations
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

    // Check if time is within reasonable hours (6:00 - 22:00)
    if (formData.startTime && formData.startTime < "06:00") {
      newErrors.startTime =
        t.startTimeTooEarly || "Start time should not be before 6:00 AM";
    }
    if (formData.endTime && formData.endTime > "22:00") {
      newErrors.endTime =
        t.endTimeTooLate || "End time should not be after 10:00 PM";
    }

    // Check minimum duration (at least 30 minutes)
    if (formData.startTime && formData.endTime) {
      const [startH, startM] = formData.startTime.split(":").map(Number);
      const [endH, endM] = formData.endTime.split(":").map(Number);
      const durationMinutes = endH * 60 + endM - (startH * 60 + startM);
      if (durationMinutes > 0 && durationMinutes < 30) {
        newErrors.endTime =
          t.durationTooShort || "Class duration should be at least 30 minutes";
      }
      // Check maximum duration (not more than 4 hours)
      if (durationMinutes > 240) {
        newErrors.endTime =
          t.durationTooLong || "Class duration should not exceed 4 hours";
      }
    }

    // Date validations
    if (!formData.fromDate) {
      newErrors.fromDate = t.fromDateRequired || "From date is required";
    }
    if (!formData.toDate) {
      newErrors.toDate = t.toDateRequired || "To date is required";
    }

    // fromDate must not be in the past
    if (formData.fromDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const [year, month, day] = formData.fromDate.split("-").map(Number);
      const fromDate = new Date(year, month - 1, day);
      if (fromDate < today) {
        newErrors.fromDate =
          t.fromDatePast || "From date cannot be in the past";
      }
    }

    // toDate must be after fromDate
    if (
      formData.fromDate &&
      formData.toDate &&
      formData.fromDate > formData.toDate
    ) {
      newErrors.toDate =
        t.toDateAfterFromDate || "To date must be after from date";
    }

    // Check if date range is reasonable (not more than 1 year)
    if (formData.fromDate && formData.toDate) {
      const [fromYear, fromMonth, fromDay] = formData.fromDate
        .split("-")
        .map(Number);
      const [toYear, toMonth, toDay] = formData.toDate.split("-").map(Number);
      const fromDate = new Date(fromYear, fromMonth - 1, fromDay);
      const toDate = new Date(toYear, toMonth - 1, toDay);
      const diffTime = Math.abs(toDate - fromDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 365) {
        newErrors.toDate =
          t.dateRangeTooLong || "Date range should not exceed 1 year";
      }
    }

    // KEY VALIDATION: Check if selected day exists in date range
    if (
      formData.fromDate &&
      formData.toDate &&
      formData.fromDate <= formData.toDate &&
      !hasSelectedDayInRange(
        formData.fromDate,
        formData.toDate,
        formData.dayOfWeek
      )
    ) {
      const dayName = getDayName(formData.dayOfWeek);
      newErrors.dayOfWeek =
        t.noDayInRange ||
        `No ${dayName} exists between the selected dates. Please adjust the date range or select a different day.`;
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
        fromDate: formData.fromDate,
        toDate: formData.toDate,
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
