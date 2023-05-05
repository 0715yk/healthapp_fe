import React, { useEffect, useState } from "react";
import styles from "./Main.module.css";
import GlowHeader from "../../components/GlowHeader/GlowHeader";
import moment from "moment";
import LatestWorkout from "../../components/LatestWorkout";
import {
  timeState,
  dateWorkoutState,
  recordWorkoutState,
  loadingState,
  nowWorkingOrFinishState,
} from "../../states";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import _ from "lodash";
import GlowBtnLogout from "../../components/GlowBtnLogout";
import { Route, Routes, useNavigate } from "react-router-dom";
import Record from "../Record";
import WorkOut from "../WorkOut/WorkOut";
import WorkoutModal from "../../components/WorkoutModal";
import useCheckToken from "src/hooks/useCheckToken";
import { customAxios } from "src/utils/axios";
import Modal from "src/components/Modal/Modal";

const Main = ({ user }) => {
  const setLoadingSpinner = useSetRecoilState(loadingState);
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const dateWorkout = useRecoilValue(dateWorkoutState);
  const setRecordWorkout = useSetRecoilState(recordWorkoutState);
  const [nowWorking, setNowWorking] = useRecoilState(nowWorkingOrFinishState);
  const [time, setTime] = useRecoilState(timeState);

  const [modalOn, setModalOn] = useState({ on: false, message: "" });
  const startWorkOut = () => {
    setTime({ ...time, startTime: moment() });
    setNowWorking({
      nowWorking: true,
    });
    navigate("/main/workout");
  };

  useCheckToken();

  useEffect(() => {
    if (nowWorking.nowWorking) {
      navigate("/main/workout");
    } else {
      setSelectedDate(null);
    }
  }, []);

  const getWorkoutData = async (selectedDate) => {
    // 특정 날짜 값을 받고, 쿼리로 조회
    const date = moment(selectedDate).format("YYYYMMDD");
    if (date === "") return;

    // 조회한 뒤에는 날짜와 id 값을 통해 데이터를 조회(운동 기록)
    try {
      setLoadingSpinner({ isLoading: true });
      const response = await customAxios.get(`/workout/${date}`);
      setLoadingSpinner({ isLoading: false });
      setRecordWorkout(response?.data);
      navigate(`/main/records?date=${date}`);
    } catch {
      setLoadingSpinner({ isLoading: false });
      setModalOn({
        on: true,
        message: "서버 에러 입니다. 잠시후 다시 시도해주세요.",
      });
    }
  };

  const DatepickerInput = ({ ...props }) => (
    <input type="text" {...props} readOnly />
  );

  const closeModal = () => {
    setModalOn({ on: false, message: "" });
  };

  const Main = () => {
    return (
      <div className={styles.mainPage}>
        <Modal modalOn={modalOn} closeModal={closeModal} />
        <GlowBtnLogout
          props={{
            func: () => navigate("/"),
          }}
        />
        <GlowHeader
          title={"Start Workout"}
          style={{
            fontSize: "13vw",
            textAlign: "left",
            marginLeft: "15px",
          }}
        />
        <main>
          <article>
            <h2>Quick Start</h2>
            <button className={styles.strtBtn} onClick={startWorkOut}>
              Start an Empty Workout
            </button>
          </article>
          <article>
            <h2>Check Records</h2>
            <DatePicker
              className={styles.dateInput}
              onChange={getWorkoutData}
              maxDate={new Date()}
              selected={selectedDate}
              placeholderText={"Please select a date"}
              onChangeRaw={(e) => e.preventDefault()}
              withPortal
              customInput={<DatepickerInput />}
            />
          </article>
          <article>
            <LatestWorkout user={user} dateWorkout={dateWorkout} />
          </article>
        </main>
      </div>
    );
  };
  return (
    <Routes>
      <Route path="" element={<Main />} />
      <Route path="record" element={<Record />} />
      <Route path="records" element={<WorkoutModal />} />
      <Route path="workout" element={<WorkOut />} />
    </Routes>
  );
};

export default Main;
