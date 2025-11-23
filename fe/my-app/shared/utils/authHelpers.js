export const getRedirectPath = (isAuthenticated, roles = []) => {
  if (!isAuthenticated) {
    return "/login";
  }
  if (roles.includes("ADMIN")) {
    return "/admin/dashboard";
  } else if (roles.includes("TEACHER")) {
    return "/teacher/dashboard";
  } else if (roles.includes("STUDENT")) {
    return "/student/dashboard";
  } else {
    return "/login";
  }
};
