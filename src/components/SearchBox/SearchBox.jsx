import styles from "./SearchBox.module.scss";
import { createSignal, For, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
// import LoadingIcon from "../LoadingIcon/LoadingIcon";
import StockCard from "../StockCard/StockCard";
import { useStateProvider } from "../StateProvider";
import SvgHelpTip from "../../images/helptip.svg";

const listOfSymbols = [
  "fcre",
  "aapl",
  "imuc",
  "jgh",
  "exfo",
  "atnx",
  "aav",
  "cbak",
  "mcri",
  "jmei",
  "ddez",
  "arr_a",
  "kbh",
  "rdwr",
  "cps",
  "ebix",
  "wbs",
  "tusk",
  "ccl",
  "tsem",
  "bbdo",
  "luv",
  "lpth",
  "or",
  "dfnd",
  "vbnd",
  "ayx",
  "gatx",
  "embu",
  "dwaq",
  "nbtb",
  "ric",
  "bzh",
  "edom",
  "spg_j",
  "eltk",
  "zfgn",
  "bbg",
  "yrcw",
  "two_a",
  "plse",
  "ric",
];

const SearchBox = (props) => {
  const [count, { increment, decrement }] = useStateProvider();
  // const [inputValue, setInputValue] = createSignal(null);
  const [availableStocks, setAvailableStocks] = createSignal([]);

  async function handleInputChange(e) {
    if (e.target.value === "") {
      setAvailableStocks([]);
      return;
    } else {
      setAvailableStocks(
        listOfSymbols.filter((element) => element.includes(e.target.value))
      );
    }
  }

  return (
    <div style={props.style}>
      <div className={styles.searchBox}>
        <input
          type="text"
          maxLength="4"
          name="first"
          id="first"
          placeholder="Search stock by symbol"
          className={styles.searchBoxInput}
          onInput={(e) => handleInputChange(e)}
          autocomplete="off"
        />
        <div className={styles.stockDiv}>
          {/*<Show when={availableStocks()}>
            <StockCard></StockCard>
          </Show>*/}
          <div className={styles.stockDiv}>
            <For each={availableStocks()}>
              {(stock) => {
                console.log(stock);
                return <Dynamic component={StockCard} symbol={stock} />;
              }}
            </For>
          </div>
        </div>
      </div>
      {props.description ? (
        <div className={styles.description}>
          <SvgHelpTip className={styles.icon} />
          <h3 style={{ display: "inline-block", marginLeft: "2rem" }}>
            How it works
          </h3>
          <br />
          <p>
            Use sTICKER to search for any stock and find other stocks by how
            little or how much they are correlated.
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default SearchBox;
