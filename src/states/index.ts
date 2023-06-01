import { atom, selector } from "recoil";
import _ from "lodash";
import {
  Loading,
  NowWorking,
  Duration,
  User,
  Time,
  RecordWorkouts,
  Record,
  BestSet,
  WorkoutCount,
} from "./types";
import moment from "moment";

export const nowWorkingState = atom<NowWorking>({
  key: "nowWorkingState",
  default: {
    nowWorking: false,
  },
});

export const loadingState = atom<Loading>({
  key: "loadingState",
  default: {
    isLoading: false,
  },
});

export const userState = atom<User>({
  key: "userState",
  default: {
    nickname: "",
  },
});

export const workoutState = atom<Record>({
  key: "workoutState",
  default: [],
});

export const timeState = atom<Time>({
  key: "timeState",
  default: { startTime: moment(), endTime: moment() },
});

export const recordWorkoutState = atom<RecordWorkouts>({
  key: "recordWorkoutState",
  default: [],
});

export const durationState = selector<Duration>({
  key: "durationState",

  get: ({ get }) => {
    const time = get(timeState);
    const strtTime = time.startTime.format("HH:mm:ss").split(":");
    const endTime = time.endTime.format("HH:mm:ss").split(":");
    const result = {} as Duration;
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

export const bestSetState = selector<BestSet>({
  key: "bestSetState",
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

export const workoutCntState = selector<WorkoutCount>({
  key: "workoutCntState",

  get: ({ get }) => {
    const workouts = get(workoutState);
    return workouts.length;
  },
});
