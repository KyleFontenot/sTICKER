import {
  createSignal,
  createContext,
  useContext,
  createResource,
  createEffect,
  createRoot,
  createMemo,
} from "solid-js";

const APILINK = "https://c5fin9n590.execute-api.us-east-2.amazonaws.com/items";

const fetchData = async (symbol) => {
  let data = await fetch(`${APILINK}/${symbol}`).then((res) => res.json());
  return data;
};

function StateProvider(props) {
  const [symbInit1, setInit1] = createSignal(null);
  const [symbInit2, setInit2] = createSignal(null);

  const [stock1, { mutate: mutate1 }] = createResource(symbInit1, fetchData);
  const [stock2, { mutate: mutate2 }] = createResource(symbInit2, fetchData);

  createEffect(() => {
    stock1() && localStorage.setItem("storedstock1", JSON.stringify(stock1()));
  });
  createEffect(() => {
    stock2() && localStorage.setItem("storedstock2", JSON.stringify(stock2()));
  });
  const correlationFactor = createMemo(() => "something");

  function calibrate1(symb) {
    if (typeof symb === "object") {
      mutate1(symb);
    } else {
      setInit1(symb);
    }
  }
  function calibrate2(symb) {
    if (typeof symb === "object") {
      mutate2(symb);
    } else {
      setInit2(symb);
    }
  }

  return {
    stock1,
    stock2,
    mutate1,
    mutate2,
    symbInit1,
    calibrate1,
    calibrate2,
    correlationFactor,
  };
}
// creates global access to the returned values. This defines global context/state, unique to SolidJS
export default createRoot(StateProvider);

// export function useGlobalState() {
//   return useContext(StateContext);
// }
