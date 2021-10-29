import SearchBox from "../SearchBox/SearchBox";
import MainLogo from "../MainLogo/MainLogo";
import styles from "../../styles/Home.module.scss";
const Home = () => {
  return (
    <div className={styles.gridwrapper}>
      <MainLogo />
      <SearchBox description />
    </div>
  );
};

export default Home;
