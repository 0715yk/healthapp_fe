import React from "react";
import styles from "./GlowHeader.module.css";

const GlowHeader = ({ title, style }) => {
  return (
    <header id={styles.header} style={style}>
      {title}
    </header>
  );
};

export default GlowHeader;
