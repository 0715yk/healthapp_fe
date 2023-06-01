import { useEffect, useState } from "react";
import styles from "./TimeLapse.module.css";
import { useRecoilValue } from "recoil";
import { timeState } from "../../states";
import moment from "moment";

const TimeLapse = () => {
  const [timeLapse, setTimeLapse] = useState("0 : 0 : 0");
  const time = useRecoilValue(timeState);

  useEffect(() => {
    let seconds = moment.duration(moment().diff(time.startTime)).asSeconds();
    let hour = (seconds / 3600).toFixed(0);
    let min = ((seconds % 3600) / 60).toFixed(0);
    let sec = (seconds % 60).toFixed(0);

    setTimeLapse(`${hour} : ${min} : ${sec}`);

    const timer = setInterval(() => {
      let seconds = moment.duration(moment().diff(time.startTime)).asSeconds();

      let hour = (seconds / 3600).toFixed(0);
      let min = ((seconds % 3600) / 60).toFixed(0);
      let sec = (seconds % 60).toFixed(0);

      setTimeLapse(`${hour} : ${min} : ${sec}`);
    });

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={styles.timeLapse}>
      <div className={styles.timeText}>{`TimeLapse : ${timeLapse}`}</div>
    </div>
  );
};

export default TimeLapse;
