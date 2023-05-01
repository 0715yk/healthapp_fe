import React, { useState, useRef } from "react";
import styles from "./PureWorkOut.module.css";
import Row from "../Row/Row";
import { useRecoilState } from "recoil";
import { workoutState } from "../../states";
import Modal from "../Modal/Modal";

const PureWorkOut = ({
  workout,
  idx,
  checkList,
  setCheckList,
  workoutList,
}) => {
  const [workouts, setWorkouts] = useRecoilState(workoutState);
  const [fixMode, setFixMode] = useState(false);
  const [modalOn, setModalOn] = useState({ on: false, message: "" });
  const titleRef = useRef();

  const addSet = () => {
    const copyArr = workouts.slice();
    const copyWorkoutList = workoutList.slice();
    if (
      copyWorkoutList[copyWorkoutList.length - 1].kg === null &&
      copyWorkoutList[copyWorkoutList.length - 1].reps === null
    ) {
      setModalOn((prev) => ({
        on: !prev.on,
        message: "이전 세트를 완료해주세요",
      }));
      return;
    }

    copyWorkoutList.push({
      name: copyWorkoutList[copyWorkoutList.length - 1].name,
      set: copyWorkoutList[copyWorkoutList.length - 1].set + 1,
      kg: null,
      reps: null,
      bestSet: false,
      done: false,
    });
    copyArr[idx] = copyWorkoutList;
    setWorkouts(copyArr);
  };

  const fixTitle = () => {
    const copyWorkoutList = workoutList.slice();

    if (fixMode) {
      const copyArr = workouts.slice();

      if (titleRef.current.value.replace(/ /g, "") === "") {
        setModalOn((prev) => ({
          on: !prev.on,
          message: "최소한 한글자 이상을 입력해주세요",
        }));
        return;
      }

      setFixMode(false);

      copyArr[idx] = [
        ...copyWorkoutList.map((el) => {
          const copyEl = Object.assign({}, el);
          copyEl.name = titleRef.current.value;
          return copyEl;
        }),
      ];
      setWorkouts(copyArr);
    } else {
      setFixMode(true);
      setTimeout(() => {
        titleRef.current.value =
          copyWorkoutList[copyWorkoutList.length - 1].name;
        titleRef.current.focus();
      });
    }
  };

  const deleteWorkout = () => {
    let copyArr = workouts.slice();
    copyArr = copyArr.filter((el, _) => {
      if (idx === _) return false;
      else return true;
    });
    setWorkouts(copyArr);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") fixTitle();
  };

  const closeModal = () => {
    setModalOn((prev) => ({ on: !prev.on, message: prev.message }));
  };

  return (
    <>
      <Modal modalOn={modalOn} closeModal={closeModal} />
      <div className={styles.title}>
        {fixMode ? (
          <input ref={titleRef} onKeyDown={handleKeyDown} />
        ) : (
          workouts[idx] && workouts[idx][0]?.name
        )}
        <i class="far fa-edit" id={styles.fixBtn} onClick={fixTitle}></i>
        <i
          class="far fa-trash-alt"
          id={styles.deleteBtn}
          onClick={deleteWorkout}
        ></i>
      </div>
      <div className={styles.rows} key={idx}>
        {workoutList.map((el) => {
          return (
            <Row
              workoutList={workoutList}
              idx={idx}
              el={el}
              workout={workout}
              checkList={checkList}
              setCheckList={setCheckList}
            />
          );
        })}
        <button id={styles.addBtn} onClick={addSet}>
          +
        </button>
      </div>
    </>
  );
};

export default PureWorkOut;
