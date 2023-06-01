import styles from "./WorkoutData.module.css";
import React, { useState, useCallback } from "react";
import Modal from "../Modal/Modal";
import { useRecoilState, useSetRecoilState } from "recoil";
import { loadingState, recordWorkoutState } from "../../states";
import WorkoutName from "../WorkoutName";
import WorkoutSet from "../WorkoutSet";
import _ from "lodash";
import { customAxios } from "src/utils/axios";
import { DailyRecordWorkout } from "src/states/types";

interface Props {
  fixMode: boolean;
  idx: number;
  workout: DailyRecordWorkout;
  setFixModeFunc: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
const WorkoutData = ({ fixMode, workout, idx, setFixModeFunc }: Props) => {
  const [recordWorkout, setRecordWorkout] = useRecoilState(recordWorkoutState);
  const [modalOn, setModalOn] = useState({
    on: false,
    message: "정말 삭제하시겠습니까?",
  });

  const setLoadingSpinner = useSetRecoilState(loadingState);
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const date = urlParams.get("date");

  // workout 제거 함수
  const deleteWorkout = useCallback(async () => {
    // 삭제를 하려면 특정 날짜 값을 일단 보내야하고(query string에 있는걸 보내면 될듯)
    // api 요청 후에 성공하면 아래 로직 적용
    try {
      // apicall
      setLoadingSpinner({ isLoading: true });
      const response = await customAxios.delete(`/workout/workoutNum`, {
        data: { workoutNum: workout.id, datesId: workout.datesId },
      });
      if (response.status === 200) {
        let copyWorkout = _.cloneDeep(recordWorkout);

        copyWorkout = copyWorkout.filter((el, _) => {
          if (_ === idx) return false;
          else return true;
        });
        setLoadingSpinner({ isLoading: false });
        setRecordWorkout(copyWorkout);
      }
    } catch {
      setLoadingSpinner({ isLoading: false });
      setModalOn({
        on: true,
        message: "서버 에러 입니다. 잠시후 다시 시도해주세요.",
      });
    }
  }, [
    setLoadingSpinner,
    idx,
    recordWorkout,
    setRecordWorkout,
    workout.datesId,
    workout.id,
  ]);

  // set 제거 함수

  const closeModal = () => {
    deleteWorkout();
    setModalOn((prev) => {
      return { ...prev, on: false };
    });
  };

  const setModalOnFunc = () => {
    setModalOn((prev) => {
      return { ...prev, on: !prev.on };
    });
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <button className={styles.fixBtn} onClick={setFixModeFunc}>
        {fixMode ? "Done" : `Fix mode`}
      </button>
      <Modal
        modalOn={modalOn}
        closeModal={closeModal}
        cancelModal={setModalOnFunc}
        cancelModalOn={true}
      />
      <div style={{ color: "white", fontSize: "27px" }}>
        {`Workout Num : ${idx}`}
        {fixMode && (
          <i
            className="far fa-trash-alt"
            id={styles.deleteBtn}
            onClick={setModalOnFunc}
          ></i>
        )}
      </div>

      {workout?.workoutNames?.map((el, workoutNameIdx) => {
        return (
          <>
            <WorkoutName
              key={el.id}
              el={el}
              fixMode={fixMode}
              idx={idx}
              workoutNameIdx={workoutNameIdx}
              datesId={workout?.datesId}
            />
            <div style={{ marginTop: "20px" }}>
              {el?.workouts?.map((_, setIdx: number) => {
                return (
                  <WorkoutSet
                    key={_.id}
                    el={_}
                    setIdx={setIdx}
                    fixMode={fixMode}
                    idx={idx}
                    workoutNameIdx={workoutNameIdx}
                    datesId={workout?.datesId}
                    workoutNumId={el?.workoutNumId}
                  />
                );
              })}
            </div>
          </>
        );
      })}
    </div>
  );
};

export default WorkoutData;
