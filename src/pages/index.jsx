import SearchBox from "../components/SearchBox/SearchBox";
import MainLogo from "..//components/MainLogo/MainLogo";
import StockCard from "../components/StockCard/StockCard";
import styles from "../styles/Home.module.scss";
import { onMount } from "solid-js";
import state from "../components/StateProvider";
import { useNavigate } from "solid-app-router";

const Home = () => {
  const navigate = useNavigate();
  const {
    stock1,
    stock2,
    symbInit1,
    calibrate1,
    calibrate2,
    correlationFactor,
  } = state;

  onMount(async () => {
    if (!stock1() && localStorage.getItem("storedstock1")) {
      await calibrate1(JSON.parse(localStorage.getItem("storedstock1")));
      // navigate("/compare", { replace: false });
    }
  });

  return (
    <>
      <div className={styles.gridwrapper}>
        <MainLogo className={styles.mainlogo} />
        <SearchBox description className={styles.searchBox} />
        <Show when={stock1()}>
          <StockCard
            outlined
            symbol={stock1()?.Item?.ticker}
            style="margin-top: 1rem; max-width: 15rem;"
            className={styles.stockcard}
          />
        </Show>
      </div>
      <div className={styles.attribution}>
        <p>
          Made by: &nbsp; <a href="ericoulster.com">Eric Oulster</a>, &nbsp;
          <a href="kylefontenot.com">Kyle Fontenot</a>,&nbsp;
          <a href="#">Emma Xie</a>,&nbsp;&&nbsp;
          <a href="#">Pierre-Oliver Boisvert</a>
        </p>
      </div>
    </>
  );
};

export default Home;
