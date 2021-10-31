import {
  createSignal,
  createContext,
  useContext,
  createResource,
  createRoot,
} from "solid-js";

const StateContext = createContext();

const APILINK = "https://c5fin9n590.execute-api.us-east-2.amazonaws.com/items";
const fetchData = async (symbol) => {
  // console.log(stock1);
  let data = await fetch(`${APILINK}/${symbol}`).then((res) => res.json());
  // console.log(data);
  return data;
};

function StateProvider(props) {
  const [symbInit1, setInit1] = createSignal(null);
  const [symbInit2, setInit2] = createSignal(null);
  const [random, setRandom] = createSignal(null);

  const [stock1] = createResource(symbInit1, fetchData);
  const [stock2] = createResource(calibrate2, fetchData);
  function determine(state) {
    state;
  }
  function calibrate1(symb) {
    setInit1(symb);
  }
  function calibrate2(symb) {
    setInit2(symb);
  }

  // let resource1 = [
  //   stock1,
  //   {
  //     mutateStock1,
  //     setSymbol1,
  //   },
  // ];
  // let resource2 = [
  //   stock2,
  //   {
  //     mutateStock2,
  //     setSymbol2,
  //   },
  // ];

  let store = [
    stock1,
    stock2,
    random,
    setRandom,
    {
      calibrate1(sym) {
        setInit1(sym);
      },
      calibrate2(sym) {
        setInit2(sym);
      },
    },
  ];

  // return (
  //   <StateContext.Provider value={store}>
  //     {props.children}
  //   </StateContext.Provider>
  // );
  return {
    stock1,
    stock2,
    random,
    setRandom,
    symbInit1,
    calibrate1,
    calibrate2,
  };
}
export default createRoot(StateProvider);

// export function useGlobalState() {
//   return useContext(StateContext);
// }
