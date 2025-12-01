import NavBar from "@/shared/components/ui/Navbar/navbar";

export default function TeacherLayout({ children }) {
  return (
    <div>
      <nav>
        <NavBar />
      </nav>
      {children}
    </div>
  );
}
