"use client";
import Link from "next/link";
import { Block, ArrowBack } from "@mui/icons-material";
import styles from "./page.module.css";
import { logoutAction } from "@/store/authStore";

export default function ForbiddenPage() {
  return (
    <div className={styles.Container}>
      <div className={styles.Content}>
        <div className={styles.IconWrapper}>
          <Block className={styles.Icon} />
        </div>

        <h1 className={styles.ErrorCode}>403</h1>
        <h2 className={styles.Title}>Access Forbidden</h2>
        <p className={styles.Description}>
          You don&apos;t have permission to access this resource.
          <br />
          Please contact your administrator if you believe this is an error.
        </p>

        <div className={styles.Actions}>
          <Link
            href="/"
            onClick={logoutAction}
            className={styles.PrimaryButton}
          >
            <ArrowBack className={styles.ButtonIcon} />
            Go to Home
          </Link>
          <Link
            href="/login"
            onClick={logoutAction}
            className={styles.SecondaryButton}
          >
            Login Again
          </Link>
        </div>
      </div>
    </div>
  );
}
