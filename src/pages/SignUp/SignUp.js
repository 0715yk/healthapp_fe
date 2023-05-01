import React, { useRef, useState } from "react";
import styles from "./SignUp.module.css";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal/Modal";
import GlowBtn from "../../components/GlowBtn/GlowBtn";
import { validateSignupForm } from "src/utils";
import { customAxios } from "src/utils/axios";
import cookies from "react-cookies";
import { useSetRecoilState } from "recoil";
import { userState } from "src/states";

const SignUp = React.forwardRef(({}, ref) => {
  const navigate = useNavigate();
  const idRef = useRef();
  const pwdRef = useRef();
  const nicknameRef = useRef();
  const [modalOn, setModalOn] = useState({ on: false, message: "" });
  const setUserState = useSetRecoilState(userState);
  const closeModal = () => {
    setModalOn({ on: false, message: "" });
  };

  const backBtn = () => {
    ref.current.style.transitionDuration = "1200ms";
    ref.current.style.transform = "translate(100vw, 0)";
  };

  const signup = async () => {
    const id = idRef.current.value;
    const password = pwdRef.current.value;
    const nickname = nicknameRef.current.value;
    const message = validateSignupForm(id, password, nickname);
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
        setUserState({
          nickname,
        });
        navigate("/main");
      } catch (err) {
        const message =
          err?.response?.data?.message ??
          "서버 에러 입니다. 잠시후 다시 시도해주세요.";
        setModalOn({
          on: true,
          message: message,
        });
      }
    } else {
      setModalOn({
        on: true,
        message: message,
      });
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
