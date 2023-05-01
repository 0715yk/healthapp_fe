import "./App.css";
import Main from "./pages/Main/Main";
import Landing from "./pages/Landing/Landing";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Profile from "./pages/Profile";
import { isMobile } from "react-device-detect";

function App() {
  // return isMobile ? (
  //   <BrowserRouter>
  //     <NavBar>
  //       <Routes>
  //         <Route path="/" element={<Landing />} />
  //         <Route path="/main/*" element={<Main />} />
  //         <Route path="/about" element={<div>about</div>} />
  //         <Route path="/profile" element={<Profile />} />
  //       </Routes>
  //     </NavBar>
  //   </BrowserRouter>
  // ) : (
  //   <>모바일을 통해서만 접근 가능한 서비스 입니다.</>
  // );

  return (
    <BrowserRouter>
      <NavBar>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/main/*" element={<Main />} />
          <Route path="/about" element={<div>about</div>} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </NavBar>
    </BrowserRouter>
  );
}

export default App;
