// import type { Component } from "solid-js";
import { lazy, onMount } from "solid-js";
import { Routes, Route, Link } from "solid-app-router";

// import logo from "./logo.svg";
// import styles from "./App.module.css";
import "./styles/globals.css";

const Compare = lazy(() => import("./components/Compare/Compare"));
const Home = lazy(() => import("./components/Home/Home"));
// const NotFound = lazy(() => import("/pages/[...all].js"));

const App = () => {
  onMount(() => {
    console.log("hello");
  });
  return (
    <>
      <h1>Awesome Site</h1>
      <Link class="nav" href="/">
        Home
      </Link>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/compare" element={<Compare />} />
      </Routes>
    </>
  );
};

export default App;
