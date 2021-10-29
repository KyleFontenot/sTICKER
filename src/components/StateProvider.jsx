// @ts-no-check
import { createSignal, createContext, useContext } from "solid-js";

const StateContext = createContext();

const APILINK = "https://c5fin9n590.execute-api.us-east-2.amazonaws.com/items";

// class Context {
//   id: number;
//   Provider: string;
//   defaultValue: any;
// }

export function StateProvider(props) {
  const [symbol, setSymbol] = createSignal(null),
    store = [
      symbol,
      {
        grabSymbol(symbol) {
          let link = `${APILINK}/${symbol}`;
          fetch(link, {
            method: "GET",
            mode: "no-cors",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((res) => {
              console.log(res);
            })
            .then((data) => {
              console.log(data);
              setSymbol(data);
            })
            .catch((err) => console.log(err));

          console.log("something");
          // setCount(c => c + 1);
        },
      },
    ];

  return (
    <StateContext.Provider value={store}>
      {props.children}
    </StateContext.Provider>
  );
}

export function useStateProvider() {
  return useContext(StateContext);
}
