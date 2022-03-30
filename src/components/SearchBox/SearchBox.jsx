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
import {stocks} from "../../entry-index.json";

const LISTAPI = "https://ea2fun7j33.execute-api.us-east-2.amazonaws.com/list";


const SearchBox = (props) => {
	// const grabAvailableStocks = () => {
	// 	// return await fetch(LISTAPI).then((res) => res.json());
	// 	console.log(entryIndex.stocks);
	// 	return entryIndex.stocks;
	// };

	const [availableStocks, setAvailableStocks] = createSignal([]);
	const [masterStocks, setMasterStocks] = createSignal(stocks);

	const [fetchmasterlistToggle, setFetchmasterlistToggle] = createSignal(false);

	// const [grabbedListObject, { mutate: manuallyList }] = createResource(
	// 	fetchmasterlistToggle,
	// 	grabAvailableStocks
	// );

	// onMount(async () => {
	// 	// await grabAvailableStocks();
	// 	if (!localStorage.getItem("availableStocks")) {
	// 		setFetchmasterlistToggle(true);
	// 		let fetchedListOfStocks = await grabAvailableStocks();
	// 		// localStorage.setItem(
	// 		// 	"availableStocks",
	// 		// 	JSON.stringify(fetchedListOfStocks)
	// 		// );
	// 		localStorage.setItem("availableStocks", fetchedListOfStocks);
	// 		setMasterStocks(
	// 			fetchedListOfStocks.map((each) => {
	// 				return { ticker: each.ticker, name: each.name };
	// 			})
	// 		);
	// 	} else {
	// 		console.log(JSON.parse(localStorage.getItem("availableStocks")));
	// 		let flatmapformat = JSON.parse(
	// 			localStorage.getItem("availableStocks")
	// 		).map((each) => {
	// 			return { ticker: each.ticker, name: each.name };
	// 		});
	// 		// console.log(flatmapformat);
	// 		manuallyList(flatmapformat);
	// 		setMasterStocks(flatmapformat);
	// 	}
	// });

	let inputref;
	onCleanup(() => setAvailableStocks([]));

	async function handleInputChange(e) {
		e.target.value = e.target.value.toUpperCase();
		if (!e.target.value) {
			setAvailableStocks([]);
		} else {
			await setAvailableStocks(
				masterStocks().filter((element) =>
					element?.ticker?.includes(e.target.value)
				)
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
				}}
			>
				<input
					type="text"
					maxLength="4"
					ref={inputref}
					placeholder={
						 `Search stock by symbol`
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
										<Dynamic
											component={StockCard}
											symbol={stock.ticker}
											name={stock.name}
											comparing
										/>
									);
								} else {
									return (
										<Dynamic
											component={StockCard}
											symbol={stock.ticker}
											name={stock.name}
										/>
									);
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
