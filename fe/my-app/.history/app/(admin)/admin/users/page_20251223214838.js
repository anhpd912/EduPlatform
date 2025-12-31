"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { UserService } from "@/shared/services/api/User/UserService";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserDetailItem from "./components/UserDetailItem";
import UserAddItem from "./components/UserAddItem";
import UserEditItem from "./components/UserEditItem";
import UserItem from "./components/UserItem";

export default function UsersPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await UserService.getUsers();
      setUsers(response?.data || []);
    } catch (error) {
      toast.error("Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && user.isActive) ||
      (filterStatus === "inactive" && !user.isActive);

    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        // await UserService.deleteUser(userId);
        toast.success("User deleted successfully");
        fetchUsers();
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.LoadingContainer}>
        <div className={styles.Spinner}></div>
        <p>{t.loading || "Loading..."}</p>
      </div>
    );
  }

  return (
    <div className={styles.PageContainer}>
      <div className={styles.Header}>
        <h1>{t.users || "Users"}</h1>
        <button
          className={styles.AddButton}
          onClick={() => setShowAddModal(true)}
        >
          <AddIcon fontSize="small" />
          {t.addUser || "Add User"}
        </button>
      </div>

      <div className={styles.FilterBar}>
        <div className={styles.SearchBar}>
          <SearchIcon className={styles.SearchIcon} />
          <input
            type="text"
            placeholder={`${t.search || "Search"}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.SearchInput}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={styles.FilterSelect}
        >
          <option value="all">
            {t.all || "All"} {t.users || "Users"}
          </option>
          <option value="active">{t.active || "Active"}</option>
          <option value="inactive">{t.inactive || "Inactive"}</option>
        </select>
      </div>

      <div className={styles.UserGrid}>
        {filteredUsers.length === 0 ? (
          <div className={styles.EmptyState}>
            {t.noDataFound || "No users found"}
          </div>
        ) : (
          filteredUsers.map((user) => (
            <UserItem
              key={user.id}
              user={user}
              onView={setSelectedUser}
              onEdit={setUserToEdit}
              onDelete={handleDelete}
              t={t}
            />
          ))
        )}
      </div>

      {selectedUser && (
        <UserDetailItem
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {showAddModal && (
        <UserAddItem
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchUsers();
          }}
        />
      )}

      {userToEdit && (
        <UserEditItem
          user={userToEdit}
          onClose={() => setUserToEdit(null)}
          onSuccess={() => {
            setUserToEdit(null);
            fetchUsers();
          }}
        />
      )}

      <ToastContainer autoClose={3000} closeButton />
    </div>
  );
}
