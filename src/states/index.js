import { atom, selector } from "recoil";
import _ from "lodash";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const nowWorkingOrFinishState = atom({
  key: "nowWorkingOrFinish",
  default: {
    nowWorking: false,
  },
  effects_UNSTABLE: [persistAtom],
});

export const loadingState = atom({
  key: "loadingState",
  default: {
    isLoading: false,
  },
});

export const userState = atom({
  key: "userState",
  default: {
    nickname: "",
  },
});

// 1
export const workoutState = atom({
  key: "workoutState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const allWorkoutState = atom({
  key: "allWorkoutState",
  default: [],
});

// 2
export const timeState = atom({
  key: "timeState",
  default: { startTime: "", endTime: "" },
  effects_UNSTABLE: [persistAtom],
});

export const dateWorkoutState = atom({
  key: "dateWorkoutState",
  default: [],
});

export const recordWorkoutState = atom({
  key: "recordWorkoutState",
  default: [],
});

// 3
export const durationState = selector({
  key: "durationState",
  effects_UNSTABLE: [persistAtom],
  get: ({ get }) => {
    const time = get(timeState);
    const strtTime = time.startTime.format("HH:mm:ss").split(":");
    const endTime = time.endTime.format("HH:mm:ss").split(":");
    const result = {};
    result.startTime = time.startTime.format("HH:mm:ss");
    result.endTime = time.endTime.format("HH:mm:ss");

    const strtTimeObj = {
      hour: parseInt(strtTime[0]),
      min: parseInt(strtTime[1]),
      sec: parseInt(strtTime[2]),
    };

    const endTimeObj = {
      hour: parseInt(endTime[0]),
      min: parseInt(endTime[1]),
      sec: parseInt(endTime[2]),
    };

    if (strtTimeObj.sec > endTimeObj.sec) {
      result.sec = 60 - strtTimeObj.sec + endTimeObj.sec;
      endTimeObj.min--;
    } else {
      result.sec = endTimeObj.sec - strtTimeObj.sec;
    }

    if (strtTimeObj.min > endTimeObj.min) {
      result.min = 60 - strtTimeObj.min + endTimeObj.min;
      endTimeObj.hour--;
    } else {
      result.min = endTimeObj.min - strtTimeObj.min;
    }

    result.hour = endTimeObj.hour - strtTimeObj.hour;

    return result;
  },
});

//4
export const bestSetState = selector({
  key: "bestSetState",
  effects_UNSTABLE: [persistAtom],
  get: ({ get }) => {
    const workouts = get(workoutState);
    const copyWorkouts = _.cloneDeep(workouts);
    const bestSets = copyWorkouts.map((workout) => {
      workout.sort((x, y) => {
        const prevScore =
          (parseInt(x.reps) === 0 ? 1 : parseInt(x.reps)) *
          (parseInt(x.kg) === 0 ? 1 : parseInt(x.kg));

        const nextScore =
          (parseInt(y.reps) === 0 ? 1 : parseInt(y.reps)) *
          (parseInt(y.kg) === 0 ? 1 : parseInt(y.kg));

        if (nextScore === prevScore) {
          return parseInt(y.kg) - parseInt(x.kg);
        } else return nextScore - prevScore;
      });

      return workout[0];
    });

    return bestSets;
  },
});

// 5
export const workoutCntState = selector({
  key: "workoutCntState",
  effects_UNSTABLE: [persistAtom],
  get: ({ get }) => {
    const workouts = get(workoutState);
    return workouts.length;
  },
});
