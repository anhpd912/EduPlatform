export const useAuth = () => {
  const token = localStorage.getItem("jwt_token");
  const isAuthenticated = token ? true : false;
  return { token, isAuthenticated };
};

export default useAuth;
