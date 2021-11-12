import styles from "./SearchBox.module.scss";
import {
  createSignal,
  For,
  Show,
  createResource,
  onMount,
  onCleanup,
} from "solid-js";
import { Dynamic } from "solid-js/web";
// import LoadingIcon from "../LoadingIcon/LoadingIcon";
import StockCard from "../StockCard/StockCard";
// import { useGlobalState } from "../StateProvider";
import SvgHelpTip from "../../images/helptip.svg";

const listOfSymbols = [
  "a",
  "aap",
  "abbv",
  "adbe",
  "ajg",
  "akam",
  "alb",
  "alk",
  "amcr",
  "amp",
  "aptv",
  "ba",
  "bio",
  "br",
  "carr",
  "cb",
  "ce",
  "cinf",
  "cl",
  "cma",
  "cme",
  "cmi",
  "cnc",
  "coo",
  "cost",
  "crm",
  "dd",
  "dgx",
  "duk",
  "ebay",
  "etr",
  "evrg",
  "exc",
  "fang",
  "fast",
  "fox",
  "frt",
  "ftnt",
  "gd",
  "dux",
];

const APILINK = "https://c5fin9n590.execute-api.us-east-2.amazonaws.com/items";

const grabAvailableStocks = async () => {
  let data = await fetch(APILINK).then((res) => res.json());
  return data;
};

const SearchBox = (props) => {
  const [availableStocks, setAvailableStocks] = createSignal([]);
  let inputref;
  onCleanup(() => setAvailableStocks([]));

  async function handleInputChange(e) {
    if (!e.target.value) {
      setAvailableStocks([]);
    } else {
      setAvailableStocks(
        listOfSymbols.filter((element) => element.includes(e.target.value))
      );
    }
  }

  return (
    <div style={props.style} className={styles.container}>
      <div className={styles.searchBox}>
        <input
          type="text"
          maxLength="4"
          ref={inputref}
          placeholder="Search stock by symbol"
          className={styles.searchBoxInput}
          onInput={(e) => handleInputChange(e)}
          onFocusOut={() => {
            // settimeout to allow focusOut behavior while allowing navigate in Router to work.
            setTimeout(() => {
              inputref.value = "";
              setAvailableStocks([]);
            }, 200);
          }}
          autocomplete="off"
        />
        <div className={styles.stockDiv}>
          <div className={styles.stockDiv}>
            <For each={availableStocks()}>
              {(stock) => {
                if (props.comparing) {
                  return (
                    <Dynamic component={StockCard} symbol={stock} comparing />
                  );
                } else {
                  return <Dynamic component={StockCard} symbol={stock} />;
                }
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
