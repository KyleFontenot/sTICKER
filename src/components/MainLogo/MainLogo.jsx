import styles from "./MainLogo.module.scss";
// import "./MainLogo.module.css";
import { Link } from "solid-app-router";
import { Show } from "solid-js";
import SearchBox from "../SearchBox/SearchBox";
const MainLogo = (props) => {
  return (
    <div classList={{ mainlogowrapper: props.full }}>
      <h1
        classList={{
          [styles.logotitle]: true,
          [styles.fulllayoutlogo]: props.full === true,
        }}
      >
        sTICKER
      </h1>
      {props.full ? (
        <SearchBox
          style={{
            position: "absolute",
            top: "1.5rem",
            left: "calc(50% - 9rem)",
          }}
        />
      ) : null}
    </div>
  );
};

export default MainLogo;
