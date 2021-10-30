import styles from "./StockCard.module.scss";
import { Link } from "solid-app-router";
// import { useNavigate } from "solid-app-router";
// const navigate = useNavigate();

const StockCard = (props) => {
  function handleClick(e) {}
  return (
    <Link
      href="/compare"
      className={styles.card}
      onClick={(e) => {
        handleClick(e);
        // navigate("/compare", { replace: false });
      }}
    >
      <div className={styles.badge}>{props.symbol.toUpperCase()}</div>
      <p style={{ display: "inline-block" }}>{props.symbol.toUpperCase()}</p>
    </Link>
  );
};
export default StockCard;
