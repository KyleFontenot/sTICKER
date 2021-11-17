import {
  createSignal,
  createContext,
  useContext,
  createResource,
  createEffect,
  createRoot,
  createMemo,
  onMount,
} from "solid-js";

// var Statistics = require("/path/to/statistics.js");
import Statistics from "../utils/statistics.js";

const APILINK = "https://c5fin9n590.execute-api.us-east-2.amazonaws.com/items";

const fetchData = async (symbol) => {
  let data = await fetch(`${APILINK}/${symbol}`).then((res) => res.json());
  return data;
};

function StateProvider(props) {
  const { spearmansRho } = Statistics;
  const [fetchSignal1, setFetchSignal1] = createSignal(null);
  const [fetchSignal2, setFetchSignal2] = createSignal(null);

  const [stock1, { mutate: mutate1 }] = createResource(fetchSignal1, fetchData);
  const [stock2, { mutate: mutate2 }] = createResource(fetchSignal2, fetchData);

  /*

-Take only the rows for both stocks where the dates line up- for both stocks, no values can be empty.

-Calculate the percentage movements of each stock (I think you are doing this already)

-Take the percentage movements, and run them through a 'spearman' correlation.

*/
  // onMount(() => {
  //   console.log();
  // });
  const correlationFactor = (firstStock, secondStock) => {
    console.log();
    let firstColumn = {
      length: firstStock?.Item?.price.length,
      array: firstStock?.Item?.price,
      percentChanges: firstStock?.Item?.price.map((entry, index, array) =>
        ((entry["price"] - array[index + 1]["price"]) * 100).toFixed(2)
      ),
    };
    let secondColumn = {
      length: secondStock?.Item?.price.length,
      array: secondStock?.Item?.price,
    };

    // check for length of array

    //

    console.log(firstStock?.Item?.price[0]["price"]);
    return firstColumn.percentChanges;
  };

  const correlationMemo = createMemo(() =>
    correlationFactor(stock1(), stock2())
  );

  createEffect(() => {
    stock1() && localStorage.setItem("storedstock1", JSON.stringify(stock1()));
  });
  createEffect(() => {
    stock2() && localStorage.setItem("storedstock2", JSON.stringify(stock2()));
  });

  function calibrate1(symb) {
    if (typeof symb === "object" || typeof symb === null) {
      mutate1(symb);
    } else {
      setFetchSignal1(symb);
    }
  }
  function calibrate2(symb) {
    if (typeof symb === "object") {
      mutate2(symb);
    } else {
      setFetchSignal2(symb);
    }
  }

  return {
    stock1,
    stock2,
    mutate1,
    mutate2,
    calibrate1,
    calibrate2,
    correlationFactor,
    correlationMemo,
  };
}
// creates global access to the returned values. This defines global context/state, unique to SolidJS
export default createRoot(StateProvider);

// export function useGlobalState() {
//   return useContext(StateContext);
// }
