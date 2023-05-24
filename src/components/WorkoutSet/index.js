import styles from "./WorkoutSet.module.css";
import React, { useEffect, useState, useCallback } from "react";
import _ from "lodash";
import Modal from "../Modal/Modal";
import { customAxios } from "src/utils/axios";
import { useRecoilState, useSetRecoilState } from "recoil";
import { loadingState, recordWorkoutState } from "src/states";

const WorkoutSet = ({
  el,
  fixMode,
  datesId,
  workoutNumId,
  workoutNameIdx,
  idx,
  setIdx,
}) => {
  const setLoadingSpinner = useSetRecoilState(loadingState);
  const [recordWorkout, setRecordWorkout] = useRecoilState(recordWorkoutState);
  const [setUpdateOn, setSetUpdateOn] = useState(false);
  const [modalOn, setModalOn] = useState({
    on: false,
    message: "정말 삭제하시겠습니까?",
  });
  const [alertOn, setAlertOn] = useState({
    on: false,
    message: "최소 한 개 이상의 reps를 기입해주세요.",
  });

  const [inputValue, setInputValue] = useState({
    kg: "",
    reps: "",
  });

  useEffect(() => {
    setInputValue({
      kg: el.kg,
      reps: el.reps,
    });
  }, []);

  useEffect(() => {
    if (fixMode) {
      setInputValue({
        kg: el.kg,
        reps: el.reps,
      });
    }
  }, [fixMode, setInputValue, el]);

  useEffect(() => {
    if (fixMode === false) {
      setSetUpdateOn(false);
    }
  }, [fixMode]);

  const updateSet = useCallback(async () => {
    if (inputValue.reps <= 0) {
      setAlertOn({
        message: "최소 한 개 이상의 reps를 입력해야 합니다.",
        on: true,
      });
      return;
    } else if (el.kg === inputValue.kg && el.reps === inputValue.reps) {
      setSetUpdateOn(false);
      return;
    }

    const primaryKey = el.id;
    try {
      // apicall
      setLoadingSpinner({ isLoading: true });
      const response = await customAxios.patch(
        `/workout/workoutSet/${primaryKey}`,
        {
          ...inputValue,
        }
      );

      if (response.status === 200) {
        const copyWorkout = _.cloneDeep(recordWorkout);
        const workoutsObj = copyWorkout[idx].workoutNames[
          workoutNameIdx
        ].workouts.find((workout) => workout.set === el.set);
        workoutsObj.kg = inputValue.kg;
        workoutsObj.reps = inputValue.reps;
        setLoadingSpinner({ isLoading: false });
        setRecordWorkout(copyWorkout);
        setSetUpdateOn((prev) => !prev);
      }
    } catch (err) {
      console.log(err);
      setLoadingSpinner({ isLoading: false });
      setModalOn({
        on: true,
        message: "서버 에러 입니다. 잠시후 다시 시도해주세요.",
      });
    }
  }, [
    setLoadingSpinner,
    inputValue,
    el,
    idx,
    recordWorkout,
    setRecordWorkout,
    workoutNameIdx,
  ]);

  const deleteSet = async () => {
    const id = el.id;
    const workoutNameId = el.workoutNameId;
    try {
      setLoadingSpinner({ isLoading: true });
      const response = await customAxios.delete("workout/workout", {
        data: {
          id,
          workoutNumId,
          datesId,
          workoutNameId,
        },
      });

      if (response.status === 200) {
        let copyWorkout = _.cloneDeep(recordWorkout);

        copyWorkout[idx].workoutNames[workoutNameIdx].workouts = copyWorkout[
          idx
        ].workoutNames[workoutNameIdx].workouts.filter(
          (workout) => workout.set !== el.set
        );

        if (
          copyWorkout[idx].workoutNames[workoutNameIdx].workouts.length === 0
        ) {
          copyWorkout[idx].workoutNames = copyWorkout[idx].workoutNames.filter(
            (el) => el.id !== workoutNameId
          );

          if (copyWorkout[idx].workoutNames.length === 0) {
            copyWorkout = copyWorkout.filter((_, index) => idx !== index);
          }
        }
        setLoadingSpinner({ isLoading: false });
        setRecordWorkout(copyWorkout);
        setSetUpdateOn(false);
      }
    } catch (err) {
      console.log(err);
      setLoadingSpinner({ isLoading: false });
      setModalOn({
        on: true,
        message: "서버 에러 입니다. 잠시후 다시 시도해주세요.",
      });
    }
  };

  const setModalOnFunc = (e) => {
    setModalOn((prev) => {
      return { ...prev, on: !prev.on };
    });
  };

  const closeModal = () => {
    deleteSet();
    setModalOn((prev) => {
      return { ...prev, on: false };
    });
  };

  const closeAlert = () => {
    setAlertOn((prev) => ({
      ...prev,
      on: false,
    }));
  };

  const xBtnFunc = () => {
    setInputValue({
      kg: el.kg,
      reps: el.reps,
    });
    setSetUpdateOn((prev) => !prev);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") updateSet();
  };

  return (
    <div className={styles.record}>
      <Modal modalOn={alertOn} closeModal={closeAlert} />
      <Modal
        modalOn={modalOn}
        closeModal={closeModal}
        cancelModal={setModalOnFunc}
        cancelModalOn={true}
      />
      {fixMode ? (
        <>
          {setUpdateOn ? (
            <div className={styles.setUpdatePart}>
              <div>{`set ${setIdx} : `}&nbsp;</div>
              <input
                type="number"
                className={styles.setInput}
                value={inputValue?.kg}
                onKeyDown={handleKeyDown}
                onChange={(e) =>
                  setInputValue((prev) => ({ ...prev, kg: e.target.value }))
                }
              />
              &nbsp;
              <div>kg x &nbsp;</div>
              <input
                className={styles.setInput}
                value={inputValue?.reps}
                onKeyDown={handleKeyDown}
                type="number"
                onChange={(e) =>
                  setInputValue((prev) => ({ ...prev, reps: e.target.value }))
                }
              />
              &nbsp;
              <div>reps</div>
              <i
                className="far fa-edit"
                id={styles.fixBtn}
                onClick={updateSet}
              ></i>
              <i
                className="far fa-trash-alt"
                id={styles.deleteBtn}
                onClick={setModalOnFunc}
              ></i>
              <div id={styles.xBtn} onClick={xBtnFunc}>
                X
              </div>
            </div>
          ) : (
            <>
              {`set ${setIdx} : ${
                String(el.kg).length >= 5
                  ? `${String(el.kg).substring(0, 4)}...`
                  : el.kg || 0
              } kg x ${
                String(el.reps).length >= 5
                  ? `${String(el.reps).substring(0, 4)}...`
                  : el.reps || 0
              } reps`}
              <i
                className="far fa-edit"
                id={styles.fixBtn}
                onClick={() => {
                  setSetUpdateOn((prev) => !prev);
                }}
              ></i>
            </>
          )}
        </>
      ) : (
        `set ${setIdx} : ${
          el.kg === null
            ? 0
            : String(el.kg).length >= 5
            ? `${String(el.kg).substring(0, 5)}...`
            : el.kg
        } kg x ${
          el.reps === null
            ? 0
            : String(el.reps).length >= 5
            ? `${String(el.kg).substring(0, 5)}...`
            : el.reps
        } reps`
      )}
    </div>
  );
};

export default WorkoutSet;
