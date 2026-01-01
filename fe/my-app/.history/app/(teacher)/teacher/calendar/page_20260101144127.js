"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RoomIcon from "@mui/icons-material/Room";
import ClassIcon from "@mui/icons-material/Class";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";
import { ClassService } from "@/shared/services/api/Class/ClassService";

export default function TeacherCalendarPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [currentDate, setCurrentDate] = useState(new Date());
  const [classes, setClasses] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState("month"); // month, week

  const daysOfWeek = [
    t.sunday || "Sun",
    t.monday || "Mon",
    t.tuesday || "Tue",
    t.wednesday || "Wed",
    t.thursday || "Thu",
    t.friday || "Fri",
    t.saturday || "Sat",
  ];

  const dayMapping = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (classes.length > 0) {
      generateSchedules();
    }
  }, [classes, currentDate]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await ClassService.getMyClass();
      const classesData =
        response.data?.data?.content || response.data?.content || [];
      setClasses(classesData);
    } catch (err) {
      console.error("Error fetching classes:", err);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const generateSchedules = () => {
    const allSchedules = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get first and last day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    classes.forEach((cls) => {
      if (cls.timetables && cls.timetables.length > 0) {
        cls.timetables.forEach((timetable) => {
          const dayOfWeek = dayMapping[timetable.dayOfWeek];

          if (dayOfWeek !== undefined) {
            // Find all dates in current month that match this day of week
            let date = new Date(firstDay);
            while (date <= lastDay) {
              if (date.getDay() === dayOfWeek) {
                allSchedules.push({
                  id: `${cls.id}-${timetable.id}-${date.toISOString()}`,
                  date: new Date(date),
                  className: cls.name,
                  classId: cls.id,
                  subjectName: timetable.subjectName || cls.description,
                  startTime: timetable.startTime,
                  endTime: timetable.endTime,
                  room: timetable.room || timetable.location,
                  color: getClassColor(cls.id),
                });
              }
              date.setDate(date.getDate() + 1);
            }
          }
        });
      }
    });

    setSchedules(allSchedules);
  };

  const getClassColor = (classId) => {
    const colors = [
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#ec4899",
      "#06b6d4",
      "#84cc16",
    ];
    const index =
      classId
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add empty slots for days before the first day of month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add all days in month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getSchedulesForDate = (date) => {
    if (!date) return [];
    return schedules.filter(
      (schedule) =>
        schedule.date.getDate() === date.getDate() &&
        schedule.date.getMonth() === date.getMonth() &&
        schedule.date.getFullYear() === date.getFullYear()
    );
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const formatMonthYear = () => {
    return currentDate.toLocaleDateString(language === "vi" ? "vi-VN" : "en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  if (loading) {
    return (
      <div className={styles.LoadingContainer}>
        <div className={styles.Spinner}></div>
        <p>{t.loading || "Loading..."}</p>
      </div>
    );
  }

  const selectedDateSchedules = selectedDate
    ? getSchedulesForDate(selectedDate)
    : [];

  return (
    <div className={styles.PageContainer}>
      <div className={styles.Header}>
        <div className={styles.HeaderContent}>
          <div className={styles.HeaderIcon}>
            <CalendarMonthIcon style={{ fontSize: 28 }} />
          </div>
          <div>
            <h1>{t.teachingSchedule || "Teaching Schedule"}</h1>
            <p className={styles.HeaderSubtitle}>
              {t.viewYourClassSchedule || "View your class schedule"}
            </p>
          </div>
        </div>
        <div className={styles.HeaderActions}>
          <button className={styles.TodayButton} onClick={goToToday}>
            {t.today || "Today"}
          </button>
        </div>
      </div>

      <div className={styles.CalendarWrapper}>
        <div className={styles.CalendarMain}>
          <div className={styles.CalendarHeader}>
            <button
              className={styles.NavButton}
              onClick={() => navigateMonth(-1)}
            >
              <ChevronLeftIcon />
            </button>
            <h2 className={styles.MonthYear}>{formatMonthYear()}</h2>
            <button
              className={styles.NavButton}
              onClick={() => navigateMonth(1)}
            >
              <ChevronRightIcon />
            </button>
          </div>

          <div className={styles.CalendarGrid}>
            {daysOfWeek.map((day) => (
              <div key={day} className={styles.DayHeader}>
                {day}
              </div>
            ))}

            {getDaysInMonth().map((date, index) => {
              const daySchedules = getSchedulesForDate(date);
              return (
                <div
                  key={index}
                  className={`${styles.DayCell} ${!date ? styles.EmptyCell : ""} ${
                    isToday(date) ? styles.Today : ""
                  } ${isSelected(date) ? styles.Selected : ""}`}
                  onClick={() => date && setSelectedDate(date)}
                >
                  {date && (
                    <>
                      <span className={styles.DayNumber}>{date.getDate()}</span>
                      <div className={styles.ScheduleDots}>
                        {daySchedules.slice(0, 3).map((schedule, i) => (
                          <div
                            key={i}
                            className={styles.ScheduleDot}
                            style={{ backgroundColor: schedule.color }}
                            title={schedule.className}
                          />
                        ))}
                        {daySchedules.length > 3 && (
                          <span className={styles.MoreDots}>
                            +{daySchedules.length - 3}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.SchedulePanel}>
          <div className={styles.PanelHeader}>
            <h3>
              {selectedDate
                ? selectedDate.toLocaleDateString(
                    language === "vi" ? "vi-VN" : "en-US",
                    {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    }
                  )
                : t.selectDate || "Select a date"}
            </h3>
          </div>

          <div className={styles.ScheduleList}>
            {selectedDateSchedules.length > 0 ? (
              selectedDateSchedules
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((schedule) => (
                  <div
                    key={schedule.id}
                    className={styles.ScheduleCard}
                    style={{ borderLeftColor: schedule.color }}
                  >
                    <div className={styles.ScheduleTime}>
                      <AccessTimeIcon fontSize="small" />
                      <span>
                        {schedule.startTime} - {schedule.endTime}
                      </span>
                    </div>
                    <div className={styles.ScheduleInfo}>
                      <div className={styles.ClassName}>
                        <ClassIcon fontSize="small" />
                        <span>{schedule.className}</span>
                      </div>
                      {schedule.subjectName && (
                        <p className={styles.SubjectName}>
                          {schedule.subjectName}
                        </p>
                      )}
                      {schedule.room && (
                        <div className={styles.Room}>
                          <RoomIcon fontSize="small" />
                          <span>{schedule.room}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
            ) : (
              <div className={styles.NoSchedule}>
                <CalendarMonthIcon />
                <p>
                  {selectedDate
                    ? t.noClassesToday || "No classes scheduled"
                    : t.selectDateToView || "Select a date to view schedule"}
                </p>
              </div>
            )}
          </div>

          {classes.length > 0 && (
            <div className={styles.ClassLegend}>
              <h4>{t.myClasses || "My Classes"}</h4>
              <div className={styles.LegendList}>
                {classes.map((cls) => (
                  <div key={cls.id} className={styles.LegendItem}>
                    <div
                      className={styles.LegendColor}
                      style={{ backgroundColor: getClassColor(cls.id) }}
                    />
                    <span>{cls.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
