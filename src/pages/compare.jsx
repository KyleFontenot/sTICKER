import styles from "../components/Compare/Compare.module.scss";
import MainLogo from "../components/MainLogo/MainLogo";
import StockCard from "../components/StockCard/StockCard";
import SearchBox from "../components/SearchBox/SearchBox";
import state from "../components/StateProvider";
const Compare = (props) => {
  const { stock1, stock2, symbInit1, calibrate1, calibrate2 } = state;
  return (
    <>
      <MainLogo full />
      <div className={styles.wrapper}>
        <div className={styles.graphDiv}>
          <div className={styles.mainInfo}>
            <h2>Apple Inc.</h2>
            <h3>$134.45</h3>
          </div>
          <table className={styles.mainStats}>
            <tbody>
              <tr>
                <th>52-week high</th>
                <th>52-week low</th>
                <th>volume</th>
                <th>dividends</th>
              </tr>
              <tr>
                <td>$250.34</td>
                <td>$120.34</td>
                <td>300.5k</td>
                <td>0.0034</td>
              </tr>
            </tbody>
          </table>
          <div
            style={{
              width: "100%",
              marginTop: "2rem",
            }}
          >
            <p>{symbInit1}</p>
            {/*<p>{JSON.stringify(stock1())}</p>*/}
            <br />
            <button
              style={{ position: "absolute", bottom: "0", left: "0" }}
              onClick={() => {
                calibrate1("fcre");
                console.log(typeof stock1());
              }}
            >
              Hit me!
            </button>
            <button
              style={{ position: "absolute", bottom: "0", left: "5rem" }}
              onClick={() => {
                calibrate1("aapl");
              }}
            >
              Hit me!
            </button>
          </div>
        </div>
        <div className={styles.searchDiv}>
          <h3>Compare:</h3>
          <SearchBox />
        </div>
        <div className={styles.correlationsDiv}>
          <h3>Correlation Matchups with AAPL</h3>
          <br />
          <p style={{ width: "100%", height: "auto", marginBottom: "30px" }}>
            Search for another stock to compute the correlation factor to the
            current stock
          </p>
          <br />
          <div>
            <h4>Highest Positive Correlations</h4>
            <StockCard symbol="aapl" outlined grey />
            <StockCard symbol="aapl" outlined grey />
            <StockCard symbol="aapl" outlined grey />
          </div>
          <div>
            <h4>Highest Negative Correlations</h4>
            <StockCard symbol="aapl" outlined grey />
            <StockCard symbol="aapl" outlined grey />
            <StockCard symbol="aapl" outlined grey />
          </div>
          <div>
            <h4>Insignificant Correlations</h4>
            <StockCard symbol="aapl" outlined grey />
            <StockCard symbol="aapl" outlined grey />
            <StockCard symbol="aapl" outlined grey />
          </div>
        </div>
      </div>
    </>
  );
};

export default Compare;
