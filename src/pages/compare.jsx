import styles from "../styles/Compare.module.scss";
import MainLogo from "../components/MainLogo/MainLogo";
import StockCard from "../components/StockCard/StockCard";
import SearchBox from "../components/SearchBox/SearchBox";
import state from "../components/StateProvider";
import { onMount, createEffect, createSignal, onCleanup } from "solid-js";
import { useNavigate } from "solid-app-router";
import IconArrow from "../assets/arrow.svg";
import Chart from "chart.js/auto";

import SolidChart from "solid-chart.js";

const Compare = (props) => {
  const navigate = useNavigate();
  const [lastWeekPercentChange, setlastWeekPercentChange] = createSignal(0);
  // const [graphdata, setGraphData] = createSignal(null);

  let chartref;

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
  });

  function differenceInWeekPrice(latestWeekPrice, previousWeekPrice) {
    return (
      ((previousWeekPrice - latestWeekPrice) / previousWeekPrice) *
      100
    ).toFixed(2);
  }

  createEffect(() => {
    if (stock1()) {
      let previousWeek = Object.entries(stock1()?.Item?.price[1])[0][1];
      let latestWeek = Object.entries(stock1()?.Item?.price[0])[0][1];

      setlastWeekPercentChange(differenceInWeekPrice(latestWeek, previousWeek));

      const myChart = new Chart(chartref, {
        type: "line",
        data: {
          // X axis labels on bottom
          labels: Object.entries(
            stock1().Item.price.slice(0, 11)
          ).map((entry) =>
            Object.entries(entry[1])[0][0]
              .replace("-", "/")
              .split("")
              .slice(5, 14)
              .join("")
          ),
          datasets: [
            {
              data: Object.entries(stock1().Item.price.slice(0, 11)).map(
                (entry) => Object.entries(entry[1])[0][1]
              ),
              backgroundColor: "#e8b023",
              borderColor: "#e8b023",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: false,
          },
          scales: {
            y: {
              beginAtZero: false,
            },
          },
        },
      });

      onCleanup(() => {
        myChart.destroy();
      });
    }
  });

  return (
    <>
      <MainLogo full />
      <div className={styles.wrapper}>
        {/* MainInfo div*/}
        <div className={styles.mainInfo}>
          <div>
            <h2
              classList={{ [styles.skeleton]: stock1.loading }}
              style="display: inline-block;"
            >
              {!stock1.loading ? stock1()?.Item?.name : ""}
            </h2>
            <p
              classList={{ [styles.skeleton]: stock1.loading }}
              style="display: inline-block;margin-left:0.8rem;letter-spacing:1px;"
            >
              {!stock1.loading ? "S&P500" : ""}
            </p>
            <br />

            {/* Symbol */}
            <h3 classList={{ [styles.skeleton]: stock1.loading }}>
              {!stock1.loading ? stock1()?.Item?.ticker : ""}
            </h3>
          </div>

          <div className={styles.priceDiv}>
            <Show when={stock1()}>
              {/* Latest price */}
              <p>
                as of &nbsp;
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
                    transition: "none!important",
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
          <canvas
            ref={chartref}
            classList={{
              [styles.graph]: true,
              [styles.skeleton]: stock1.loading,
            }}
          ></canvas>
        </div>

        {/* --- SearchDiv --- */}
        <div className={styles.searchDiv}>
          <h3>Compare:</h3>
          <SearchBox comparing />
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

          <Show when={!stock1.loading} fallback={<p>Loading...</p>}>
            <div>
              <Show when={stock1()?.Item?.pos_vals}>
                <h4>Highest Positive Correlations</h4>
              </Show>
              <For each={stock1()?.Item?.pos_vals.slice(0, 3)}>
                {(each, i) => (
                  <StockCard symbol={each.name} outlined grey fullWidth pivot />
                )}
              </For>
            </div>
          </Show>

          <Show when={!stock1.loading} fallback={<p>Loading...</p>}>
            <div>
              <Show when={stock1()?.Item?.neg_vals}>
                <h4>Most Negative Correlations</h4>
              </Show>
              <For each={stock1()?.Item?.neg_vals.slice(0, 3)}>
                {(each, i) => (
                  <StockCard symbol={each.name} outlined grey fullWidth pivot />
                )}
              </For>
            </div>
          </Show>

          <Show when={!stock1.loading} fallback={<p>Loading...</p>}>
            <div>
              <Show when={stock1()?.Item?.dec_vals}>
                <h4>Most Unrelated Correlations</h4>
              </Show>
              <For each={stock1()?.Item?.dec_vals.slice(0, 3)}>
                {(each, i) => (
                  <StockCard
                    symbol={each?.name}
                    outlined
                    grey
                    fullWidth
                    pivot
                  />
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
