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

export default function ProfileView() {
  const { username } = useSnapshot(authStore);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await UserService.getProfile();
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className={styles.LoadingContainer}>
        <div className={styles.Spinner}></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.ErrorContainer}>
        <p>Unable to load profile. Please try again later.</p>
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
            src={profile.avatarUrl}
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
                {role.name}
              </span>
            ))}
          </div>
        </div>
        <Link href="/profile/edit" className={styles.EditButton}>
          <Edit /> Edit Profile
        </Link>
      </div>

      {/* Profile Content */}
      <div className={styles.ProfileContent}>
        {/* Personal Information */}
        <div className={styles.Section}>
          <h2 className={styles.SectionTitle}>
            <Person /> Personal Information
          </h2>
          <div className={styles.InfoGrid}>
            <div className={styles.InfoCard}>
              <div className={styles.InfoIcon}>
                <Badge />
              </div>
              <div className={styles.InfoDetails}>
                <label>Full Name</label>
                <p>{profile.fullName || "Not provided"}</p>
              </div>
            </div>

            <div className={styles.InfoCard}>
              <div className={styles.InfoIcon}>
                <Email />
              </div>
              <div className={styles.InfoDetails}>
                <label>Email Address</label>
                <p className={styles.Email}>{profile.email}</p>
              </div>
            </div>

            <div className={styles.InfoCard}>
              <div className={styles.InfoIcon}>
                <Phone />
              </div>
              <div className={styles.InfoDetails}>
                <label>Phone Number</label>
                <p>{profile.phoneNumber || "Not provided"}</p>
              </div>
            </div>

            <div className={styles.InfoCard}>
              <div className={styles.InfoIcon}>
                <Wc />
              </div>
              <div className={styles.InfoDetails}>
                <label>Gender</label>
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
