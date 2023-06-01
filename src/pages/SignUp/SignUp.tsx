import React, { ForwardedRef, useRef, useState } from "react";
import styles from "./SignUp.module.css";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal/Modal";
import GlowBtn from "../../components/GlowBtn/GlowBtn";
import { validateSignupForm } from "src/utils";
import { customAxios } from "src/utils/axios";
import cookies from "react-cookies";
import { useSetRecoilState } from "recoil";
import { loadingState, userState } from "src/states";
import axios from "axios";

const SignUp = React.forwardRef(({}, ref: ForwardedRef<HTMLDivElement>) => {
  const setLoadingSpinner = useSetRecoilState(loadingState);
  const navigate = useNavigate();
  const idRef = useRef<HTMLInputElement | null>(null);
  const pwdRef = useRef<HTMLInputElement | null>(null);
  const nicknameRef = useRef<HTMLInputElement | null>(null);
  const [modalOn, setModalOn] = useState({ on: false, message: "" });
  const setUserState = useSetRecoilState(userState);
  const closeModal = () => {
    setModalOn({ on: false, message: "" });
  };

  const backBtn = () => {
    if (typeof ref !== "function" && ref?.current) {
      ref.current.style.transitionDuration = "1200ms";
      ref.current.style.transform = "translate(100vw, 0)";
    }
  };

  const signup = async () => {
    if (idRef?.current && pwdRef?.current && nicknameRef?.current) {
      const id = idRef.current.value;
      const password = pwdRef.current.value;
      const nickname = nicknameRef.current.value;
      const message = validateSignupForm(id, password, nickname);
      setLoadingSpinner({ isLoading: true });
      if (message === "") {
        try {
          const response = await customAxios.post("/users", {
            userId: id,
            password,
            nickname,
          });
          const token = response?.data?.jwtToken;
          cookies.save("access_token", token, {
            path: "/",
            // secure : true,
            // httpOnly: true,
          });
          setLoadingSpinner({ isLoading: false });
          setUserState({
            nickname,
          });
          navigate("/main");
        } catch (err: unknown) {
          if (axios.isAxiosError(err)) {
            const message =
              err?.response?.data?.message ??
              "서버 에러 입니다. 잠시후 다시 시도해주세요.";
            setLoadingSpinner({ isLoading: false });
            setModalOn({
              on: true,
              message: message,
            });
          }
        }
      } else {
        setLoadingSpinner({ isLoading: false });
        setModalOn({
          on: true,
          message: message,
        });
      }
    }
  };

  return (
    <div className={styles.signupPage} ref={ref}>
      <Modal modalOn={modalOn} closeModal={closeModal} />
      <button id={styles.backBtn} onClick={backBtn}>
        <i className="fas fa-chevron-left"></i>&nbsp;BACK
      </button>
      <header>Sign Up Form</header>
      <main>
        <section>
          <h2>Id</h2>
          <input type="text" ref={idRef}></input>
        </section>
        <section>
          <h2>Password</h2>
          <input type="password" ref={pwdRef}></input>
        </section>
        <section>
          <h2>Nickname</h2>
          <input type="text" ref={nicknameRef}></input>
        </section>
        <section>
          <GlowBtn
            props={{
              func: signup,
            }}
          />
        </section>
      </main>
    </div>
  );
});

export default SignUp;
