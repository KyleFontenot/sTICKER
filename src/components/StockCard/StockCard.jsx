import styles from "./StockCard.module.scss";
import { Link } from "solid-app-router";
import { useNavigate } from "solid-app-router";

// import { useGlobalState } from "../StateProvider";
import state from "../StateProvider";

const StockCard = (props) => {
  const navigate = useNavigate();
  // Weird global context solution "Without context" only in SolidJS
  const { stock1, stock2, calibrate1, calibrate2 } = state;

  async function handleClick(e) {
    if (props.comparing) {
      await calibrate2(props.symbol);
    } else {
      // await calibrate2(null);
      navigate("/compare", { replace: false });
      await calibrate1(props.symbol);
    }
  }

  return (
    <div className={styles.container} style={props.style}>
      <button
        classList={{
          [styles.card]: true,
          [styles.cardoutlined]: props.outlined,
          [styles.fullWidth]: props.fullWidth,
          [styles.filledin]: props.filledin,
          [styles.comparing]: props.comparing,
        }}
        onClick={(e) => {
          handleClick(e);
        }}
      >
        <div
          classList={{ [styles.comparingBadge]: props.comparing, badge: true }}
        >
          {props.symbol}
        </div>
        <p style={{ display: "inline-block" }}>{props.symbol}</p>
      </button>
      {props.closable && (
        <span
          className={styles.closable}
          onClick={async () => {
            await calibrate2(null);
          }}
        >
          x
        </span>
      )}
    </div>
  );
};
export default StockCard;
