import NavBar from "@/shared/components/Navbar/navbar";
import Header from "../shared/components/Header/header";
import Footer from "@/shared/components/Footer/footer";
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
