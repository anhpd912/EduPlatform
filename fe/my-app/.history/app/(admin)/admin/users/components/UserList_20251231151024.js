"use client";
import { UserService } from "@/shared/services/api/User/UserService";
import { useEffect, useState } from "react";
import styles from "./user-list.module.css";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserItem from "./UserItem";
import UserDetailItem from "./UserDetailItem";
import UserAddItem from "./UserAddItem";
import UserEditItem from "./UserEditItem";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";

export default function UserList() {
  const { language } = useLanguage();
  const t = translations[language];
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("all");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [usersPerPage] = useState(9);

  useEffect(() => {
    fetchUsers();
  }, [refreshTrigger, currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await UserService.getUsers({
        page: currentPage,
      });
      console.log(">>>Info: user list", response.data);
      setUserList(response?.data?.content || []);
      setTotalPages(response?.data?.totalPages || 1);
      setTotalElements(response?.data?.totalElements || 0);
    } catch (error) {
      toast.error("Failed to load users");
      console.log(error);
      setUserList([]);
      setTotalPages(1);
      setTotalElements(0);
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

  // Pagination info calculations
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterActive]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value)}
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
            <UserItem key={user.id} user={user} onViewDetails={handleView} onEdit={handleEdit} />
          ))
        )}
      </div>

      {totalElements > 0 && (
        <div className={styles.PaginationContainer}>
          <div className={styles.PaginationInfo}>
            {t.showing || "Showing"} {indexOfFirstUser + 1}-
            {Math.min(indexOfLastUser, totalElements)} {t.of || "of"}{" "}
            {totalElements} {t.users || "users"}
          </div>
          <div className={styles.Pagination}>
            <button
              className={styles.PaginationButton}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon fontSize="small" />
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    className={`${styles.PaginationButton} ${
                      currentPage === pageNumber ? styles.ActivePage : ""
                    }`}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (
                pageNumber === currentPage - 2 ||
                pageNumber === currentPage + 2
              ) {
                return (
                  <span key={pageNumber} className={styles.PaginationDots}>
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              className={styles.PaginationButton}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRightIcon fontSize="small" />
            </button>
          </div>
        </div>
      )}

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
