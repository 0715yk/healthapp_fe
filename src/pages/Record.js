import React, { useEffect } from "react";
import styles from "./Record.module.css";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  workoutState,
  durationState,
  bestSetState,
  workoutCntState,
} from "../states";

const Record = () => {
  const [workouts, setWorkouts] = useRecoilState(workoutState);
  const durationTime = useRecoilValue(durationState);
  const bestSets = useRecoilValue(bestSetState);

  const workoutCnt = useRecoilValue(workoutCntState);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    return () => {
      setWorkouts([]);
    };
  }, []);

  const completeWorkout = async () => {
    setWorkouts([]);
    navigate("/main");
  };

  return (
    <div className={styles.recordPage}>
      <button className={styles.glowBtn} onClick={completeWorkout}></button>
      <header className={styles.recordHeader}>
        <h2>Records</h2>
      </header>
      <main>
        <article id={styles.totalRecordPart}>
          <h3 style={{ color: "gold" }}>Total ⏱</h3>
          <ul>
            <li>{moment().format("YYYY-MM-D (dddd)")}</li>
            <li className={styles.timeLapsePart}>
              {`${durationTime.startTime} ~ ${durationTime.endTime} [${durationTime.hour}hr ${durationTime.min}min ${durationTime.sec}sec]`}
            </li>
            <li>{`Total workout count : ${workoutCnt}`}</li>
            <li>
              <h3 id={styles.bestSetH} style={{ color: "gold" }}>
                Best set 🏅
              </h3>
              <ul list-style="none">
                {bestSets.map((el, keyIdex) => {
                  return (
                    <li
                      key={keyIdex}
                    >{`${el.name} : ${el.kg} kg x ${el.reps} reps`}</li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </article>
        <article id={styles.tablePart}>
          <h3 id={styles.workoutsPart} style={{ color: "gold" }}>
            Workouts ⭐
          </h3>
          {workouts.map((workout, keyIdx) => {
            return (
              <section key={keyIdx}>
                <h3>{workout[0].name}</h3>
                <section id={styles.workoutList}>
                  {workout.map((el, key) => {
                    return (
                      <div className={styles.record} key={key}>{`set ${
                        key + 1
                      } : ${el.kg === null ? 0 : el.kg} kg x ${
                        el.reps === null ? 0 : el.reps
                      } reps`}</div>
                    );
                  })}
                </section>
              </section>
            );
          })}
        </article>
      </main>
    </div>
  );
};

export default Record;
