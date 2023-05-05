import { createPortal } from "react-dom";
import styles from "./LoadingSpinner.module.css";

const LoadingSpinner = () => {
  return (
    <div className={styles.spinner}>
      <div className={styles.spinnerFrame}>
        <div className={styles.text}>loading...</div>
        <div className={styles.progress}>
          <div className={styles.color}></div>
        </div>
      </div>
    </div>
  );
};

const rootDiv = document.getElementById("root");
createPortal(<LoadingSpinner />, rootDiv);

export default LoadingSpinner;
