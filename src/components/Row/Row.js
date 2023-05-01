import React, { useRef, useState } from "react";
import styles from "./Row.module.css";
import { useRecoilState } from "recoil";
import { workoutState } from "../../states";
import Modal from "../Modal/Modal";

const Row = ({ idx, el, workoutList }) => {
  const [workouts, setWorkouts] = useRecoilState(workoutState);
  const [modalOn, setModalOn] = useState(false);
  const kgRef = useRef();
  const repsRef = useRef();

  const clearRow = (set) => {
    const copyArr = [...workouts];
    let copyWorkoutList = [...workoutList];
    let prevKg, prevReps;
    if (el.done) {
      copyWorkoutList = copyWorkoutList.map((el) => {
        const copyEl = Object.assign({}, el);
        if (copyEl.set === set) {
          prevKg = copyEl.kg;
          prevReps = copyEl.reps;
          copyEl.done = false;
          return copyEl;
        } else return copyEl;
      });

      copyArr[idx] = copyWorkoutList;
      setWorkouts(copyArr);

      setTimeout(() => {
        repsRef.current.value = prevReps;
        kgRef.current.value = prevKg;
      }, []);
    } else {
      if (
        repsRef.current.value.replace(/ /g, "") === "" ||
        parseInt(repsRef.current.value) <= 0
      ) {
        setModalOn((prev) => !prev);
        return;
      }

      copyWorkoutList = copyWorkoutList.map((el) => {
        const copyEl = Object.assign({}, el);
        if (copyEl.set === set) {
          copyEl.kg = kgRef.current.value === "" ? 0 : kgRef.current.value;
          copyEl.reps = repsRef.current.value;
          copyEl.done = true;
          return copyEl;
        } else return copyEl;
      });

      copyArr[idx] = copyWorkoutList;

      setWorkouts(copyArr);
    }
  };

  const deleteRow = (name, set) => {
    const copyArr = [...workouts];
    var setCnt = 1;
    let copyWorkoutList = [...workoutList];
    if (set === 1 && copyWorkoutList.length === 1) {
      copyWorkoutList[0] = {
        name,
        set: 1,
        kg: null,
        reps: null,
        done: false,
      };
    } else {
      copyWorkoutList = copyWorkoutList
        .filter((el) => {
          if (el.set === set) {
            return false;
          } else return true;
        })
        .map((el) => {
          const copyEl = Object.assign({}, el);
          copyEl.set = setCnt;
          setCnt++;
          return copyEl;
        });
    }
    copyArr[idx] = copyWorkoutList;

    setWorkouts(copyArr);
  };

  const closeModal = () => {
    setModalOn((prev) => !prev);
  };

  return (
    <div className={styles.rowInput}>
      <Modal
        modalOn={{ on: modalOn, message: "최소 한 번의 reps를 채워주세요" }}
        closeModal={closeModal}
      />
      <div>{`set ${el.set}`}</div>
      <div id={styles.kgInput}>
        kg : {el.done ? el.kg : <input ref={kgRef} type="number" />}
      </div>
      <div id={styles.repsInput}>
        reps : {el.done ? el.reps : <input ref={repsRef} type="number" />}
      </div>
      <button
        onClick={() => {
          clearRow(el.set);
        }}
      >
        {el.done ? "fix" : "clear"}
      </button>
      {el.done ? (
        <span
          id={styles.xBtn}
          onClick={() => {
            deleteRow(el.name, el.set);
          }}
        >
          X
        </span>
      ) : null}
    </div>
  );
};

export default Row;
