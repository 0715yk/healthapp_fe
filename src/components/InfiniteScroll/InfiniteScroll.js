import React, { useEffect, useRef, useState } from "react";
import styles from "./InfiniteScroll.module.css";

const InfiniteScroll = () => {
  const scrollRef = useRef();
  const [inform, setInform] = useState("");

  useEffect(() => {
    document.addEventListener("scroll", () => {
      //   setInform(JSON.stringify(scrollRef.current.getBoundingClientRect()));
    });
  }, []);
  return (
    <div className={styles.infiniteScroll} ref={scrollRef}>
      information : {inform}
    </div>
  );
};

export default InfiniteScroll;
