import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRecoilState } from "recoil";
import { userState } from "src/states";
import Modal from "src/components/Modal/Modal";
import { validateUserPwd, PWD_VALIDATION_MESSAGE } from "src/utils";
import styles from "./style.module.css";
// import { axiosFetch } from "src/utils/axios";

const PasswordInput = ({}) => {
  return <></>;
  // const [passwordInput, setPasswordInput] = useState("");
  // const [userInform, setUserInform] = useRecoilState(userState);
  // const [modalOn, setModalOn] = useState({ on: false, message: "" });
  // const divRef = useRef(null);
  // const updateUserInform = useCallback(() => {
  //   const password = userInform.password;
  //   if (password) {
  //     setPasswordInput(password);
  //   }
  // }, [userInform.password]);
  // useEffect(() => {
  //   updateUserInform();
  //   const ref = divRef.current;
  //   document.addEventListener(
  //     "click",
  //     (e) => {
  //       if (ref.contains(e.target)) {
  //         return;
  //       } else {
  //         updateUserInform();
  //       }
  //     },
  //     true
  //   );
  //   return () => {
  //     document.removeEventListener(
  //       "click",
  //       (e) => {
  //         if (ref.contains(e.target)) {
  //           return;
  //         } else {
  //           updateUserInform();
  //         }
  //       },
  //       true
  //     );
  //   };
  // }, [updateUserInform]);
  // const onChangeEvent = (e: React.onChangeEvent) => {
  //   const text = e.target.value;
  //   setPasswordInput(text);
  // };
  // const onClickEvent = useCallback(
  //   (e: React.onClickEvent) => {
  //     // 여기서 유효성 검사가 통과하면 api 호출 아니면 Modal 호출
  //     const resultCode = validateUserPwd(passwordInput);
  //     console.log(passwordInput);
  //     if (passwordInput === userInform.password) {
  //       setModalOn({
  //         on: true,
  //         message: "동일한 패스워드로는 변경할 수 없습니다.",
  //       });
  //       return;
  //     }
  //     const message = PWD_VALIDATION_MESSAGE[resultCode];
  //     if (message === "") {
  //       // api 호출
  //       axiosFetch(
  //         `http://api.localhost:4000/users/password/${passwordInput}`,
  //         "PATCH"
  //       );
  //       setModalOn({ on: true, message: "성공적으로 수정됐습니다." });
  //       setUserInform((prev) => {
  //         return {
  //           ...prev,
  //           password: passwordInput,
  //         };
  //       });
  //     } else {
  //       setModalOn({ on: true, message: message });
  //       return;
  //     }
  //   },
  //   [passwordInput, setUserInform, userInform.password]
  // );
  // const closeModal = () => {
  //   setModalOn({ on: false, message: "" });
  // };
  // const inputRef = useRef(null);
  // const setHide = () => {
  //   if (inputRef.current.type === "password") {
  //     inputRef.current.type = "text";
  //   } else {
  //     inputRef.current.type = "password";
  //   }
  // };
  // return (
  //   <div className={styles.updatePasswordWrapper} ref={divRef}>
  //     <Modal modalOn={modalOn} closeModal={closeModal} />
  //     <div className={styles.passwordHeader}>Password</div>
  //     <div className={styles.updatePassword}>
  //       <input
  //         className={styles.updatePasswordInput}
  //         ref={inputRef}
  //         type="password"
  //         value={passwordInput}
  //         onChange={onChangeEvent}
  //       />
  //       <button className={styles.updatePasswordBtn} onClick={onClickEvent}>
  //         수정
  //       </button>
  //       <button className={styles.hideBtn} onClick={setHide}>
  //         비밀번호 확인
  //       </button>
  //     </div>
  //   </div>
  // );
};

export default PasswordInput;
