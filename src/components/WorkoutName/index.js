import styles from "./WorkoutName.module.css";
import React, { useEffect, useState, useCallback } from "react";
import _ from "lodash";
import Modal from "../Modal/Modal";
import { customAxios } from "src/utils/axios";
import { recordWorkoutState } from "src/states";
import { useRecoilState } from "recoil";

const WorkoutName = ({ el, fixMode, idx, workoutNameIdx, date, datesId }) => {
  const [recordWorkout, setRecordWorkout] = useRecoilState(recordWorkoutState);
  const [workoutUpdateOn, setWorkoutUpdateOn] = useState(false);
  useEffect(() => {
    if (fixMode === false) {
      setWorkoutUpdateOn(false);
    }
  }, [fixMode]);
  const [inputValue, setInputValue] = useState(el?.workoutName);
  const [modalOn, setModalOn] = useState({
    on: false,
    message: "정말 삭제하시겠습니까?",
  });

  const [alertOn, setAlertOn] = useState({
    on: false,
    message: "한글자 이상의 단어로 작성해주세요.",
  });

  useEffect(() => {
    setInputValue(el?.workoutName);
    setWorkoutUpdateOn(false);
  }, [el]);

  // 운동 종목 제거 함수
  const deleteWorkoutName = async () => {
    const id = el.id;
    const workoutNumId = el.workoutNumId;

    try {
      const response = await customAxios.delete("workout/workoutName", {
        data: {
          id,
          workoutNumId,
          datesId,
        },
      });
      if (response.status === 200) {
        let copyWorkout = _.cloneDeep(recordWorkout);

        copyWorkout[idx].workoutNames = copyWorkout[idx].workoutNames.filter(
          (el) => el.id !== id
        );

        if (copyWorkout[idx].workoutNames.length === 0) {
          copyWorkout = copyWorkout.filter((_, index) => idx !== index);
        }

        setRecordWorkout(copyWorkout);
      }
    } catch (err) {
      console.log(err);
      setModalOn({
        on: true,
        message: "서버 에러 입니다. 잠시후 다시 시도해주세요.",
      });
    }
  };

  const updateWorkoutName = useCallback(async () => {
    const primaryKey = el.id;

    if (el.workoutName === inputValue) {
      setWorkoutUpdateOn(false);
      return;
    } else if (inputValue.replace(/ /g, "").length === 0) {
      setAlertOn(() => ({
        message: "최소 한 자 이상의 운동명을 입력해 주세요.",
        on: true,
      }));
      return;
    }

    try {
      // apicall
      const response = await customAxios.patch(
        `/workout/workoutName/${primaryKey}`,
        {
          workoutName: inputValue,
        }
      );
      if (response.status === 200) {
        const copyWorkout = _.cloneDeep(recordWorkout);
        const workoutNameObj = copyWorkout[idx].workoutNames[workoutNameIdx];
        workoutNameObj.workoutName = inputValue;

        setRecordWorkout(copyWorkout);
        setWorkoutUpdateOn(false);
      }

      // }
    } catch (err) {
      console.log(err);
    }
  }, [inputValue, el, setRecordWorkout, workoutNameIdx, idx, recordWorkout]);

  const closeModal = () => {
    deleteWorkoutName();
    setModalOn((prev) => {
      return { ...prev, on: false };
    });
  };

  const setModalOnFunc = () => {
    setModalOn((prev) => {
      return { ...prev, on: !prev.on };
    });
  };

  const xBtnFunc = () => {
    setInputValue(el?.workoutName);
    setWorkoutUpdateOn((prev) => !prev);
  };

  const alertModal = () => {
    setAlertOn((prev) => ({ ...prev, on: false }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") updateWorkoutName();
  };

  const updateModeComponent = workoutUpdateOn ? (
    <div className={styles.updatePart}>
      <Modal modalOn={alertOn} closeModal={alertModal} />
      <Modal
        modalOn={modalOn}
        closeModal={closeModal}
        cancelModal={setModalOnFunc}
        cancelModalOn={true}
      />
      <input
        className={styles.workoutNameInput}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        spellCheck={false}
        onKeyDown={handleKeyDown}
      />
      <i
        className="far fa-edit"
        id={styles.updateBtn}
        onClick={updateWorkoutName}
      ></i>
      <i
        className="far fa-trash-alt"
        id={styles.deleteBtn}
        onClick={setModalOnFunc}
      ></i>
      <div className={styles.xBtn} onClick={xBtnFunc}>
        X
      </div>
    </div>
  ) : (
    <>
      {el?.workoutName}
      <i
        class="far fa-edit"
        id={styles.updateBtn}
        onClick={() => {
          setWorkoutUpdateOn((prev) => !prev);
        }}
      ></i>
    </>
  );
  const workoutNameComponent = fixMode ? updateModeComponent : el?.workoutName;
  return <div className={styles.workoutName}>{workoutNameComponent}</div>;
};

export default React.memo(WorkoutName);
