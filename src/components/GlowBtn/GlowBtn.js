import React from "react";
import styles from "./GlowBtn.module.css";

const GlowBtn = ({ props }) => {
  return (
    <button
      className={styles.glowBtn}
      onClick={props.func}
      style={props.style}
    ></button>
  );
};

export default GlowBtn;
