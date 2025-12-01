import { useRouter } from "next/router";

export const useAuth = () => {
  const snap = useSnapshot(authStore);
  const router = useRouter();
  // Redirect if already authenticated
  useEffect(() => {
    if (snap.isAuthenticated) {
      let redirectPath = getRedirectPath(snap.isAuthenticated, snap.role);
      router.push(redirectPath);
    }
  }, [snap.isAuthenticated, snap.role, router]);
};

export default useAuth;
