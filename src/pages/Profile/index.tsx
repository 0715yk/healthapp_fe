import GlowHeader from "../../components/GlowHeader/GlowHeader";
import DeleteAccount from "./DeleteAccount";
import NicknameInput from "./NicknameInput";
import cookies from "react-cookies";
import { useNavigate } from "react-router-dom";
import styles from "./style.module.css";
import { useSetRecoilState } from "recoil";
import { userState } from "src/states";
import useCheckToken from "src/hooks/useCheckToken";
import Modal from "src/components/Modal/Modal";
import { useState } from "react";

const Profile = () => {
  const navigate = useNavigate();
  const setUserState = useSetRecoilState(userState);
  const [modalOn, setModalOn] = useState({ on: false, message: "" });
  const onLogout = () => {
    setModalOn({ on: true, message: "정말 로그아웃 하시겠습니까?" });
  };

  useCheckToken();

  const cancelModal = () => {
    setModalOn({ on: false, message: "" });
  };

  const closeModal = () => {
    setModalOn({ on: false, message: "" });
    setUserState({ nickname: "" });
    cookies.remove("access_token", { path: "/" });
    navigate("/");
  };

  return (
    <div className={styles.profilePage}>
      <Modal
        cancelModalOn={true}
        modalOn={modalOn}
        closeModal={closeModal}
        cancelModal={cancelModal}
      />
      <GlowHeader
        title={"Profile"}
        style={{
          fontSize: "13vw",
          textAlign: "left",
          marginLeft: "15px",
          paddingTop: "40px",
        }}
      />
      <div className={styles.bodyPart}>
        <div className={styles.contents}>
          <NicknameInput />
          {/* <PasswordInput /> */}
          <button className={styles.logoutbtn} onClick={onLogout}>
            Logout
          </button>
          <DeleteAccount />
        </div>
      </div>
    </div>
  );
};

export default Profile;
