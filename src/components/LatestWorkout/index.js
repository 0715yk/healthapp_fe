import { useEffect, useState, useRef } from "react";
import styles from "./LatestWorkout.module.css";
import { customAxios } from "src/utils/axios";
import { useSetRecoilState } from "recoil";
import { loadingState } from "src/states";
import { checkByteLength } from "src/utils";

const LatestWorkout = () => {
  const [workouts, setWorkouts] = useState([]);
  const [date, setDate] = useState("");

  const setLoadingSpinner = useSetRecoilState(loadingState);
  const getLatest = async () => {
    setLoadingSpinner({ isLoading: true });
    try {
      const response = await customAxios.get("/workout/latest");
      const workoutNames = response.data[0].workoutNames;
      setWorkouts(workoutNames);
      const latestDate = response.data.latestDate;

      setDate(
        `${latestDate.substring(0, 4)}/${latestDate.substring(
          4,
          6
        )}/${latestDate.substring(6)}`
      );
      setLoadingSpinner({ isLoading: false });
    } catch (err) {
      console.log(err);
      setLoadingSpinner({ isLoading: false });
    }
  };

  useEffect(() => {
    void getLatest();
    const rect = divRef.current.getBoundingClientRect();
    setRectHeight(rect.y);
  }, []);

  const [rectHeight, setRectHeight] = useState(0);
  const divRef = useRef(null);

  return (
    <div className={styles.latestWorkout}>
      <h2 className={styles.title}>Latest Workout</h2>
      <div className={styles.date}>{`Latest Workout Date : ${date}`}</div>
      <div
        className={styles.scorePart}
        ref={divRef}
        style={{
          height: `calc(100vh - ${80 + rectHeight}px)`,
        }}
      >
        {workouts.length !== 0
          ? workouts.map((workout) => {
              return (
                <section className={styles.workoutPart}>
                  <h3 style={{ color: "white" }} className={styles.workoutName}>
                    {workout?.workoutName}
                  </h3>
                  <ul id={styles.workoutList}>
                    {workout?.workouts?.map((el, key) => {
                      return (
                        <li
                          className={styles.record}
                          key={el.set}
                          style={{ color: el.bestSet ? "yellow" : null }}
                        >{`set ${key + 1} : ${
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
                        } reps ${el.bestSet ? "🏅" : ""}`}</li>
                      );
                    })}
                  </ul>
                </section>
              );
            })
          : "최신 기록이 없습니다"}
      </div>
    </div>
  );
};

export default LatestWorkout;
