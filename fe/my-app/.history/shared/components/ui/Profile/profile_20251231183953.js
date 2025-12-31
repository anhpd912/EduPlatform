"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSnapshot } from "valtio";
import { authStore } from "@/store/authStore";
import { UserService } from "@/shared/services/api/User/UserService";
import {
  Person,
  Email,
  Phone,
  Cake,
  LocationOn,
  Wc,
  Badge,
  Security,
  Edit,
} from "@mui/icons-material";
import styles from "./profile.module.css";
import { toast } from "react-toastify";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";

export default function ProfileView() {
  const { username } = useSnapshot(authStore);
  const { language } = useLanguage();
  const t = translations[language];
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await UserService.getProfile();
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error(t.failedToLoadProfile || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return t.notProvided || "Not provided";
    return new Date(dateString).toLocaleDateString(language === "vi" ? "vi-VN" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className={styles.LoadingContainer}>
        <div className={styles.Spinner}></div>
        <p>{t.loadingProfile || "Loading profile..."}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.ErrorContainer}>
        <p>{t.unableToLoadProfile || "Unable to load profile. Please try again later."}</p>
      </div>
    );
  }

  return (
    <div className={styles.ProfileContainer}>
      {/* Profile Header */}
      <div className={styles.ProfileHeader}>
        <div className={styles.CoverImage}></div>
        <div className={styles.AvatarWrapper}>
          <Image
            src={profile.avatarUrl || "/default-avatar.png"}
            alt={profile.username || "User"}
            width={150}
            height={150}
            className={styles.Avatar}
          />
          <span
            className={`${styles.StatusIndicator} ${
              profile.isActive ? styles.Online : styles.Offline
            }`}
          ></span>
        </div>
        <div className={styles.HeaderInfo}>
          <h1 className={styles.Name}>
            {profile.fullName || profile.username}
          </h1>
          <p className={styles.Username}>@{profile.username}</p>
          <div className={styles.RoleBadges}>
            {profile.roles?.map((role, index) => (
              <span key={index} className={styles.RoleBadge}>
                {role.name === "TEACHER" ? (t.teacher || "Teacher") :
                 role.name === "STUDENT" ? (t.student || "Student") :
                 role.name === "ADMIN" ? (t.admin || "Admin") : role.name}
              </span>
            ))}
          </div>
        </div>
        <Link href="/profile/edit" className={styles.EditButton}>
          <Edit /> {t.editProfile || "Edit Profile"}
        </Link>
      </div>

      {/* Profile Content */}
      <div className={styles.ProfileContent}>
        {/* Personal Information */}
        <div className={styles.Section}>
          <h2 className={styles.SectionTitle}>
            <Person /> {t.personalInformation || "Personal Information"}
          </h2>
          <div className={styles.InfoGrid}>
            <div className={styles.InfoCard}>
              <div className={styles.InfoIcon}>
                <Badge />
              </div>
              <div className={styles.InfoDetails}>
                <label>{t.fullName || "Full Name"}</label>
                <p>{profile.fullName || (t.notProvided || "Not provided")}</p>
              </div>
            </div>

            <div className={styles.InfoCard}>
              <div className={styles.InfoIcon}>
                <Email />
              </div>
              <div className={styles.InfoDetails}>
                <label>{t.emailAddress || "Email Address"}</label>
                <p className={styles.Email}>{profile.email}</p>
              </div>
            </div>

            <div className={styles.InfoCard}>
              <div className={styles.InfoIcon}>
                <Phone />
              </div>
              <div className={styles.InfoDetails}>
                <label>{t.phoneNumber || "Phone Number"}</label>
                <p>{profile.phoneNumber || (t.notProvided || "Not provided")}</p>
              </div>
            </div>

            <div className={styles.InfoCard}>
              <div className={styles.InfoIcon}>
                <Wc />
              </div>
              <div className={styles.InfoDetails}>
                <label>{t.gender || "Gender"}</label>
                <p>
                  {profile.gender === true
                    ? "Male"
                    : profile.gender === false
                    ? "Female"
                    : "Not specified"}
                </p>
              </div>
            </div>

            <div className={styles.InfoCard}>
              <div className={styles.InfoIcon}>
                <Cake />
              </div>
              <div className={styles.InfoDetails}>
                <label>Date of Birth</label>
                <p>{formatDate(profile.dateOfBirth)}</p>
              </div>
            </div>

            <div className={styles.InfoCard}>
              <div className={styles.InfoIcon}>
                <LocationOn />
              </div>
              <div className={styles.InfoDetails}>
                <label>Address</label>
                <p>{profile.address || "Not provided"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className={styles.Section}>
          <h2 className={styles.SectionTitle}>
            <Security /> Account Information
          </h2>
          <div className={styles.AccountGrid}>
            <div className={styles.AccountItem}>
              <label>Username</label>
              <p>{profile.username}</p>
            </div>

            <div className={styles.AccountItem}>
              <label>Auth Provider</label>
              <span className={styles.ProviderBadge}>
                {profile.authProvider || "LOCAL"}
              </span>
            </div>

            <div className={styles.AccountItem}>
              <label>Account Status</label>
              <span
                className={`${styles.StatusBadge} ${
                  profile.isActive ? styles.Active : styles.Inactive
                }`}
              >
                {profile.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className={styles.AccountItem}>
              <label>Account Created</label>
              <p>{formatDate(profile.createdDate)}</p>
            </div>

            <div className={styles.AccountItem}>
              <label>Last Updated</label>
              <p>{formatDate(profile.updatedDate)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
