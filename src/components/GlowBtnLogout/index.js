import React from "react";
import styles from "./GlowBtnLogout.module.css";

const GlowBtnLogout = ({ props }) => {
  return (
    <button
      className={styles.glowBtn}
      onClick={props.func}
      style={props.style}
    ></button>
  );
};

export default GlowBtnLogout;
