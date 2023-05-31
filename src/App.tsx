import "./App.css";
import Main from "./pages/Main/Main";
import Landing from "./pages/Landing/Landing";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Profile from "./pages/Profile";
import { isMobile } from "react-device-detect";
import LoadingSpinner from "./components/LoadingSpinner";
import { loadingState } from "./states";
import { useRecoilValue } from "recoil";
import About from "./pages/About";

function App() {
  const isLoading = useRecoilValue(loadingState);

  return isMobile ? (
    <BrowserRouter>
      <NavBar>
        {isLoading.isLoading && <LoadingSpinner />}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/main/*" element={<Main />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </NavBar>
    </BrowserRouter>
  ) : (
    <>모바일을 통해서만 접근 가능한 서비스 입니다.</>
  );
}

export default App;
