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
  startTime: moment.Moment;
  endTime: moment.Moment;
}

export interface Duration {
  startTime: string;
  endTime: string;
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
  name: string;
}

export interface WorkoutRecord {
  set: number;
  kg: string;
  reps: string;
  bestSet?: boolean;
  name: string;
  done: boolean;
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
  datesId: number;
  id: number;
  workoutNames: WorkoutNameType[];
}

export interface WorkoutNameType {
  workoutName: string;
  workoutNumId: number;
  id: number;
  workouts: Workout[];
}

export type RecordWorkouts = DailyRecordWorkout[];

export type Record = WorkoutRecord[][];

export type BestSet = WorkoutRecord[];

export type WorkoutCount = number;
