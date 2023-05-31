import React, { useEffect } from "react";
import styles from "./Record.module.css";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  workoutState,
  durationState,
  bestSetState,
  workoutCntState,
  nowWorkingState,
} from "../../states";
import { checkByteLength } from "src/utils";

const Record = () => {
  const [workouts, setWorkouts] = useRecoilState(workoutState);
  const durationTime = useRecoilValue(durationState);
  const bestSets = useRecoilValue(bestSetState);
  const setNowWorking = useSetRecoilState(nowWorkingState);
  const workoutCnt = useRecoilValue(workoutCntState);
  const navigate = useNavigate();
  console.log(workoutCnt);
  useEffect(() => {
    window.scrollTo(0, 0);

    return () => {
      setWorkouts([]);
    };
  }, []);

  const completeWorkout = async () => {
    setNowWorking({ nowWorking: false });
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
                    <li key={keyIdex}>{`${
                      checkByteLength(el?.name, 0, 26) !== 2000
                        ? `${el?.name.substring(0, 13)}...`
                        : el?.name
                    } : ${
                      String(el.kg).length >= 5
                        ? `${String(el.kg).substring(0, 5)}...`
                        : el.kg || 0
                    } kg x ${
                      String(el.reps).length >= 5
                        ? `${String(el.reps).substring(0, 5)}...`
                        : el.reps || 0
                    } reps`}</li>
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
                <h3 className={styles.workoutName}>{workout[0]?.name}</h3>
                <section id={styles.workoutList}>
                  {workout.map((el, key) => {
                    return (
                      <div className={styles.record} key={key}>{`set ${
                        key + 1
                      } : ${
                        el.kg === null
                          ? 0
                          : String(el.kg).length >= 5
                          ? `${String(el.kg).substring(0, 5)}...`
                          : el.kg || 0
                      } kg x ${
                        el.reps === null
                          ? 0
                          : String(el.reps).length >= 5
                          ? `${String(el.reps).substring(0, 5)}...`
                          : el.reps || 0
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
