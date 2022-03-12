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
import { Dynamic } from "solid-js/web";
import { useNavigate } from "solid-app-router";
import IconArrow from "../assets/arrow.svg";
import Chart from "chart.js/auto";

// import SolidChart from "solid-chart.js";

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
	const [lastWeekPercentChange1, setlastWeekPercentChange1] = createSignal(0);
	const [lastWeekPercentChange2, setlastWeekPercentChange2] = createSignal(0);

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
		// the -11 would be the common denominator for the stocks.
		console.log(stock1()?.Item?.price.slice(-11, stock1()?.Item?.price.length));

		if (
			!localStorage.getItem("storedstock1") ||
			!localStorage.getItem("storedstock1") === {}
		) {
			navigate("/", { replace: true });
		} else {
			calibrate1(JSON.parse(localStorage.getItem("storedstock1")));
		}
	});
	// represents the maximum amount of weeks shown in chart.
	const chartThreshold = -26;
	const graphDataObject = (numofstocks) => {
		// Least Common Denominator
		let LCD = chartThreshold;
		let stock1Length = stock1()?.Item?.price?.length;
		let stock2Length = stock2()?.Item?.price?.length;
		if (stock2()) {
			let dateQuantityDifference = stock1Length - stock2Length;
			if (
				dateQuantityDifference < 0 &&
				(dateQuantityDifference > chartThreshold ||
					dateQuantityDifference * -1 < chartThreshold * -1)
			) {
				LCD = stock1Length * -1;
			} else if (
				dateQuantityDifference > 0 &&
				(dateQuantityDifference > chartThreshold ||
					dateQuantityDifference * -1 < chartThreshold * -1)
			) {
				LCD = stock2Length * -1;
			}
		}
		console.log(LCD);
		return {
			type: "line",
			data: {
				// X axis labels on bottom
				labels: stock1()
					?.Item?.price.slice(LCD, stock1()?.Item?.price.length)
					.map((entry) =>
						entry["date"].replaceAll("-", "/").split("").slice(0, 14).join("")
					),
				datasets:
					numofstocks === 2
						? [graphDataset(stock1(), LCD), graphDataset(stock2(), LCD)]
						: [graphDataset(stock1(), LCD)],
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

	function graphDataset(stockNum, leastCommonDenom) {
		return {
			data: stockNum?.Item?.price
				.slice(leastCommonDenom, stockNum?.Item?.price.length)
				.map((entry) => entry["price"]),
			backgroundColor: stockNum === stock1() ? "#e8b023" : "#61b2df",
			borderColor: stockNum === stock1() ? "#e8b023" : "#61b2df",
			borderWidth: 2,
			tension: 0.4,
			label: stockNum?.Item?.ticker,
		};
	}

	createEffect(() => {
		if (stock2() && stock1()) {
			let previousWeek1 = stock1()?.Item?.price[1]["price"];
			let latestWeek1 = stock1()?.Item?.price[0]["price"];
			setlastWeekPercentChange1(
				differenceInWeekPrice(latestWeek1, previousWeek1)
			);
			let previousWeek2 = stock2()?.Item?.price[1]["price"];
			let latestWeek2 = stock2()?.Item?.price[0]["price"];
			setlastWeekPercentChange2(
				differenceInWeekPrice(latestWeek2, previousWeek2)
			);
			let myChart = new Chart(chartref, graphDataObject(2));
			myChart.update();
			onCleanup(() => {
				myChart.destroy();
			});
		} else if (stock1()) {
			let previousWeek = stock1()?.Item?.price[1]["price"];
			let latestWeek = stock1()?.Item?.price[0]["price"];
			setlastWeekPercentChange1(
				differenceInWeekPrice(latestWeek, previousWeek)
			);
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
							{!stock1.loading ? "S&P500" : ""}
						</p>
						<br />

						{/* Symbol */}
						<h3 classList={{ [styles.skeleton]: stock1.loading }}>
							{!stock1.loading ? stock1()?.Item?.ticker : ""}
						</h3>
					</div>

					<div className={styles.priceDiv}>
						<div style="text-align:center;align-self:left;line-display:block;line-height: 2.5rem">
							<p style="text-align:left;">
								as of &nbsp;
								{stock1() && stock1()?.Item?.price[0]["date"]}
							</p>
							<br />
							<p>Since previous week</p>
						</div>
						<div>
							<Show when={stock1()}>
								{/* Latest price */}

								<div className={styles.firstStockPrice}>
									<h3>{`$${stock1()?.Item?.price[0]["price"]}
              `}</h3>
									<br />

									<h3
										style={{
											color:
												lastWeekPercentChange1() > 0 ? "#6cd83c" : "#F44336",
										}}
									>
										<IconArrow
											style={{
												transform: `rotate(${
													lastWeekPercentChange1() > 0
														? -45
														: lastWeekPercentChange1() === 0
														? 0
														: 45
												}deg)`,
												lineHeight: "1rem",
												top: "5px",
												position: "relative",
												transition: "none!important",
											}}
										/>

										{`%${lastWeekPercentChange1()}`}
									</h3>
								</div>
							</Show>
						</div>

						<div>
							<Show when={stock2()}>
								{/* Latest price */}

								<div
									style="margin-left: 1.25rem"
									className={styles.secondStockPrice}
								>
									<h3>{`$${stock2()?.Item?.price[0]["price"]}
              `}</h3>
									<br />
									<h3
										style={{
											color:
												lastWeekPercentChange2() > 0 ? "#6cd83c" : "#F44336",
										}}
									>
										<IconArrow
											style={{
												transform: `rotate(${
													lastWeekPercentChange2() > 0
														? -45
														: lastWeekPercentChange2() === 0
														? 0
														: 45
												}deg)`,
												lineHeight: "1rem",
												top: "5px",
												position: "relative",
												transition: "none!important",
											}}
										/>

										{`%${lastWeekPercentChange2()}`}
									</h3>
								</div>
							</Show>
						</div>
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
					<h3 style="margin-bottom: 5.1rem;">Compare:</h3>
					<StockCard
						symbol={stock1()?.Item?.ticker}
						name={stock1()?.Item?.name}
						outlined
						grey
						fullWidth
						filledin
						classList={{ skeleton: stock1().loading }}
					/>
					{stock2() && (
						<StockCard
							symbol={stock2()?.Item?.ticker}
							name={stock2()?.Item?.name}
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
					{stock1() && stock2() ? (
						<div style="text-align: center;">
							<h4 style="margin-top: 1.5rem">Correlation Factor:</h4>
							<p
								style={`color: ${correlationMemo() > 0 ? "#6cd83c" : "#F44336"};
                  font-size: 2.5rem;`}
							>
								{correlationMemo()}
								<span style="font-size: 0.8rem; color: #999; margin-left:0.3rem">
									/100
								</span>
							</p>
						</div>
					) : null}
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
								{(each) => (
									<Dynamic
										component={StockCard}
										symbol={each.name}
										name={each.name}
										outlined
										pivot
										comparing
									/>
								)}
							</For>
						</div>
					</Show>

					<Show when={stock1()?.Item?.neg_vals.length !== 0}>
						<div>
							<h4>Most Negative Correlations</h4>
							<For each={stock1()?.Item?.neg_vals.slice(0, 3)}>
								{(each) => (
									<StockCard
										symbol={each.name}
										name={each.name}
										outlined
										pivot
										comparing
									/>
								)}
							</For>
						</div>
					</Show>

					<Show when={stock1()?.Item?.dec_vals.length !== 0}>
						<div>
							<h4>Most Unrelated Correlations</h4>
							<For each={stock1()?.Item?.dec_vals.slice(0, 3)}>
								{(each, i) => (
									<StockCard
										symbol={each.name}
										name={each.name}
										outlined
										pivot
										comparing
									/>
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
