import React, { useState, useRef } from "react";
import styles from "./Landing.module.css";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { startTimeState } from "../../states";
import { useRecoilState } from "recoil";

const Landing = ({ workouts, setWorkouts, color, setColor }) => {
  const [startTime, setStartTime] = useRecoilState(startTimeState);
  const navigate = useNavigate();
  const [workout, setWorkout] = useState("");
  const selectRef = useRef(null);
  const inputRef = useRef(null);
  const [colorPopup, setColorPopup] = useState(false);
  const colors = [
    "black",
    "teal",
    "goldenrod",
    "red",
    "orange",
    "darkturquoise",
    "peachpuff",
    "darkslategray",
    "dodgerblue",
    "midnightblue",
    "deeppink",
    "olivedrab",
    "gold",
    "coral",
    "limegreen",
    "mediumspringgreen",
  ];

  const getNormalInput = (e) => {
    setWorkout(e.target.value);
    selectRef.current.value = null;
    if (e.keyCode === 13) {
      registerWorkout();
    }
  };

  const getSelectInput = (e) => {
    const workout = e.target.value;
    setWorkout(workout);
    inputRef.current.value = null;
  };

  const registerWorkout = () => {
    const copy_arr = workouts.slice();

    let workoutName = workout;
    workoutName = workoutName.replace(/ /g, "");
    if (workoutName.length === 0) {
      alert("Please enter more than a word");
      return;
    }
    if (workouts.indexOf(workout) === -1) {
      copy_arr.push(workout);
      setWorkouts(copy_arr);
      setWorkout("");
      inputRef.current.value = null;
      selectRef.current.value = null;
    } else {
      alert("Already choosen");
    }
  };

  const setThemaColor = (color) => {
    setColor(color);
  };

  const deleteWorkout = (word) => {
    const copy_arr = workouts.slice();
    setWorkouts(copy_arr.filter((el) => el !== word));
  };

  const startWorkout = () => {
    if (workouts.length === 0) {
      alert("must select more than a workout");
      return;
    }
    setStartTime(moment().format("HH:mm:ss"));
    navigate("/main");
  };

  const workoutNames = [
    "pull up",
    "lat pulldown",
    "deadlift",
    "seated row",
    "back extension",
    "push up",
    "bench press",
    "incline press",
    "decline press",
    "dumbbell chest press",
    "dips",
    "squat",
    "leg extension",
    "leg curl",
    "lunge",
    "dumbbell curl",
    "shoulder press",
    "military press",
    "Side Lateral Raise",
    "front Raise",
  ];

  const recordsPage = () => {
    navigate("/records");
  };

  return (
    <div className={styles.landingPage}>
      <header style={{ backgroundColor: color }}>
        <i className="fas fa-running"></i> Progressive Overload
      </header>
      <main>
        <section>
          <div className={styles.subtitle} style={{ color: color }}>
            select today's workout
          </div>
          <div className={styles.registerArea}>
            <div className={styles.inputArea}>
              <input
                placeholder="direct input"
                style={{ outlineColor: color }}
                onKeyDown={getNormalInput}
                ref={inputRef}
                className={styles.directInput}
                onChange={getNormalInput}
              />
              <select
                style={{ outlineColor: color }}
                ref={selectRef}
                className={styles.indirectInput}
                onChange={getSelectInput}
              >
                <option selected disabled>
                  choose basic workout
                </option>
                {workoutNames.map((name) => (
                  <option>{name}</option>
                ))}
              </select>
            </div>
            <button
              className={styles.btnArea}
              style={{ backgroundColor: color }}
              onClick={registerWorkout}
            >
              +
            </button>
          </div>
        </section>
        <section>
          <div className={styles.subtitle} style={{ color: color }}>
            today's workouts
          </div>
          <div className={styles.workouts}>
            {workouts.map((workout, key) => {
              return (
                <div
                  key={key}
                  className={styles.workoutList}
                  style={
                    key % 2 === 0
                      ? { backgroundColor: color }
                      : { backgroundColor: null }
                  }
                >
                  <div
                    className={styles.workoutName}
                    style={
                      key % 2 === 0 ? { color: "white" } : { color: color }
                    }
                  >
                    {workout}
                  </div>
                  <span
                    onClick={() => {
                      deleteWorkout(workout);
                    }}
                    className={styles.deleteBtn}
                    style={
                      key % 2 === 0 ? { color: "white" } : { color: color }
                    }
                  >
                    X
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </main>
      {colorPopup ? (
        <div className={styles.fixedOpenedBtn}>
          <div className={styles.colorPart}>
            {colors.map((color) => {
              return (
                <div
                  onClick={() => {
                    setThemaColor(color);
                  }}
                  style={{
                    marginLeft: "1rem",
                    backgroundColor: color,
                    minWidth: "20px",
                    minHeight: "20px",
                    borderRadius: "3px",
                  }}
                ></div>
              );
            })}
          </div>
          <div
            className={styles.closeBtn}
            onClick={() => {
              setColorPopup(false);
            }}
          >
            X
          </div>
        </div>
      ) : (
        <span
          className={styles.fixedBtn}
          style={{ color: color }}
          onClick={() => {
            setColorPopup(true);
          }}
        >
          change color
        </span>
      )}
      <button
        onClick={startWorkout}
        className={styles.strtBtn}
        style={{ backgroundColor: color, color: "white" }}
      >
        🔥 burning 🔥
      </button>
      <div style={{ color }} className={styles.recordBtn} onClick={recordsPage}>
        🗒 Records
      </div>
    </div>
  );
};

export default Landing;
