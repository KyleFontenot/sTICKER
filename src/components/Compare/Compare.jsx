import styles from "./Compare.module.scss";
import MainLogo from "../MainLogo/MainLogo";

import SearchBox from "../SearchBox/SearchBox";
const Compare = (props) => (
  <>
    <MainLogo full />
    <div className={styles.wrapper}>
      <div className={styles.graphDiv}>
        <h2>Apple Inc.</h2>
        <h3>$134.45</h3>
      </div>
      <div className={styles.searchDiv}>
        <SearchBox />
      </div>
      <div className={styles.correlationsDiv}>
        <h3>Correlation Matchups with AAPL</h3>
        <br />
        <div>
          <p style={{}}>hello</p>
        </div>
        <div>
          <p>hello</p>
        </div>
        <div>
          <p style={{}}>hello</p>
        </div>
      </div>
    </div>
  </>
);

export default Compare;
