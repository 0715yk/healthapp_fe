import React from "react";
import styles from "./GlowHeader.module.css";

interface Props {
  title: string;
  style: React.CSSProperties;
}
const GlowHeader = ({ title, style }: Props) => {
  return (
    <header id={styles.header} style={style}>
      {title}
    </header>
  );
};

export default GlowHeader;
