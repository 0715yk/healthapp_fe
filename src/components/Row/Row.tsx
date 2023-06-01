import { useCallback, useRef, useState } from "react";
import styles from "./Row.module.css";
import { useRecoilState } from "recoil";
import { workoutState } from "../../states";
import Modal from "../Modal/Modal";
import { WorkoutRecord } from "src/states/types";

interface Props {
  idx: number;
  workoutList: WorkoutRecord[];
  el: WorkoutRecord;
}

const Row = ({ idx, el, workoutList }: Props) => {
  const [workouts, setWorkouts] = useRecoilState(workoutState);
  const [modalOn, setModalOn] = useState({ on: false, message: "" });
  const [btnOption, setBtnOption] = useState(false);
  const kgRef = useRef<HTMLInputElement | null>(null);
  const repsRef = useRef<HTMLInputElement | null>(null);

  const clearRow = (set: number) => {
    const copyArr = [...workouts];
    let copyWorkoutList = [...workoutList];
    let prevKg = "",
      prevReps = "";

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
        if (repsRef?.current && kgRef?.current) {
          repsRef.current.value = prevReps;
          kgRef.current.value = prevKg;
        }
      });
    } else {
      if (repsRef?.current) {
        if (
          repsRef.current.value.replace(/ /g, "") === "" ||
          parseInt(repsRef.current.value) <= 0
        ) {
          setModalOn({ on: true, message: "최소 한 번의 reps를 채워주세요" });

          return;
        }

        copyWorkoutList = copyWorkoutList.map((el) => {
          const copyEl = Object.assign({}, el);
          if (copyEl.set === set && kgRef?.current && repsRef?.current) {
            copyEl.kg = kgRef.current.value === "" ? "0" : kgRef.current.value;
            copyEl.reps = repsRef.current.value;
            copyEl.done = true;
            return copyEl;
          } else return copyEl;
        });
        copyArr[idx] = copyWorkoutList;
        setWorkouts(copyArr);
      }
    }
  };

  const deleteRow = useCallback(
    (name: string, set: number) => {
      const copyArr = [...workouts];
      var setCnt = 1;
      let copyWorkoutList = [...workoutList];
      if (set === 1 && copyWorkoutList.length === 1) {
        copyWorkoutList[0] = {
          name,
          set: 1,
          kg: "",
          reps: "",
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
    },
    [setWorkouts, idx, workoutList, workouts]
  );

  const closeModal = useCallback(() => {
    if (btnOption) {
      deleteRow(el.name, el.set);
      setBtnOption(false);
    }
    setModalOn({ on: false, message: "" });
  }, [setModalOn, btnOption, deleteRow, el.name, el.set]);

  const deleteRowFunc = useCallback(() => {
    setBtnOption(true);
    setModalOn({ on: true, message: "정말 삭제하시겠습니까?" });
  }, [setModalOn, setBtnOption]);

  const cancelModal = () => {
    setModalOn({ on: false, message: "" });
  };

  return (
    <div className={styles.rowInput}>
      <Modal
        cancelModalOn={btnOption}
        modalOn={modalOn}
        closeModal={closeModal}
        cancelModal={cancelModal}
      />
      <div>{`set ${el.set}`}</div>
      <div id={styles.kgInput}>
        kg :
        {el.done ? (
          String(el.kg).length >= 5 ? (
            `${String(el.kg).substring(0, 5)}...`
          ) : (
            el.kg
          )
        ) : (
          <input ref={kgRef} type="number" />
        )}
      </div>
      <div id={styles.repsInput}>
        reps :
        {el.done ? (
          String(el.reps).length >= 5 ? (
            `${String(el.reps).substring(0, 5)}...`
          ) : (
            el.reps
          )
        ) : (
          <input ref={repsRef} type="number" />
        )}
      </div>
      <button
        className={styles.clearRowBtn}
        onClick={() => {
          clearRow(el.set);
        }}
      >
        {el.done ? "fix" : "clear"}
      </button>
      {el.done ? (
        <span id={styles.xBtn} onClick={deleteRowFunc}>
          X
        </span>
      ) : null}
    </div>
  );
};

export default Row;
