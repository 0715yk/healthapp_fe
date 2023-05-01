import React from "react";
import styles from "./Records.module.css";
import { useNavigate } from "react-router-dom";

const Records = () => {
  const navigate = useNavigate();

  const back = () => {
    navigate("/main");
  };

  return (
    <div className={styles.recordPage}>
      <header>
        <h2>Records</h2>
      </header>
      <button className={styles.glowBtn} onClick={back}></button>
      <main></main>
    </div>
  );
};

export default Records;
