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

    // setTimeout(() => {
    //   console.log(stock1());
    // }, 500);
  });

  createEffect(() => {
    if (stock1()) {
      setlastWeekPercentChange(
        (
          ((Object.entries(stock1()?.Item?.price[1])[0][1] -
            Object.entries(stock1()?.Item?.price[0])[0][1]) /
            Object.entries(stock1()?.Item?.price[1])[0][1]) *
          100
        ).toFixed(2)
      );

      //  "labels" outside datasets should be the date
      // the data property should be the one inside the data set.
      console.log(
        Object.entries(stock1().Item.price.slice(0, 11)).map(
          (entry) => Object.entries(entry[1])[0][0]
        )
      );
      // console.log(stock1()?.Item?.price[0]);

      const myChart = new Chart(chartref, {
        type: "line",
        data: {
          labels: Object.entries(stock1().Item.price.slice(0, 11)).map(
            (entry) => Object.entries(entry[1])[0][0]
          ),
          datasets: [
            {
              data: Object.entries(stock1().Item.price.slice(0, 11)).map(
                (entry) => Object.entries(entry[1])[0][1]
              ),
              backgroundColor: "#00dd5538",
              borderColor: "green",
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

      // const myChart = new Chart(chartref, {
      //   type: "line",
      //   data: {
      //     labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      //     datasets: [
      //       {
      //         data: [12, 19, 3, 5, 2, 3],
      //         backgroundColor: "#00dd5538",
      //         borderColor: "green",
      //         borderWidth: 2,
      //       },
      //     ],
      //   },
      //   options: {
      //     responsive: true,
      //     maintainAspectRatio: false,
      //     plugins: {
      //       legend: false,
      //     },
      //     scales: {
      //       y: {
      //         beginAtZero: false,
      //       },
      //     },
      //   },
      // });

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
          {/*{stock1.isLoading ? (
              <p>Loading...</p>
            ) : (
              <p style="max-height:8rem; overflow:hidden; margin-top:8rem;">
                {JSON.stringify(stock1()?.Item?.price)}
              </p>
            )}
            <br />*/}

          <canvas ref={chartref} class={styles.graph}></canvas>
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
