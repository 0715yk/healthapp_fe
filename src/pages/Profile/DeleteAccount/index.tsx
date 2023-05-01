import Modal from "src/components/Modal/Modal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { customAxios } from "src/utils/axios";
import styles from "./style.module.css";
import cookies from "react-cookies";
import { useSetRecoilState } from "recoil";
import { userState } from "src/states";

const DeleteAccount = () => {
  // const userInform = useRecoilValue(userState);
  const [modalOn, setModalOn] = useState({ on: false, message: "" });
  const [cancelModalOn, setCancelModalOn] = useState(true);
  const [btnOption, setBtnOption] = useState(true);
  const navigate = useNavigate();
  const setUserState = useSetRecoilState(userState);

  const closeModal = async () => {
    // 탈퇴 api 호출
    try {
      await customAxios.delete(`/users`);
      setCancelModalOn(false);
      setBtnOption(false);
      setModalOn({
        on: true,
        message:
          "그동안 이용해주셔서 감사합니다. 5초 후에 랜딩 페이지로 이동합니다.",
      });
      setTimeout(() => {
        setUserState({ nickname: "" });
        cookies.remove("access_token", { path: "/" });
        navigate("/");
      }, 5000);
    } catch {
      setModalOn({
        on: true,
        message: "서버 에러 잠시후 다시 시도해주세요.",
      });
    }
  };

  const onDeleteAccount = () => {
    setModalOn({
      on: true,
      message:
        "회원 탈퇴를 하시면 이전까지의 운동기록이 모두 삭제됩니다. 진행하시겠습니까?",
    });
  };

  const cancelModal = () => {
    setModalOn({
      on: false,
      message: "",
    });
  };

  return (
    <>
      <Modal
        modalOn={modalOn}
        closeModal={closeModal}
        cancelModalOn={cancelModalOn}
        cancelModal={cancelModal}
        btnOption={btnOption}
      />
      <button className={styles.deleteBtn} onClick={onDeleteAccount}>
        Delete Account
      </button>
    </>
  );
};

export default DeleteAccount;
