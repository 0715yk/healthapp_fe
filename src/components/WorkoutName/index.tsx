import styles from "./WorkoutName.module.css";
import { KeyboardEvent, useEffect, useState, useCallback } from "react";
import _ from "lodash";
import Modal from "../Modal/Modal";
import { customAxios } from "src/utils/axios";
import { loadingState, recordWorkoutState } from "src/states";
import { useRecoilState, useSetRecoilState } from "recoil";
import { WorkoutNameType } from "src/states/types";

interface Props {
  el: WorkoutNameType;
  fixMode: boolean;
  idx: number;
  workoutNameIdx: number;
  datesId: number;
}

const WorkoutName = ({ el, fixMode, idx, workoutNameIdx, datesId }: Props) => {
  const setLoadingSpinner = useSetRecoilState(loadingState);
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
      setLoadingSpinner({ isLoading: true });
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
        setLoadingSpinner({ isLoading: false });
        setRecordWorkout(copyWorkout);
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
      setLoadingSpinner({ isLoading: true });
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
        setLoadingSpinner({ isLoading: false });
        setRecordWorkout(copyWorkout);
        setWorkoutUpdateOn(false);
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
    setRecordWorkout,
    workoutNameIdx,
    idx,
    recordWorkout,
  ]);

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

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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
    <div className={styles.workoutNameUpdatePart}>
      <span className={styles.workoutNamePart}>{el?.workoutName}</span>
      <i
        className="far fa-edit"
        id={styles.updateBtn}
        onClick={() => {
          setWorkoutUpdateOn((prev) => !prev);
        }}
      ></i>
    </div>
  );
  const workoutNameComponent = fixMode ? (
    <div className={styles.workoutName}>{updateModeComponent}</div>
  ) : (
    <div className={styles.nonFixModeWorkoutName}>{el?.workoutName}</div>
  );
  return workoutNameComponent;
};

export default WorkoutName;
