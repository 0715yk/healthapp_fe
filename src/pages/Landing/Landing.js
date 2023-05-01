import React, { useEffect, useRef } from "react";
import styles from "./Landing.module.css";
import Login from "../Login/Login";
import { customAxios } from "src/utils/axios";
import { useNavigate, useLocation } from "react-router-dom";
import cookies from "react-cookies";
import { useSetRecoilState } from "recoil";
import { userState } from "src/states";

const Landing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setUserNickname = useSetRecoilState(userState);

  const scrollRef = useRef(null);
  const buttonRef = useRef(null);
  const upperRef = useRef(null);
  const lowerRef = useRef(null);

  const startFunc = () => {
    upperRef.current.style.transform = "translate(-100vw,0)";
    lowerRef.current.style.transform = "translate(100vw,0)";
    buttonRef.current.style.transform = "translate(100vw,0)";
    scrollRef.current.style.transform = "translate(0,-100vh)";
  };

  useEffect(() => {
    upperRef.current.style.transform = "translate(100vw,0)";
    lowerRef.current.style.transform = "translate(-100vw,0)";
    const setButtonStyle = setTimeout(() => {
      buttonRef.current.style.transform = "translate(0,-100vh)";
    }, 800);

    return () => {
      clearTimeout(setButtonStyle);
    };
  }, []);

  const checkToken = async () => {
    const jwtToken = cookies.load("access_token");

    if (!jwtToken) {
      return;
    } else {
      try {
        const response = await customAxios.get("/users");
        const { nickname } = response.data;
        setUserNickname({ nickname });
        navigate("/main");
      } catch (err) {
        return;
      }
    }
  };

  useEffect(() => {
    void checkToken();
  }, []);

  return (
    <div>
      <div className={styles.landingPage}>
        <header>
          <div ref={upperRef} className={styles.upperTitle}>
            Progressive
          </div>
          <div ref={lowerRef} className={styles.lowerTitle}>
            Overload
          </div>
        </header>
        <section>
          <button onClick={startFunc} ref={buttonRef}>
            Start
          </button>
        </section>
      </div>
      <Login ref={scrollRef} />
    </div>
  );
};

export default Landing;
