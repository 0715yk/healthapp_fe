import { userState } from "src/states";
import { useRecoilState } from "recoil";
import { customAxios } from "src/utils/axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useCallback } from "react";
import cookies from "react-cookies";

const useCheckToken = () => {
  const navigate = useNavigate();
  const [userInformState, setUserState] = useRecoilState(userState);
  const location = useLocation();

  const checkToken = useCallback(async () => {
    const jwtToken = cookies.load("access_token");
    if (location.state === "login") return;
    if (!jwtToken) {
      navigate("/");
    } else {
      try {
        if (userInformState.nickname !== "") return;
        const response = await customAxios.get("/users");
        const { nickname } = response.data;
        setUserState({ nickname });
      } catch (err) {
        cookies.remove("access_token", { path: "/" });
        navigate("/");
      }
    }
  }, [location.state, setUserState, navigate, userInformState.nickname]);

  useEffect(() => {
    void checkToken();
  }, []);

  return 2;
};

export default useCheckToken;
