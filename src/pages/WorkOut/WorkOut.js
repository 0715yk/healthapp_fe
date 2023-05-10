import { useState, useRef, useCallback } from "react";
import styles from "./WorkOut.module.css";
import TimeLapse from "../../components/TimeLapse/TimeLapse";
import WorkOutList from "../../components/WorkOutList/WorkOutList";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { nowWorkingState, workoutState } from "../../states";
import Modal from "../../components/Modal/Modal";

const WorkOut = ({ user }) => {
  const setNowWorking = useSetRecoilState(nowWorkingState);
  const [btnOption, setBtnOption] = useState(false);
  const [workouts, setWorkouts] = useRecoilState(workoutState);
  const [modalOn, setModalOn] = useState({ on: false, message: "" });
  const [workout, setWorkout] = useState("");
  const selectRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const workoutNames = [
    "pull up",
    "lat pulldown",
    "deadlift",
    "seated row",
    "back extension",
    "push up",
    "bench press",
    "incline press",
    "decline press",
    "dumbbell chest press",
    "dips",
    "squat",
    "leg extension",
    "leg curl",
    "lunge",
    "dumbbell curl",
    "shoulder press",
    "military press",
    "Side Lateral Raise",
    "front Raise",
  ];

  const getNormalInput = (e) => {
    setWorkout(e.target.value);
    selectRef.current.value = null;
    if (e.keyCode === 13) {
      registerWorkout();
    }
  };

  const getSelectInput = (e) => {
    const workout = e.target.value;
    setWorkout(workout);
    inputRef.current.value = null;
  };

  const registerWorkout = () => {
    const copyArr = workouts.slice();
    const flag = copyArr.find((el) => {
      return el[0].name === workout;
    });
    if (workout.replace(/ /g, "") === "") {
      setModalOn((prev) => ({
        on: !prev.on,
        message: "운동 종류를 선택해주세요",
      }));

      return;
    } else if (flag) {
      setModalOn((prev) => ({
        on: !prev.on,
        message: "이미 선택한 운동입니다.",
      }));
      return;
    } else if (workout === "choose basic workout") {
      setModalOn((prev) => ({
        on: !prev.on,
        message: "운동 종류를 선택해주세요",
      }));
      return;
    }

    copyArr.push([
      {
        name: workout,
        set: 1,
        kg: null,
        reps: null,
        bestSet: false,
        done: false,
      },
    ]);

    setWorkouts(copyArr);

    setWorkout("");
    inputRef.current.value = null;
    selectRef.current.value = "choose basic workout";
  };

  const cancelBtn = () => {
    setBtnOption(true);
    setModalOn({ on: true, message: "정말 포기하시겠습니까?" });
  };

  const closeModal = useCallback(() => {
    if (btnOption) {
      setNowWorking({ nowWorking: false });
      setBtnOption(false);
      setModalOn({ on: false, message: "" });
      setWorkouts([]);
      navigate("/main");
    } else {
      setModalOn((prev) => ({ on: !prev.on, message: prev.message }));
    }
  }, [setNowWorking, btnOption, setModalOn, navigate, setWorkouts]);

  const cancelModal = () => {
    setModalOn({ on: false, message: "" });
  };

  return (
    <div className={styles.workoutPage}>
      <Modal
        cancelModal={cancelModal}
        cancelModalOn={btnOption}
        modalOn={modalOn}
        closeModal={closeModal}
      />
      <main>
        <article className={styles.stickyNav}>
          <TimeLapse />
          <article className={styles.registerArea}>
            <div className={styles.inputArea}>
              <input
                placeholder="direct input"
                onKeyDown={getNormalInput}
                ref={inputRef}
                className={styles.directInput}
                onChange={getNormalInput}
              />
              <select
                ref={selectRef}
                className={styles.indirectInput}
                onChange={getSelectInput}
                defaultValue="choose basic workout"
              >
                <option style={{ color: "black" }} disabled>
                  choose basic workout
                </option>
                {workoutNames.map((name, key) => (
                  <option key={key}>{name}</option>
                ))}
              </select>
            </div>
            <div className={styles.emptyArea}></div>
            <button className={styles.btnArea} onClick={registerWorkout}>
              +
            </button>
          </article>
          <button id={styles.cancelBtn} onClick={cancelBtn}>
            Cancel Workout
          </button>
        </article>
        <WorkOutList user={user} />
      </main>
    </div>
  );
};

export default WorkOut;
