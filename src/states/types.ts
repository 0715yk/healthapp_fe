export interface NowWorking {
  nowWorking: boolean;
}

export interface Loading {
  isLoading: boolean;
}

export interface User {
  nickname: string;
}

export interface Time {
  startTime: string;
  endTime: string;
}

export interface Duration extends Time {
  hour: number;
  min: number;
  sec: number;
}

export interface Workout {
  id: number;
  workoutNameId: number;
  set: number;
  kg: string;
  reps: string;
  bestSet: boolean;
}

export interface RecordWorkout {
  datesId: number;
  id: number;
  workoutNumber: number;
  workouts: Workout[];
}

export interface DailyRecordWorkout {
  bestSet: boolean;
  done: boolean;
  kg: number;
  name: string;
  reps: string;
  set: number;
}

export type RecordWorkouts = DailyRecordWorkout[];

export type Record = Workout[][];

export type BestSet = Workout[];

export type WorkoutCount = number;
