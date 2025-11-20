import NavBar from "../Navbar/navbar";
import FeatureGrid from "./feature-grid";
import styles from "./header.module.css";
import HeroSection from "./hero-section";
export default function Header() {
  return (
    <div className={styles.Header}>
      <HeroSection />
      <FeatureGrid />
    </div>
  );
}
