import { render } from "solid-js/web";
// import { Router } from "solid-app-router";
// import { StateProvider } from "./components/StateProvider";
// import type { Component } from "solid-js";
import { lazy, onMount } from "solid-js";
import { Router, Routes, Route } from "solid-app-router";
import state from "./components/StateProvider";

// import logo from "./logo.svg";
import styles from "./App.module.css";
import "./styles/globals.css";
import "./styles/custom.scss";

import "./index.css";
// import App from "./App";

const Compare = lazy(() => import("./pages/compare.jsx"));
const Home = lazy(() => import("./pages/index.jsx"));

// render(
//   () => (
//     <StateProvider>
//       <Router>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/compare" element={<Compare />} />
//         </Routes>
//       </Router>
//     </StateProvider>
//   ),
//   document.getElementById("root")
// );
render(
  () => (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/compare" element={<Compare />} />
      </Routes>
    </Router>
  ),
  document.getElementById("root")
);
