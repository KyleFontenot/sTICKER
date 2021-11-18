import styles from "../styles/Compare.module.scss";
import MainLogo from "../components/MainLogo/MainLogo";
import StockCard from "../components/StockCard/StockCard";
import SearchBox from "../components/SearchBox/SearchBox";
import state from "../components/StateProvider";
import {
  onMount,
  createEffect,
  createSignal,
  onCleanup,
  createMemo,
} from "solid-js";
import { useNavigate } from "solid-app-router";
import IconArrow from "../assets/arrow.svg";
import Chart from "chart.js/auto";

import SolidChart from "solid-chart.js";

/*
-Take only the rows for both stocks where the dates line up- for both stocks, no values can be empty.

-Calculate the percentage movements of each stock (I think you are doing this already)

-Take the percentage movements, and run them through a 'spearman' correlation.
*/

function differenceInWeekPrice(latestWeekPrice, previousWeekPrice) {
  return (
    ((latestWeekPrice - previousWeekPrice) / previousWeekPrice) *
    100
  ).toFixed(2);
}

const Compare = (props) => {
  const navigate = useNavigate();
  const [lastWeekPercentChange, setlastWeekPercentChange] = createSignal(0);

  let chartref;

  // import rooted variables
  const {
    stock1,
    stock2,
    mutate1,
    mutate2,
    calibrate1,
    calibrate2,
    correlationMemo,
  } = state;

  onMount(async () => {
    if (
      !localStorage.getItem("storedstock1") ||
      !localStorage.getItem("storedstock1") === {}
    ) {
      navigate("/", { replace: true });
    } else {
      calibrate1(JSON.parse(localStorage.getItem("storedstock1")));
    }
  });

  const graphDataObject = (numofstocks) => {
    return {
      type: "line",
      data: {
        // X axis labels on bottom
        labels: stock1()
          ?.Item?.price.slice(0, 11)
          .map((entry) =>
            entry["date"].replace("-", "/").split("").slice(5, 14).join("")
          )
          .reverse(),
        datasets:
          numofstocks === 2
            ? [graphDataset(stock1()), graphDataset(stock2())]
            : [graphDataset(stock1())],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          points: {
            borderWidth: 0,
          },
        },
        plugins: {
          legend: {
            display: true,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
              drawTicks: true,
            },
          },
          y: {
            beginAtZero: false,
            title: {
              display: true,
              color: "#aaa",
              text: "Price",
            },
            grid: {
              display: false,
            },
          },
        },
      },
    };
  };

  function graphDataset(stockNum) {
    return {
      data: stockNum?.Item?.price
        .slice(0, 11)
        .map((entry) => entry["price"])
        .reverse(),
      backgroundColor: stockNum === stock1() ? "#e8b023" : "#61b2df",
      borderColor: stockNum === stock1() ? "#e8b023" : "#61b2df",
      borderWidth: 2,
      tension: 0.4,
      label: stockNum?.Item?.ticker,
    };
  }

  createEffect(() => {
    if (stock2() && stock1()) {
      let previousWeek = stock1()?.Item?.price[1]["price"];
      let latestWeek = stock1()?.Item?.price[0]["price"];
      setlastWeekPercentChange(differenceInWeekPrice(latestWeek, previousWeek));
      let myChart = new Chart(chartref, graphDataObject(2));
      myChart.update();
      onCleanup(() => {
        myChart.destroy();
      });
    } else if (stock1()) {
      let previousWeek = stock1()?.Item?.price[1]["price"];
      let latestWeek = stock1()?.Item?.price[0]["price"];
      setlastWeekPercentChange(differenceInWeekPrice(latestWeek, previousWeek));
      let myChart = new Chart(chartref, graphDataObject(1));
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
              <button onClick={() => console.log(correlationMemo())}>
                Correlation factor
              </button>
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
                {stock1() && stock1()?.Item?.price[0]["date"]}
              </p>
              <h3>{`$${stock1()?.Item?.price[0]["price"]}
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
        <div
          classList={{
            [styles.graphDiv]: true,
            [styles.skeleton]: stock1.loading || stock2.loading,
          }}
        >
          <canvas
            ref={chartref}
            classList={{
              [styles.graph]: true,
              [styles.skeleton]: stock2.loading || stock1.loading,
            }}
          ></canvas>
        </div>

        {/* --- SearchDiv --- */}
        <div className={styles.searchDiv}>
          <h3 style="margin-bottom: 5rem;">Compare:</h3>
          <StockCard
            symbol={stock1()?.Item?.ticker}
            outlined
            grey
            fullWidth
            filledin
            classList={{ skeleton: stock1().loading }}
          />
          {stock2() && (
            <StockCard
              symbol={stock2()?.Item?.ticker}
              outlined
              filledin
              comparing
              closable
            />
          )}
          <SearchBox
            comparing
            style={{
              position: "absolute",
              top: "3.3rem",
              width: "calc(100% - 2rem)",
              zIndex: "60",
            }}
          />
        </div>

        {/* --- CorrelationsDiv --- */}
        <div className={styles.correlationsDiv}>
          <h3>
            Correlation Matchups with{" "}
            <span style="font-weight: bold;">
              {stock1()?.Item?.name}
              &nbsp;(
              {stock1()?.Item?.ticker})
            </span>
          </h3>
          <br />
          <p style={{ width: "100%" }}>
            Search for another stock to compute the correlation factor to the
            current stock
          </p>
          <br />

          <Show when={stock1()?.Item?.pos_vals !== 0}>
            <div>
              <h4>Highest Positive Correlations</h4>
              <For each={stock1()?.Item?.pos_vals.slice(0, 3)}>
                {(each, i) => (
                  <StockCard symbol={each.name} outlined comparing pivot />
                )}
              </For>
            </div>
          </Show>

          <Show when={stock1()?.Item?.neg_vals.length !== 0}>
            <div>
              <h4>Most Negative Correlations</h4>
              <For each={stock1()?.Item?.neg_vals.slice(0, 3)}>
                {(each, i) => (
                  <StockCard symbol={each.name} outlined comparing pivot />
                )}
              </For>
            </div>
          </Show>

          <Show when={stock1()?.Item?.dec_vals.length !== 0}>
            <div>
              <h4>Most Unrelated Correlations</h4>
              <For each={stock1()?.Item?.dec_vals.slice(0, 3)}>
                {(each, i) => (
                  <StockCard symbol={each?.name} outlined pivot comparing />
                )}
              </For>
            </div>
          </Show>
        </div>

        <div style="grid-column: 1 / -1; padding: 2rem 15%;">
          <h2 style="margin-bottom:1rem;">About {stock1()?.Item?.name}:</h2>
          <p>{stock1()?.Item?.description}</p>
        </div>
      </div>
    </>
  );
};

export default Compare;
