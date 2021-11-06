import styles from "../styles/Compare.module.scss";
import MainLogo from "../components/MainLogo/MainLogo";
import StockCard from "../components/StockCard/StockCard";
import SearchBox from "../components/SearchBox/SearchBox";
import state from "../components/StateProvider";
import { onMount } from "solid-js";
import { useNavigate } from "solid-app-router";

const Compare = (props) => {
  const navigate = useNavigate();

  // import rooted variables
  const {
    stock1,
    stock2,
    mutate1,
    mutate2,
    symbInit1,
    calibrate1,
    calibrate2,
  } = state;

  onMount(async () => {
    if (
      !localStorage.getItem("storedstock1") ||
      localStorage.getItem("storedstock1") === {}
    ) {
      navigate("/", { replace: false });
    } else {
      calibrate1(JSON.parse(localStorage.getItem("storedstock1")));
    }
  });

  return (
    <>
      <MainLogo full />
      <div className={styles.wrapper}>
        {/* --- GraphDiv --- */}
        <div className={styles.graphDiv}>
          <div className={styles.mainInfo}>
            <h2>{!stock1.loading ? stock1()?.Item?.name : "----"}</h2>

            {/*<h3>
              {!stock1.loading
                ? Object.entries(stock1()?.Item?.price)
                    .sort()
                    .reverse()
                    .slice(0, 1)
                : "----"}
            </h3>*/}

            <Show when={stock1()}>
              <h3>
                {Object.entries(stock1()?.Item?.price)
                  .sort()
                  .reverse()
                  .slice(0, 1)}
              </h3>
            </Show>
          </div>
          <table className={styles.mainStats}>
            <tbody>
              <tr>
                <th>52-week high</th>
                <th>52-week low</th>
                <th>dividends</th>
              </tr>
              <tr>
                <td>{stock1()?.Item?.yearhigh}</td>
                <td>{stock1()?.Item?.yearlow}</td>
                <td>{stock1()?.Item?.dividend}</td>
              </tr>
            </tbody>
          </table>
          <div>
            {stock1.isLoading ? (
              <p>Loading...</p>
            ) : (
              <p style="max-height:8rem; overflow:hidden; margin-top:8rem;">
                {JSON.stringify(stock1()?.Item?.price)}
              </p>
            )}
            <br />
            <button
              style={{ position: "absolute", bottom: "0", left: "0" }}
              onClick={() => {
                calibrate1("AAP");
                console.log(stock1());
              }}
            >
              Hit me!
            </button>
            <button
              style={{ position: "absolute", bottom: "0", left: "5rem" }}
              onClick={() => {
                calibrate1("A");
              }}
            >
              Hit me!
            </button>
          </div>
        </div>

        {/* --- SearchDiv --- */}
        <div className={styles.searchDiv}>
          <h3>Compare:</h3>
          <SearchBox />
        </div>

        {/* --- CorrelationsDiv --- */}
        <div className={styles.correlationsDiv}>
          <h3>Correlation Matchups with AAPL</h3>
          <br />
          <p style={{ width: "100%", height: "auto", marginBottom: "30px" }}>
            Search for another stock to compute the correlation factor to the
            current stock
          </p>
          <br />
          <Show when={!stock1()?.isLoading} fallback={<p>Loading...</p>}>
            <div>
              <Show when={stock1()?.Item?.pos_vals}>
                <h4>Highest Positive Correlations</h4>
              </Show>
              <For each={stock1()?.Item?.pos_vals.slice(0, 3)}>
                {(each, i) => (
                  <StockCard symbol={each.name} outlined grey fullWidth />
                )}
              </For>
            </div>
          </Show>

          <Show when={!stock1()?.isLoading} fallback={<p>Loading...</p>}>
            <div>
              <Show when={stock1()?.Item?.neg_vals}>
                <h4>Most Negative Correlations</h4>
              </Show>
              <For each={stock1()?.Item?.neg_vals.slice(0, 3)}>
                {(each, i) => (
                  <StockCard symbol={each.name} outlined grey fullWidth />
                )}
              </For>
            </div>
          </Show>

          <Show when={!stock1()?.isLoading} fallback={<p>Loading...</p>}>
            <div>
              <Show when={stock1()?.Item?.dec_vals}>
                <h4>Highest Positive Correlations</h4>
              </Show>
              <For each={stock1()?.Item?.dec_vals.slice(0, 3)}>
                {(each, i) => (
                  <StockCard symbol={each.name} outlined grey fullWidth />
                )}
              </For>
            </div>
          </Show>
        </div>
      </div>
    </>
  );
};

export default Compare;
