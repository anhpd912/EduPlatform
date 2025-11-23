import NavBar from "@/shared/components/ui/Navbar/navbar";

export default function StudentLayout({ children }) {
  return (
    <div>
      <nav>
        <NavBar />
      </nav>
      {children}
    </div>
  );
}
