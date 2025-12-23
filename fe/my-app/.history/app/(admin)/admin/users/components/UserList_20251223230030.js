"use client";
import { UserService } from "@/shared/services/api/User/UserService";
import { useEffect, useState } from "react";
import styles from "./user-list.module.css";
import {
  PersonAdd,
  Search,
  FilterList,
  People,
  CheckCircle,
  Cancel,
  TrendingUp,
} from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import UserItem from "./UserItem";
import UserDetailItem from "./UserDetailItem";
import UserAddItem from "./UserAddItem";
import UserEditItem from "./UserEditItem";

export default function UserList() {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("all");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    fetchUsers();
  }, [refreshTrigger]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await UserService.getUsers();
      // Ensure users is always an array
      console.log(">>>Info: user list", response.data.content);
      setUserList(response?.data?.content || []);
      setTotalUsers(response?.data?.totalElements || 0);
      setCurrentPage(response?.data?.number + 1 || 1);
      setTotalPages(response?.data?.totalPages || 1);
    } catch (error) {
      toast.error("Failed to load users");
      console.log(error);
      setUserList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
  };

  const handleEdit = (user) => {
    setUserToEdit(user);
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        // await UserService.deleteUser(userId);
        toast.success("User deleted successfully");
        setRefreshTrigger((prev) => prev + 1); // Trigger refresh
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };

  const filteredUsers = (userList || []).filter((user) => {
    const matchesSearch =
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterActive === "all" ||
      (filterActive === "active" && user.isActive) ||
      (filterActive === "inactive" && !user.isActive);

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: userList.length,
    active: userList.filter((u) => u.isActive).length,
    inactive: userList.filter((u) => !u.isActive).length,
  };

  if (loading) {
    return (
      <div className={styles.Container}>
        <div className={styles.LoadingState}>
          <div className={styles.Spinner}></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.Container}>
      <div className={styles.Header}>
        <div className={styles.TitleSection}>
          <h1 className={styles.Title}>User Management</h1>
          <p className={styles.Subtitle}>
            Manage and monitor all users in your system
          </p>
        </div>
        <button
          className={styles.AddButton}
          onClick={() => setShowAddModal(true)}
        >
          <PersonAdd />
          <span>Add New User</span>
        </button>
      </div>

      <div className={styles.StatsGrid}>
        <div className={styles.StatCard}>
          <div
            className={styles.StatIcon}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <People />
          </div>
          <div className={styles.StatContent}>
            <p className={styles.StatLabel}>Total Users</p>
            <h3 className={styles.StatValue}>{stats.total}</h3>
          </div>
        </div>

        <div className={styles.StatCard}>
          <div
            className={styles.StatIcon}
            style={{
              background: "linear-gradient(135deg, #48c774 0%, #06b5a0 100%)",
            }}
          >
            <CheckCircle />
          </div>
          <div className={styles.StatContent}>
            <p className={styles.StatLabel}>Active Users</p>
            <h3 className={styles.StatValue}>{stats.active}</h3>
          </div>
        </div>

        <div className={styles.StatCard}>
          <div
            className={styles.StatIcon}
            style={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            }}
          >
            <Cancel />
          </div>
          <div className={styles.StatContent}>
            <p className={styles.StatLabel}>Inactive Users</p>
            <h3 className={styles.StatValue}>{stats.inactive}</h3>
          </div>
        </div>

        <div className={styles.StatCard}>
          <div
            className={styles.StatIcon}
            style={{
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            }}
          >
            <TrendingUp />
          </div>
          <div className={styles.StatContent}>
            <p className={styles.StatLabel}>Activity Rate</p>
            <h3 className={styles.StatValue}>
              {stats.total > 0
                ? Math.round((stats.active / stats.total) * 100)
                : 0}
              %
            </h3>
          </div>
        </div>
      </div>

      <div className={styles.Controls}>
        <div className={styles.SearchBox}>
          <Search className={styles.SearchIcon} />
          <input
            type="text"
            placeholder="Search by username, email, or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.SearchInput}
          />
        </div>

        <div className={styles.FilterBox}>
          <FilterList className={styles.FilterIcon} />
          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
            className={styles.FilterSelect}
          >
            <option value="all">All Users</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className={styles.TableWrapper}>
        <table className={styles.Table}>
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Username</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Date of Birth</th>
              <th>Status</th>
              <th>Auth Provider</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="10" className={styles.NoData}>
                  <div className={styles.EmptyState}>
                    <People className={styles.EmptyIcon} />
                    <h3>No users found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <UserItem
                  key={user.id}
                  user={user}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className={styles.MobileCardList}>
        {filteredUsers.length === 0 ? (
          <div className={styles.EmptyState}>
            <People className={styles.EmptyIcon} />
            <h3>No users found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user.id} className={styles.MobileCard}>
              <div className={styles.MobileCardHeader}>
                <img
                  src={user.avatarUrl || "/default-avatar.png"}
                  alt={user.username}
                  className={styles.MobileAvatar}
                />
                <div className={styles.MobileUserInfo}>
                  <h4 className={styles.MobileUsername}>{user.username}</h4>
                  <p className={styles.MobileEmail}>{user.email}</p>
                </div>
                <span
                  className={`${styles.MobileStatus} ${
                    user.isActive ? styles.Active : styles.Inactive
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className={styles.MobileCardBody}>
                <div className={styles.MobileInfoRow}>
                  <span className={styles.MobileLabel}>Full Name:</span>
                  <span className={styles.MobileValue}>
                    {user.username || "-"}
                  </span>
                </div>
                <div className={styles.MobileInfoRow}>
                  <span className={styles.MobileLabel}>Phone:</span>
                  <span className={styles.MobileValue}>
                    {user.phoneNumber || "-"}
                  </span>
                </div>
                <div className={styles.MobileInfoRow}>
                  <span className={styles.MobileLabel}>Gender:</span>
                  <span className={styles.MobileValue}>
                    {user.gender ? "Male" : "Female"}
                  </span>
                </div>
                <div className={styles.MobileInfoRow}>
                  <span className={styles.MobileLabel}>Provider:</span>
                  <span className={styles.MobileProvider}>
                    {user.authProvider || "LOCAL"}
                  </span>
                </div>
              </div>
              <div className={styles.MobileCardActions}>
                <button
                  className={styles.MobileViewBtn}
                  onClick={() => handleView(user)}
                >
                  View
                </button>
                <button
                  className={styles.MobileEditBtn}
                  onClick={() => handleEdit(user)}
                >
                  Edit
                </button>
                <button
                  className={styles.MobileDeleteBtn}
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.Footer}>
        <p className={styles.ResultCount}>
          Showing {filteredUsers.length} of {userList.length} users
        </p>
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
          onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
        />
      )}

      {userToEdit && (
        <UserEditItem
          user={userToEdit}
          onClose={() => setUserToEdit(null)}
          onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
        />
      )}

      <ToastContainer autoClose={3000} closeButton />
    </div>
  );
}
