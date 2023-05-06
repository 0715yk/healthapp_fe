import { Route, Routes } from "react-router-dom";
import Record from "../Record";
import WorkOut from "../WorkOut/WorkOut";
import WorkoutModal from "../../components/WorkoutModal";
import WorkoutMain from "../WorkoutMain";

const Main = () => {
  return (
    <Routes>
      <Route path="" element={<WorkoutMain />} />
      <Route path="record" element={<Record />} />
      <Route path="records" element={<WorkoutModal />} />
      <Route path="workout" element={<WorkOut />} />
    </Routes>
  );
};

export default Main;
