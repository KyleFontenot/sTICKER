import styles from "./SearchBox.module.scss";
// import LoadingIcon from "../LoadingIcon/LoadingIcon";
// import MainLogo from "../MainLogo/MainLogo";
// import SearchIcon from '/searchicon.png'
// import HelpIcon from "../../images/helptip.svg";
import StockCard from "../StockCard/StockCard";
import { useStateProvider } from "../StateProvider";
import SvgHelpTip from "../../images/helptip.svg";

const listOfSymbols = ["fcre", "aapl", "imuc"];

const SearchBox = (props) => {
  const [count, { increment, decrement }] = useStateProvider();

  const handleInputChange = (e) => {
    if (listOfSymbols.some((res) => res.includes(e.target.value))) {
    }
  };

  return (
    <>
      <div className={styles.searchBox}>
        <input
          type="text"
          maxLength="4"
          name="first"
          id="first"
          placeholder="Search stock by symbol"
          className={styles.searchBoxInput}
          onChange={(e) => handleInputChange(e)}
        />
        <StockCard />
      </div>
      {props.description ? (
        <div className={styles.description}>
          <SvgHelpTip className={styles.icon} />

          <h3 style={{ display: "inline-block", marginLeft: "2rem" }}>
            How it works
          </h3>
          <p>
            Use sTICKER to search for any stock and find other stocks by how
            little or how much they are correlated.
          </p>
        </div>
      ) : null}
    </>
  );
};

export default SearchBox;
