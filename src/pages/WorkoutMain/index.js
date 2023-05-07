import { useEffect, useState } from "react";
import styles from "./WorkoutMain.module.css";
import moment from "moment";
import {
  timeState,
  dateWorkoutState,
  recordWorkoutState,
  loadingState,
  nowWorkingState,
} from "../../states";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import useCheckToken from "src/hooks/useCheckToken";
import { customAxios } from "src/utils/axios";
import Modal from "src/components/Modal/Modal";
import LatestWorkout from "src/components/LatestWorkout";
import GlowHeader from "src/components/GlowHeader/GlowHeader";

const WorkoutMain = () => {
  const setLoadingSpinner = useSetRecoilState(loadingState);
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const dateWorkout = useRecoilValue(dateWorkoutState);
  const setRecordWorkout = useSetRecoilState(recordWorkoutState);
  const [time, setTime] = useRecoilState(timeState);
  const setNowWorking = useSetRecoilState(nowWorkingState);
  const [modalOn, setModalOn] = useState({ on: false, message: "" });

  const startWorkOut = () => {
    setNowWorking({ nowWorking: true });
    setTime({ ...time, startTime: moment() });
    navigate("/main/workout");
  };

  useCheckToken();

  useEffect(() => {
    setSelectedDate(null);
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

  return (
    <div className={styles.mainPage}>
      <Modal modalOn={modalOn} closeModal={closeModal} />
      <GlowHeader
        title={"Start Workout"}
        style={{
          fontSize: "13vw",
          textAlign: "left",
          marginLeft: "15px",
          paddingTop: "40px",
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
          <LatestWorkout dateWorkout={dateWorkout} />
        </article>
      </main>
    </div>
  );
};

export default WorkoutMain;
