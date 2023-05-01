import { atom, selector } from "recoil";
import _ from "lodash";

export const userState = atom({
  key: "userState",
  default: {
    nickname: "",
  },
});

export const workoutState = atom({
  key: "workoutState",
  default: [],
});

export const allWorkoutState = atom({
  key: "allWorkoutState",
  default: [],
});

export const timeState = atom({
  key: "timeState",
  default: { startTime: "", endTime: "" },
});

export const dateWorkoutState = atom({
  key: "dateWorkoutState",
  default: [],
});

export const recordWorkoutState = atom({
  key: "recordWorkoutState",
  default: [],
});

export const durationState = selector({
  key: "durationState",
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

export const bestSetState = selector({
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

// export const apiState = selector({
//   key: "apiState",
//   get: ({ get }) => {
//     const workouts = get(workoutState);
//     const copyWorkouts = _.cloneDeep(workouts);
//     const bestSets = copyWorkouts.map((workout) => {
//       const copyArr = workout.slice();
//       workout.sort((x, y) => {
//         const prevScore =
//           (parseInt(x.reps) === 0 ? 1 : parseInt(x.reps)) *
//           (parseInt(x.kg) === 0 ? 1 : parseInt(x.kg));

//         const nextScore =
//           (parseInt(y.reps) === 0 ? 1 : parseInt(y.reps)) *
//           (parseInt(y.kg) === 0 ? 1 : parseInt(y.kg));

//         if (nextScore === prevScore) {
//           return parseInt(y.kg) - parseInt(x.kg);
//         } else return nextScore - prevScore;
//       });

//       const setNum = workout[0].set - 1;
//       copyArr[setNum].bestSet = true;
//       return copyArr;
//     });

//     return bestSets;
//   },
// });

export const workoutCntState = selector({
  key: "workoutCntState",
  get: ({ get }) => {
    const workouts = get(workoutState);
    return workouts.length;
  },
});
