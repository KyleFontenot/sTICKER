import styles from "./MainLogo.module.scss";
import { Link } from "solid-app-router";
const MainLogo = ({}) => (
  <Link href="/" className={styles.linkwrapper}>
    <h1 className={styles.logotitle}>sTICKER</h1>
  </Link>
);

export default MainLogo;
