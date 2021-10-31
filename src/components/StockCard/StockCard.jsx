import styles from "./StockCard.module.scss";
import { Link } from "solid-app-router";
import { useNavigate } from "solid-app-router";
// import { useGlobalState } from "../StateProvider";
import state from "../StateProvider";

// const navigate = useNavigate();

const StockCard = (props) => {
  const navigate = useNavigate();
  // Weird global conext solution "Withouit context" only in SolidJS
  const { stock1, stock2, calibrate1, calibrate2 } = state;
  // const [stock1, stock2, { calibrate1, calibrate2 }] = useGlobalState();
  // console.log(stock1);
  // const [stock2, { mutateStock2, setSymbol2 }] = useGlobalState();

  async function handleClick(e) {
    await calibrate1("fcre");
    setTimeout(() => {
      console.log(stock1);
    }, 700);
    navigate("/compare", { replace: true });
  }

  return (
    <Link
      href="#"
      classList={{
        [styles.card]: true,
        [styles.cardoutlined]: props.outlined,
        [styles.cardgrey]: props.grey,
      }}
      onClick={(e) => {
        handleClick(e);
      }}
    >
      <div className="badge">{props.symbol.toUpperCase()}</div>
      <p style={{ display: "inline-block" }}>{props.symbol.toUpperCase()}</p>
    </Link>
  );
};
export default StockCard;
