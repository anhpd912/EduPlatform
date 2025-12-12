"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserService } from "@/shared/services/api/User/UserService";
import {
  Person,
  Email,
  Phone,
  Cake,
  LocationOn,
  Wc,
  Save,
  ArrowBack,
  CameraAlt,
} from "@mui/icons-material";
import styles from "./page.module.css";
import { toast } from "react-toastify";

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    gender: null,
    dateOfBirth: "",
    address: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await UserService.getProfile();
        const data = response.data;
        setProfile(data);
        setFormData({
          fullName: data.fullName || "",
          phoneNumber: data.phoneNumber || "",
          gender: data.gender,
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split("T")[0] : "",
          address: data.address || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenderChange = (gender) => {
    setFormData((prev) => ({
      ...prev,
      gender: gender,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await UserService.updateProfile(profile.id, {
        ...formData,
        avatarUrl: profile.avatarUrl,
      });
      console.log(response);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/profile");
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
    <div className={styles.EditContainer}>
      {/* Header */}
      <div className={styles.Header}>
        <button onClick={handleCancel} className={styles.BackButton}>
          <ArrowBack /> Back
        </button>
        <h1>Edit Profile</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.Form}>
        {/* Avatar Section */}
        <div className={styles.AvatarSection}>
          <div className={styles.AvatarWrapper}>
            <Image
              src={profile.avatarUrl || "https://via.placeholder.com/150"}
              alt={profile.username || "User"}
              width={120}
              height={120}
              className={styles.Avatar}
            />
            <button type="button" className={styles.ChangeAvatarButton}>
              <CameraAlt />
            </button>
          </div>
          <div className={styles.AvatarInfo}>
            <h2>{profile.username}</h2>
            <p>{profile.email}</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className={styles.FormSection}>
          <h3 className={styles.SectionTitle}>
            <Person /> Personal Information
          </h3>

          <div className={styles.FormGrid}>
            {/* Full Name */}
            <div className={styles.FormGroup}>
              <label htmlFor="fullName">
                <Person className={styles.InputIcon} />
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={styles.Input}
              />
            </div>

            {/* Phone Number */}
            <div className={styles.FormGroup}>
              <label htmlFor="phoneNumber">
                <Phone className={styles.InputIcon} />
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className={styles.Input}
              />
            </div>

            {/* Gender */}
            <div className={styles.FormGroup}>
              <label>
                <Wc className={styles.InputIcon} />
                Gender
              </label>
              <div className={styles.GenderButtons}>
                <button
                  type="button"
                  className={`${styles.GenderButton} ${
                    formData.gender === true ? styles.Active : ""
                  }`}
                  onClick={() => handleGenderChange(true)}
                >
                  Male
                </button>
                <button
                  type="button"
                  className={`${styles.GenderButton} ${
                    formData.gender === false ? styles.Active : ""
                  }`}
                  onClick={() => handleGenderChange(false)}
                >
                  Female
                </button>
              </div>
            </div>

            {/* Date of Birth */}
            <div className={styles.FormGroup}>
              <label htmlFor="dateOfBirth">
                <Cake className={styles.InputIcon} />
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className={styles.Input}
              />
            </div>

            {/* Address - Full Width */}
            <div className={`${styles.FormGroup} ${styles.FullWidth}`}>
              <label htmlFor="address">
                <LocationOn className={styles.InputIcon} />
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your address"
                className={styles.Textarea}
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Account Info (Read-only) */}
        <div className={styles.FormSection}>
          <h3 className={styles.SectionTitle}>
            <Email /> Account Information
          </h3>
          <div className={styles.ReadOnlyGrid}>
            <div className={styles.ReadOnlyItem}>
              <label>Username</label>
              <p>{profile.username}</p>
            </div>
            <div className={styles.ReadOnlyItem}>
              <label>Email</label>
              <p>{profile.email}</p>
            </div>
            <div className={styles.ReadOnlyItem}>
              <label>Auth Provider</label>
              <span className={styles.ProviderBadge}>
                {profile.authProvider || "LOCAL"}
              </span>
            </div>
          </div>
          <p className={styles.ReadOnlyNote}>
            * Username and email cannot be changed. Contact support if you need
            to update these.
          </p>
        </div>

        {/* Action Buttons */}
        <div className={styles.Actions}>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.CancelButton}
            disabled={saving}
          >
            Cancel
          </button>
          <button type="submit" className={styles.SaveButton} disabled={saving}>
            {saving ? (
              <>
                <span className={styles.ButtonSpinner}></span>
                Saving...
              </>
            ) : (
              <>
                <Save /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
