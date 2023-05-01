import GlowHeader from "../../components/GlowHeader/GlowHeader";
import DeleteAccount from "./DeleteAccount";
import NicknameInput from "./NicknameInput";
import cookies from "react-cookies";
import { useNavigate } from "react-router-dom";
import styles from "./style.module.css";
import { useSetRecoilState } from "recoil";
import { userState } from "src/states";
import useCheckToken from "src/hooks/useCheckToken";

const Profile = () => {
  const navigate = useNavigate();
  const setUserState = useSetRecoilState(userState);

  const onLogout = () => {
    setUserState({ nickname: "" });
    cookies.remove("access_token", { path: "/" });
    navigate("/");
  };

  useCheckToken();

  return (
    <div className={styles.profilePage}>
      <GlowHeader
        title={"Profile"}
        style={{
          fontSize: "13vw",
          textAlign: "left",
          marginLeft: "15px",
          paddingTop: "20px",
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
