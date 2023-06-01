import { useNavigate, useLocation } from "react-router-dom";
import styles from "./NavBar.module.css";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { getLatestFlagState, nowWorkingState, workoutState } from "src/states";
import Modal from "../Modal/Modal";

let headingUrl = "";

declare global {
  interface Window {
    ReactNativeWebView: {
      postMessage: any;
    };
  }
}

interface Props {
  children: React.ReactNode;
}

const NavBar = ({ children }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [nowWorking, setNowWorking] = useRecoilState(nowWorkingState);
  const [nowUrl, setNowUrl] = useState("");
  const [modalOn, setModalOn] = useState({ on: false, message: "" });
  const setWorkouts = useSetRecoilState(workoutState);
  const getLatestFlag = useRecoilValue(getLatestFlagState);

  useEffect(() => {
    const pathName = location.pathname;
    const splitedName = pathName.split("/")[1];
    if (window?.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ data: splitedName })
      );
    }

    if (splitedName === "main") {
      setNowUrl("/main");
    } else {
      setNowUrl(pathName);
    }
  }, [location]);

  const setNavigation = useCallback(
    (url: string) => {
      if (nowUrl === url) return;

      if (nowWorking.nowWorking) {
        headingUrl = url;
        setModalOn({
          on: true,
          message:
            "탭을 이탈하면 해당 기록으로 다시 돌아올 수 없습니다. 나가시겠습니까?",
        });
      } else {
        if (url === "/main") {
          navigate(url, { state: getLatestFlag });
        } else {
          navigate(url);
        }
      }
    },
    [navigate, nowUrl, nowWorking.nowWorking, getLatestFlag]
  );

  const closeModal = () => {
    if (headingUrl !== "") {
      setWorkouts([]);
      setModalOn({ on: false, message: "" });
      setNowWorking({ nowWorking: false });
      navigate(headingUrl);
    }
  };

  const cancelModal = () => {
    setModalOn({ on: false, message: "" });
  };

  return (
    <>
      {children}
      <Modal
        modalOn={modalOn}
        closeModal={closeModal}
        cancelModalOn={true}
        cancelModal={cancelModal}
      />
      {location.pathname !== "/" && (
        <nav className={styles.navBar}>
          <button
            className={styles.navBtns}
            onClick={() => setNavigation("/main")}
          >
            HOME
          </button>
          <button
            className={styles.navBtns}
            onClick={() => setNavigation("/about")}
          >
            ABOUT
          </button>
          <button
            className={styles.navBtns}
            onClick={() => setNavigation("/profile")}
          >
            PROFILE
          </button>
        </nav>
      )}
    </>
  );
};

export default NavBar;
