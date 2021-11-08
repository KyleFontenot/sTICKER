import styles from "../styles/Compare.module.scss";
import MainLogo from "../components/MainLogo/MainLogo";
import StockCard from "../components/StockCard/StockCard";
import SearchBox from "../components/SearchBox/SearchBox";
import state from "../components/StateProvider";
import { onMount, createEffect, createSignal } from "solid-js";
import { useNavigate } from "solid-app-router";
import IconArrow from "../assets/arrow.svg";

const Compare = (props) => {
  const navigate = useNavigate();
  const [lastWeekPercentChange, setlastWeekPercentChange] = createSignal(0);

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
      navigate("/", { replace: true });
    } else {
      calibrate1(JSON.parse(localStorage.getItem("storedstock1")));
    }
    // setTimeout(() => {
    //   console.log(stock1());
    // }, 500);
  });

  createEffect(() => {
    if (!stock1.loading && !stock1.error) {
      setlastWeekPercentChange(
        (
          ((Object.entries(stock1()?.Item?.price[1])[0][1] -
            Object.entries(stock1()?.Item?.price[0])[0][1]) /
            Object.entries(stock1()?.Item?.price[1])[0][1]) *
          100
        ).toFixed(2)
      );
    }
  });

  return (
    <>
      <MainLogo full />
      <div className={styles.wrapper}>
        {/* MainInfo div*/}
        <div className={styles.mainInfo}>
          <div>
            <h2>{!stock1.loading ? stock1()?.Item?.name : "----"}</h2>
            <Show when={stock1()}>
              {/* Symbol */}
              <h3>{!stock1.loading ? stock1()?.Item?.ticker : "----"}</h3>
            </Show>
          </div>

          <div className={styles.priceDiv}>
            <Show when={stock1()}>
              {/* Latest price */}
              <p>
                as of
                {stock1() && Object.entries(stock1()?.Item?.price[0])[0][0]}
              </p>
              <h3>{`$${Object.entries(stock1()?.Item?.price[0])[0][1]}
              `}</h3>
              <br />
              <p>Since previous week</p>
              <h3
                style={{
                  color: lastWeekPercentChange() > 0 ? "#6cd83c" : "#F44336",
                }}
              >
                <IconArrow
                  style={{
                    transform: `rotate(${
                      lastWeekPercentChange() > 0
                        ? -45
                        : lastWeekPercentChange() === 0
                        ? 0
                        : 45
                    }deg)`,
                    lineHeight: "1rem",
                    top: "5px",
                    position: "relative",
                  }}
                />

                {`%${lastWeekPercentChange()}`}
              </h3>
            </Show>
          </div>
        </div>

        {/* Main Stats Div */}
        <table className={styles.mainStats}>
          <tbody>
            <tr>
              <th>Sector</th>
              <th>52-Week High</th>
              <th>52-Week Low</th>
              <th>Dividends</th>
            </tr>
            <tr>
              <td style="text-transform: capitalize;">
                {stock1()?.Item?.sector?.toLowerCase()}
              </td>
              <td>{`$${stock1()?.Item?.yearhigh}`}</td>
              <td>{`$${stock1()?.Item?.yearlow}`}</td>
              <td>{stock1()?.Item?.dividend}</td>
            </tr>
          </tbody>
        </table>

        {/* --- GraphDiv --- */}
        <div className={styles.graphDiv}>
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
          <p style={{ width: "100%" }}>
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
                  <StockCard symbol={each?.name} outlined grey fullWidth />
                )}
              </For>
            </div>
          </Show>
        </div>

        <div style="grid-column: 1 / -1; padding: 2rem 15%;">
          <Show when={stock1()?.Item?.dec_vals}>
            <h2 style="margin-bottom:1rem;">About {stock1()?.Item?.name}:</h2>
            <p>{stock1()?.Item?.description}</p>
          </Show>
        </div>
      </div>
    </>
  );
};

export default Compare;
