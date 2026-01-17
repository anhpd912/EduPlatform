"use client";

import ClassIcon from "@mui/icons-material/Class";
import AddIcon from "@mui/icons-material/Add";
import ClassItem from "./ClassItem";
import styles from "./ClassList.module.css";

export default function ClassList({ classes, translations, onJoinClick }) {
  const t = translations;

  if (classes.length === 0) {
    return (
      <div className={styles.EmptyState}>
        <ClassIcon style={{ fontSize: 64, color: "#cbd5e1" }} />
        <h3>{t.noClassesYet || "No classes yet"}</h3>
        <p>
          {t.joinClassToStart ||
            "Join a class using a class code to get started"}
        </p>
        <button className={styles.JoinButton} onClick={onJoinClick}>
          <AddIcon />
          {t.joinClass || "Join Class"}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.ClassGrid}>
      {classes.map((cls) => (
        <ClassItem key={cls.id} classData={cls} translations={t} />
      ))}
    </div>
  );
}
