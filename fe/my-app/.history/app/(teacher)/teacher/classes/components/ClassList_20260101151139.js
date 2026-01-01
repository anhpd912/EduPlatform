"use client";

import { useState } from "react";
import styles from "./ClassList.module.css";
import ClassItem from "./ClassItem";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";
import { useSnapshot } from "valtio";
import { authStore } from "@/store/authStore";

export default function ClassList({
  classes,
  onViewClass,
  onEditClass,
  onDeleteClass,
  onAddSchedule,
  onAddSubject,
}) {
  const { language } = useLanguage();
  const t = translations[language];
  const snap = useSnapshot(authStore);
  const currentUserId = snap.userId;

  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.homeroomTeacherName?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterBy === "all") return matchesSearch;
    if (filterBy === "hasStudents")
      return matchesSearch && cls.classEnrollments?.length > 0;
    if (filterBy === "noStudents")
      return (
        matchesSearch &&
        (!cls.classEnrollments || cls.classEnrollments.length === 0)
      );
    if (filterBy === "hasAssignments")
      return matchesSearch && cls.assignments?.length > 0;

    return matchesSearch;
  });

  // Separate homeroom classes and teaching classes
  const homeroomClasses = filteredClasses.filter(
    (cls) => cls.homeroomTeacherId === currentUserId
  );
  const teachingClasses = filteredClasses.filter(
    (cls) => cls.homeroomTeacherId !== currentUserId
  );

  const renderClassGrid = (classList) => (
    <div className={styles.ClassGrid}>
      {classList.map((cls) => (
        <ClassItem
          key={cls.id}
          classData={cls}
          onView={onViewClass}
          onEdit={onEditClass}
          onDelete={onDeleteClass}
          onAddSchedule={onAddSchedule}
          onAddSubject={onAddSubject}
        />
      ))}
    </div>
  );

  return (
    <div className={styles.ListContainer}>
      <div className={styles.FilterBar}>
        <div className={styles.SearchWrapper}>
          <SearchIcon className={styles.SearchIcon} />
          <input
            type="text"
            placeholder={t.searchClasses || "Search classes..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.SearchInput}
          />
        </div>
        <div className={styles.FilterWrapper}>
          <FilterListIcon fontSize="small" />
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className={styles.FilterSelect}
          >
            <option value="all">{t.all || "All"}</option>
            <option value="hasStudents">
              {t.hasStudents || "Has Students"}
            </option>
            <option value="noStudents">{t.noStudents || "No Students"}</option>
            <option value="hasAssignments">
              {t.hasAssignments || "Has Assignments"}
            </option>
          </select>
        </div>
      </div>

      {filteredClasses.length === 0 ? (
        <div className={styles.EmptyState}>
          <p>{t.noClassesFound || "No classes found"}</p>
        </div>
      ) : (
        <>
          {/* Homeroom Classes Section */}
          {homeroomClasses.length > 0 && (
            <div className={styles.ClassSection}>
              <div className={styles.SectionHeader}>
                <SchoolIcon className={styles.SectionIcon} />
                <h2>{t.homeroomClasses || "Lớp chủ nhiệm"}</h2>
                <span className={styles.ClassCount}>
                  {homeroomClasses.length}
                </span>
              </div>
              {renderClassGrid(homeroomClasses)}
            </div>
          )}

          {/* Teaching Classes Section */}
          {teachingClasses.length > 0 && (
            <div className={styles.ClassSection}>
              <div className={styles.SectionHeader}>
                <MenuBookIcon className={styles.SectionIcon} />
                <h2>{t.teachingClasses || "Lớp giảng dạy"}</h2>
                <span className={styles.ClassCount}>
                  {teachingClasses.length}
                </span>
              </div>
              {renderClassGrid(teachingClasses)}
            </div>
          )}
        </>
      )}
    </div>
  );
}
