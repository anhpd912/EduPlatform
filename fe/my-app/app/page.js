import NavBar from "@/shared/components/ui/Navbar/navbar";
import Header from "../shared/components/ui/Header/header";
import Footer from "@/shared/components/ui/Footer/footer";
import "./globals.css";
export default function Page() {
  return (
    <div>
      <nav>
        <NavBar />
      </nav>
      <header>
        <Header />
      </header>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
