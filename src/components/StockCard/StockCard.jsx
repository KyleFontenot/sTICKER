import styles from "./StockCard.module.scss";
import { Link } from "solid-app-router";
import { useNavigate } from "solid-app-router";

// import { useGlobalState } from "../StateProvider";
import state from "../StateProvider";

const StockCard = (props) => {
  const navigate = useNavigate();
  // Weird global conext solution "Withouit context" only in SolidJS
  const { stock1, stock2, calibrate1, calibrate2 } = state;

  async function handleClick(e) {
    await calibrate1(props.symbol.toUpperCase());

    // navigate("/compare", { replace: true });
    if (!props.pivot) {
      navigate("/compare", { replace: false });
    }
  }

  return (
    <button
      classList={{
        [styles.card]: true,
        [styles.cardoutlined]: props.outlined,
        [styles.cardgrey]: props.grey,
        [styles.fullWidth]: props.fullWidth,
        [props.className]: props.className,
      }}
      onClick={(e) => {
        handleClick(e);
      }}
    >
      <div className="badge">{props.symbol}</div>
      <p style={{ display: "inline-block" }}>{props.symbol.toUpperCase()}</p>
    </button>
  );
};
export default StockCard;
