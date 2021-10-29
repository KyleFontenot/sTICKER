import styles from "./SearchBox.module.scss";
import { createSignal, For } from "solid-js";
// import LoadingIcon from "../LoadingIcon/LoadingIcon";
// import MainLogo from "../MainLogo/MainLogo";
// import SearchIcon from '/searchicon.png'
// import HelpIcon from "../../images/helptip.svg";
import StockCard from "../StockCard/StockCard";
import { useStateProvider } from "../StateProvider";
import SvgHelpTip from "../../images/helptip.svg";

const listOfSymbols = ["fcre", "aapl", "imuc"];
let inputBox;

const SearchBox = (props) => {
  const [count, { increment, decrement }] = useStateProvider();
  const [inputValue, setInputValue] = createSignal(null);
  const [availableStocks, setAvailableStocks] = createSignal([]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    inputValue.some();
  };

  return (
    <>
      <div className={styles.searchBox}>
        <input
          type="text"
          maxLength="4"
          name="first"
          id="first"
          ref={inputBox}
          placeholder="Search stock by symbol"
          className={styles.searchBoxInput}
          onInput={(e) => handleInputChange(e)}
        />
        <p>{inputValue}</p>
        <div className={styles.Stock}>
          <For each={availableStocks()}>
            {(cat, i) => (
              <li>
                <a
                  target="_blank"
                  href={`https://www.youtube.com/watch?v=${cat.id}`}
                >
                  {i() + 1}: {cat.name}
                </a>
              </li>
            )}
          </For>
          <StockCard />
        </div>
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
