import styles from "./StockCard.module.scss";
import { Link } from "solid-app-router";

const StockCard = (props) => {
  return (
    <Link href="/compare" className={styles.card}>
      <div className={styles.badge}>{props.symbol.toUpperCase()}</div>
      <p style={{ display: "inline-block" }}>{props.symbol.toUpperCase()}</p>
    </Link>
  );
};
export default StockCard;
