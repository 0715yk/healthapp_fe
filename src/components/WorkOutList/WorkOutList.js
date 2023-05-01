import React, { useState } from "react";
import styles from "./WorkOutList.module.css";
import { useNavigate } from "react-router-dom";
import PureWorkOut from "../PureWorkOut/PureWorkOut";
import moment from "moment";
import Modal from "../Modal/Modal";
import { useRecoilState } from "recoil";
import { workoutState, timeState } from "../../states";
import { customAxios } from "src/utils/axios";
import _ from "lodash";

const WorkOutList = ({ user }) => {
  const [workouts, setWorkouts] = useRecoilState(workoutState);
  const [time, setTime] = useRecoilState(timeState);
  const [modalOn, setModalOn] = useState({ on: false, message: "" });

  const navigate = useNavigate();

  const finishWorkout = async () => {
    if (workouts.length === 0) {
      setModalOn({
        on: true,
        message: "하나 이상의 루틴을 실행해 주세요",
      });
      return;
    }
    setTime({ ...time, endTime: moment() });

    let copyArr = _.cloneDeep(workouts);
    var idx = 0;

    for (let arr of copyArr) {
      arr = arr.filter((el) => {
        if (el.kg === null || el.reps === null) return false;
        else return true;
      });
      copyArr[idx] = arr;
      idx++;
    }

    copyArr = copyArr.filter((el) => el.length !== 0);

    if (copyArr.length === 0) {
      setModalOn({
        on: true,
        message: "하나 이상의 루틴을 실행해 주세요",
      });
      return;
    }

    const bestSets = copyArr.map((workout) => {
      const copyArr = workout.slice();
      workout.sort((x, y) => {
        const prevScore =
          (parseInt(x.reps) === 0 ? 1 : parseInt(x.reps)) *
          (parseInt(x.kg) === 0 ? 1 : parseInt(x.kg));

        const nextScore =
          (parseInt(y.reps) === 0 ? 1 : parseInt(y.reps)) *
          (parseInt(y.kg) === 0 ? 1 : parseInt(y.kg));

        if (nextScore === prevScore) {
          return parseInt(y.kg) - parseInt(x.kg);
        } else return nextScore - prevScore;
      });

      const setNum = workout[0].set - 1;
      copyArr[setNum].bestSet = true;
      return copyArr;
    });

    const date = moment().format("YYYYMMDD");

    try {
      await customAxios.post("/workout", {
        date: date,
        workouts: bestSets,
      });
      setWorkouts(copyArr);
      navigate("/main/record");
    } catch {
      setModalOn({
        on: true,
        message: "서버 에러 입니다. 잠시후 다시 시도해주세요.",
      });
    }
  };

  const closeModal = () => {
    setModalOn({
      on: false,
      message: "",
    });
  };

  return (
    <div className={styles.writeFunc}>
      <Modal modalOn={modalOn} closeModal={closeModal} />
      <main>
        <section>
          {workouts.map((workout, idx) => {
            return <PureWorkOut key={idx} workoutList={workout} idx={idx} />;
          })}
        </section>
        <section className={styles.doneBtnPart}>
          <button className={styles.glowBtn} onClick={finishWorkout}></button>
        </section>
      </main>
    </div>
  );
};

export default WorkOutList;
