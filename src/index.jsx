import { render } from "solid-js/web";
import { Router } from "solid-app-router";
import { StateProvider } from "./components/StateProvider";

import "./index.css";
import App from "./App";

render(
  () => (
    <Router>
      <StateProvider>
        <App />
      </StateProvider>
    </Router>
  ),
  document.getElementById("root")
);
