import styles from "./SearchBox.module.scss";
import {
  createSignal,
  For,
  Show,
  createResource,
  onMount,
  onCleanup,
  createEffect,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import StockCard from "../StockCard/StockCard";
import SvgHelpTip from "../../images/helptip.svg";

const LISTAPI = "https://ea2fun7j33.execute-api.us-east-2.amazonaws.com/list";

const grabAvailableStocks = async () => {
  return await fetch(LISTAPI).then((res) => res.json());
};

const SearchBox = (props) => {
  const [availableStocks, setAvailableStocks] = createSignal([]);
  const [masterStocks, setMasterStocks] = createSignal([]);

  const [fetchmasterlistToggle, setFetchmasterlistToggle] = createSignal(false);

  const [grabbedListObject, { mutate: manuallyList }] = createResource(
    fetchmasterlistToggle,
    grabAvailableStocks
  );

  onMount(async () => {
    if (!localStorage.getItem("availableStocks")) {
      setFetchmasterlistToggle(true);
      let fetchedListOfStocks = await grabAvailableStocks();
      localStorage.setItem(
        "availableStocks",
        JSON.stringify(fetchedListOfStocks)
      );
      let formattedList = fetchedListOfStocks.Items.map((each) => each.ticker);
      setMasterStocks(formattedList);
    } else {
      let flatmapformat = JSON.parse(
        localStorage.getItem("availableStocks")
      ).Items.map((each) => each.ticker);
      manuallyList(flatmapformat);
      setMasterStocks(flatmapformat);
    }
  });
  // createEffect(() => {
  //   console.log(masterStocks());
  // });

  let inputref;
  onCleanup(() => setAvailableStocks([]));

  async function handleInputChange(e) {
    e.target.value = e.target.value.toUpperCase();
    if (!e.target.value) {
      setAvailableStocks([]);
    } else {
      setAvailableStocks(
        masterStocks().filter((element) => element.includes(e.target.value))
      );
    }
  }
  return (
    <div
      style={props.style}
      classList={{
        [styles.container]: true,
        [styles.containerIfComparing]: props.comparing,
      }}
    >
      <div
        classList={{
          [styles.searchBox]: true,
          skeleton: grabbedListObject.loading,
          splash: !grabbedListObject.loading,
        }}
      >
        <input
          type="text"
          maxLength="4"
          ref={inputref}
          placeholder={
            grabbedListObject.loading ? "Loading..." : `Search stock by symbol`
          }
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
