import React, { useRef, useState, useCallback } from "react";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal/Modal";
import SignUp from "../SignUp/SignUp";
import { useSetRecoilState } from "recoil";
import { loadingState, userState } from "../../states";
import { customAxios } from "src/utils/axios";
import cookies from "react-cookies";

const Login = React.forwardRef(({}, ref) => {
  const navigate = useNavigate();
  const setLoadingSpinner = useSetRecoilState(loadingState);
  const idRef = useRef();
  const pwdRef = useRef();
  const [modalOn, setModalOn] = useState({ on: false, message: "" });

  const setUserState = useSetRecoilState(userState);

  const signupRef = useRef();
  const signUpPage = () => {
    signupRef.current.style.transitionDuration = "700ms";
    signupRef.current.style.transform = "translate(-100vw, 0)";
  };
  const userLogin = useCallback(async () => {
    const userIdInput = idRef.current.value;
    const passwordInput = pwdRef.current.value;

    try {
      setLoadingSpinner({ isLoading: true });
      const response = await customAxios.post("/users/login", {
        userId: userIdInput,
        password: passwordInput,
      });

      const { token, nickname } = response?.data;
      cookies.save("access_token", token, {
        path: "/",
        // secure : true,
        // httpOnly: true,
      });

      setUserState({
        nickname,
      });
      setLoadingSpinner({ isLoading: false });
      navigate("/main", {
        state: "login",
      });
    } catch (err) {
      console.log(err);
      const message =
        err?.response?.data?.message ??
        "서버 에러 입니다. 잠시후 다시 시도해주세요.";
      setLoadingSpinner({ isLoading: false });
      setModalOn({
        on: true,
        message: message,
      });
    }
  }, [navigate, setLoadingSpinner, setUserState]);

  const closeModal = () => {
    setModalOn({ on: false, message: "" });
  };

  return (
    <div ref={ref} className={styles.loginPage}>
      <SignUp ref={signupRef} />
      <Modal modalOn={modalOn} closeModal={closeModal} />
      <header>Welcome to Strong</header>
      <main>
        <section>
          <h2>Id</h2>
          <input type="text" ref={idRef}></input>
        </section>
        <section>
          <h2>Password</h2>
          <input type="password" ref={pwdRef}></input>
        </section>
        <section className={styles.buttons}>
          <button className={styles.glowBtn} onClick={userLogin}>
            Login
          </button>
          {/* <button className={styles.glowBtn} onClick={anonymousLogin}>
            Guest Login
          </button> */}
          <button id={styles.signUpBtn} onClick={signUpPage}>
            Sign up
          </button>
        </section>
      </main>
    </div>
  );
});

export default Login;
