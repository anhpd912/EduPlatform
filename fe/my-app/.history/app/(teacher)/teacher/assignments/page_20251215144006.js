"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AddIcon from "@mui/icons-material/Add";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import QuizIcon from "@mui/icons-material/Quiz";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";

export default function AssignmentsPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    course: "",
    subject: "",
    duration: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    questions: "",
    passingPercentage: "",
  });

  useEffect(() => {
    setTimeout(() => {
      setAssignments([
        {
          id: 1,
          title: "Chapter 1: Functions and Graphs",
          course: "B.Tech Specialization in Health Informatics",
          subject: "Mathematics - Class 10A1",
          date: "3-01-2023",
          time: "12:30 PM - 01:40 PM",
          questions: 50,
          passingPercentage: 70,
        },
        {
          id: 2,
          title: "Midterm Exam: Equations",
          course: "B.Tech Specialization in Health Informatics",
          subject: "Mathematics - Class 10A1",
          date: "5-01-2023",
          time: "09:00 AM - 10:30 AM",
          questions: 40,
          passingPercentage: 80,
        },
        {
          id: 3,
          title: "Homework: Trigonometry",
          course: "B.Tech Specialization in Health Informatics",
          subject: "Mathematics - Class 11B1",
          date: "8-01-2023",
          time: "02:00 PM - 03:30 PM",
          questions: 30,
          passingPercentage: 60,
        },
        {
          id: 4,
          title: "Final Exam: Comprehensive",
          course: "B.Tech Specialization in Health Informatics",
          subject: "Mathematics - Class 10A2",
          date: "10-01-2023",
          time: "08:00 AM - 10:00 AM",
          questions: 60,
          passingPercentage: 75,
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    alert("Assignment created successfully!");
    setShowCreateModal(false);
    setCurrentStep(1);
    setFormData({
      title: "",
      course: "",
      subject: "",
      duration: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      questions: "",
      passingPercentage: "",
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className={styles.StepContent}>
            <div className={styles.FormGroup}>
              <label>Next Class</label>
              <input
                type="text"
                placeholder="Enter class name"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={styles.Input}
              />
            </div>
            <div className={styles.FormGroup}>
              <label>Next Course</label>
              <select
                value={formData.course}
                onChange={(e) => handleInputChange("course", e.target.value)}
                className={styles.Select}
              >
                <option value="">Select course</option>
                <option value="B.Tech Specialization in Health Informatics">
                  B.Tech Specialization in Health Informatics
                </option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>
            <div className={styles.FormGroup}>
              <label>Next Subject</label>
              <select
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                className={styles.Select}
              >
                <option value="">Select subject</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className={styles.StepContent}>
            <div className={styles.FormGroup}>
              <label>Assignment Duration</label>
              <div className={styles.RadioGroup}>
                <label className={styles.RadioLabel}>
                  <input
                    type="radio"
                    name="duration"
                    value="30"
                    checked={formData.duration === "30"}
                    onChange={(e) =>
                      handleInputChange("duration", e.target.value)
                    }
                  />
                  <span>30 Min</span>
                </label>
                <label className={styles.RadioLabel}>
                  <input
                    type="radio"
                    name="duration"
                    value="60"
                    checked={formData.duration === "60"}
                    onChange={(e) =>
                      handleInputChange("duration", e.target.value)
                    }
                  />
                  <span>60 Min</span>
                </label>
                <label className={styles.RadioLabel}>
                  <input
                    type="radio"
                    name="duration"
                    value="90"
                    checked={formData.duration === "90"}
                    onChange={(e) =>
                      handleInputChange("duration", e.target.value)
                    }
                  />
                  <span>90 Min</span>
                </label>
                <label className={styles.RadioLabel}>
                  <input
                    type="radio"
                    name="duration"
                    value="120"
                    checked={formData.duration === "120"}
                    onChange={(e) =>
                      handleInputChange("duration", e.target.value)
                    }
                  />
                  <span>120 Min</span>
                </label>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className={styles.StepContent}>
            <div className={styles.FormRow}>
              <div className={styles.FormGroup}>
                <label>Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                  className={styles.Input}
                />
              </div>
              <div className={styles.FormGroup}>
                <label>Start Time</label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    handleInputChange("startTime", e.target.value)
                  }
                  className={styles.Input}
                />
              </div>
            </div>
            <div className={styles.FormRow}>
              <div className={styles.FormGroup}>
                <label>End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  className={styles.Input}
                />
              </div>
              <div className={styles.FormGroup}>
                <label>End Time</label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange("endTime", e.target.value)}
                  className={styles.Input}
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className={styles.StepContent}>
            <div className={styles.PreviewSection}>
              <h3>Preview Assignment</h3>
              <div className={styles.PreviewGrid}>
                <div className={styles.PreviewItem}>
                  <span className={styles.PreviewLabel}>Class:</span>
                  <span className={styles.PreviewValue}>
                    {formData.title || "N/A"}
                  </span>
                </div>
                <div className={styles.PreviewItem}>
                  <span className={styles.PreviewLabel}>Course:</span>
                  <span className={styles.PreviewValue}>
                    {formData.course || "N/A"}
                  </span>
                </div>
                <div className={styles.PreviewItem}>
                  <span className={styles.PreviewLabel}>Subject:</span>
                  <span className={styles.PreviewValue}>
                    {formData.subject || "N/A"}
                  </span>
                </div>
                <div className={styles.PreviewItem}>
                  <span className={styles.PreviewLabel}>Duration:</span>
                  <span className={styles.PreviewValue}>
                    {formData.duration ? `${formData.duration} Min` : "N/A"}
                  </span>
                </div>
                <div className={styles.PreviewItem}>
                  <span className={styles.PreviewLabel}>Start:</span>
                  <span className={styles.PreviewValue}>
                    {formData.startDate && formData.startTime
                      ? `${formData.startDate} ${formData.startTime}`
                      : "N/A"}
                  </span>
                </div>
                <div className={styles.PreviewItem}>
                  <span className={styles.PreviewLabel}>End:</span>
                  <span className={styles.PreviewValue}>
                    {formData.endDate && formData.endTime
                      ? `${formData.endDate} ${formData.endTime}`
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const filteredAssignments = assignments.filter(
    (assignment) => filter === "all" || assignment.status === filter
  );

  if (loading) {
    return (
      <div className={styles.LoadingContainer}>
        <div className={styles.Spinner}></div>
        <p>{t.loading}</p>
      </div>
    );
  }

  return (
    <div className={styles.PageContainer}>
      <div className={styles.Header}>
        <h1>{t.assignments}</h1>
        <button
          className={styles.AddButton}
          onClick={() => setShowCreateModal(true)}
        >
          <AddIcon fontSize="small" />
          {t.createAssignment}
        </button>
      </div>

      <div className={styles.TabsContainer}>
        <button
          className={`${styles.Tab} ${
            filter === "all" ? styles.ActiveTab : ""
          }`}
          onClick={() => setFilter("all")}
        >
          Scheduled {t.assignments}
        </button>
        <button
          className={`${styles.Tab} ${
            filter === "bank" ? styles.ActiveTab : ""
          }`}
          onClick={() => setFilter("bank")}
        >
          Question Bank
        </button>
        <button
          className={`${styles.Tab} ${
            filter === "history" ? styles.ActiveTab : ""
          }`}
          onClick={() => setFilter("history")}
        >
          History
        </button>
      </div>

      <div className={styles.SearchBar}>
        <SearchIcon className={styles.SearchIcon} />
        <input
          type="text"
          placeholder={`${t.search}...`}
          className={styles.SearchInput}
        />
      </div>

      <div className={styles.AssignmentGrid}>
        {assignments.map((assignment) => (
          <div key={assignment.id} className={styles.AssignmentCard}>
            <h3 className={styles.AssignmentTitle}>{assignment.title}</h3>

            <div className={styles.CourseInfo}>
              <p className={styles.CourseName}>
                {t.course}: {assignment.course}
              </p>
              <p className={styles.SubjectName}>
                {t.subject}: {assignment.subject}
              </p>
            </div>

            <div className={styles.AssignmentDetails}>
              <div className={styles.DetailRow}>
                <CalendarTodayIcon
                  fontSize="small"
                  className={styles.DetailIcon}
                />
                <span>{assignment.date}</span>
                <AccessTimeIcon
                  fontSize="small"
                  className={styles.DetailIcon}
                  style={{ marginLeft: "16px" }}
                />
                <span>{assignment.time}</span>
              </div>
            </div>

            <div className={styles.QuestionsInfo}>
              <QuizIcon fontSize="small" className={styles.DetailIcon} />
              <span>
                {t.questions}: {assignment.questions}
              </span>
            </div>

            <div className={styles.PassingSection}>
              <div className={styles.PassingHeader}>
                <span className={styles.PassingLabel}>Passing Score</span>
                <span className={styles.PassingValue}>
                  {assignment.passingPercentage}%
                </span>
              </div>
              <div className={styles.ProgressBar}>
                <div
                  className={styles.ProgressFill}
                  style={{ width: `${assignment.passingPercentage}%` }}
                ></div>
              </div>
            </div>

            <button className={styles.ViewButton}>{t.viewDetails}</button>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className={styles.ModalOverlay}>
          <div className={styles.ModalContainer}>
            <div className={styles.ModalHeader}>
              <h2>
                {t.createNew} {t.assignments}
              </h2>
              <button
                className={styles.CloseButton}
                onClick={() => {
                  setShowCreateModal(false);
                  setCurrentStep(1);
                }}
              >
                <CloseIcon />
              </button>
            </div>

            <div className={styles.StepperContainer}>
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`${styles.StepItem} ${
                    currentStep >= step ? styles.StepActive : ""
                  } ${currentStep > step ? styles.StepCompleted : ""}`}
                >
                  <div className={styles.StepNumber}>
                    {currentStep > step ? (
                      <CheckCircleIcon fontSize="small" />
                    ) : (
                      step
                    )}
                  </div>
                  <span className={styles.StepLabel}>
                    {step === 1
                      ? t.basicInfo
                      : step === 2
                      ? t.duration
                      : step === 3
                      ? t.schedule
                      : t.preview}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.ModalBody}>{renderStepContent()}</div>

            <div className={styles.ModalFooter}>
              <button
                className={styles.BackButton}
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ArrowBackIcon fontSize="small" />
                {t.back}
              </button>
              {currentStep < 4 ? (
                <button className={styles.NextButton} onClick={handleNext}>
                  {t.next}
                  <ArrowForwardIcon fontSize="small" />
                </button>
              ) : (
                <button className={styles.SaveButton} onClick={handleSave}>
                  {t.save} {t.assignments}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
