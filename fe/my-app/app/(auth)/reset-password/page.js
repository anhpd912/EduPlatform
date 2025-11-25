"use client";
import { ArrowBack } from "@mui/icons-material";
import ResetPasswordForm from "./components/FormReset";
import styles from "./page.module.css";
import { Suspense } from "react";
import NavItem from "@/shared/components/ui/Navbar/nav-item";

export default function ResetPasswordPage() {
  return (
    <div className={styles.Container}>
      <Suspense fallback={<div>Loading...</div>}>
        <div className={styles.ButtonGroup}>
          <NavItem href={"/"} isBack={true}>
            <ArrowBack sx={{ color: "black" }} />
            Back to Home
          </NavItem>
        </div>
        <div className={styles.ResetContainer}>
          <ResetPasswordForm />
        </div>
      </Suspense>
    </div>
  );
}
