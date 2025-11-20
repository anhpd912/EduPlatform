import styles from "./card.module.css";
export default function Card({ icon, title, description }) {
  const iconElement = icon;

  return (
    <div className={styles.Card}>
      <div className={styles.CardIcon}>{iconElement}</div>
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
}
