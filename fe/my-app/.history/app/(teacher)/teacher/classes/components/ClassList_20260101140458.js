"use client";

import { useState } from "react";
import styles from "./ClassList.module.css";
import ClassItem from "./ClassItem";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";

export default function ClassList({
  classes,
  onViewClass,
  onEditClass,
  onDeleteClass,
}) {
  const { language } = useLanguage();
  const t = translations[language];
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
      return matchesSearch && (!cls.classEnrollments || cls.classEnrollments.length === 0);
    if (filterBy === "hasAssignments")
      return matchesSearch && cls.assignments?.length > 0;

    return matchesSearch;
  });

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
            <option value="hasStudents">{t.hasStudents || "Has Students"}</option>
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
        <div className={styles.ClassGrid}>
          {filteredClasses.map((cls) => (
            <ClassItem
              key={cls.id}
              classData={cls}
              onView={onViewClass}
              onEdit={onEditClass}
              onDelete={onDeleteClass}
            />
          ))}
        </div>
      )}
    </div>
  );
}
