"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./page.module.css";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";
import { StudentService } from "@/shared/services/api/Student/StudentService";
import StudentList from "./components/StudentList";

export default function StudentsPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(9);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
      };
      const response = await StudentService.getAllStudents(params);
      if (response.data && response.data.data) {
        console.log(response.data.data);
        const data = response.data.data;
        setStudents(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      setError(t.errorLoadingData || "Error loading data");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, t.errorLoadingData]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && student.isActive) ||
      (statusFilter === "inactive" && !student.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (student) => {
    console.log("View details for student:", student);
    // TODO: Navigate to student details page or open modal
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className={styles.PageContainer}>
      <div className={styles.Header}>
        <h1>{t.students}</h1>
        <button className={styles.AddButton}>
          <AddIcon fontSize="small" />
          {t.addStudent}
        </button>
      </div>

      <div className={styles.FilterBar}>
        <div className={styles.SearchBar}>
          <SearchIcon className={styles.SearchIcon} />
          <input
            type="text"
            placeholder={`${t.search}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.SearchInput}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.FilterSelect}
        >
          <option value="all">
            {t.all} {t.status || "Status"}
          </option>
          <option value="active">{t.active}</option>
          <option value="inactive">{t.inactive}</option>
        </select>
      </div>

      {error && (
        <div className={styles.ErrorMessage}>
          {error}
          <button onClick={fetchStudents} className={styles.RetryButton}>
            {t.retry || "Retry"}
          </button>
        </div>
      )}

      <StudentList
        students={filteredStudents}
        loading={loading}
        onViewDetails={handleViewDetails}
      />

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className={styles.Pagination}>
          <button
            className={styles.PaginationButton}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            {t.previous || "Previous"}
          </button>
          <span className={styles.PageInfo}>
            {t.page || "Page"} {currentPage + 1} {t.of || "of"} {totalPages} (
            {totalElements} {t.students?.toLowerCase() || "students"})
          </span>
          <button
            className={styles.PaginationButton}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
          >
            {t.next || "Next"}
          </button>
        </div>
      )}
    </div>
  );
}
