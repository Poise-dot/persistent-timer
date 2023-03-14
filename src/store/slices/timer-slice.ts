import Slice from "../../interfaces/Slice";
import State from "../../interfaces/State";
import TimerSettings from "../../interfaces/TimerSettings";

const timerSlice: Slice<State> = {
	name: "timer",
	initialState: {
		time: {
			minutes: 0,
			seconds: 0,
		},
		startTime: 0,
		duration: 0,
		isCountingUp: false,
		isTimerRunning: false,
	},
	reducers: {
		setTime(state, action) {
			return {
				...state,
				time: {
					...state.time,
					minutes: action.payload.minutes,
					seconds: action.payload.seconds,
				},
			};
		},
		setDuration(state, action) {
			return {
				...state,
				duration: action.payload,
			};
		},
		setIsCountingUp(state, action) {
			return {
				...state,
				isCountingUp: action.payload,
			};
		},
	},
};

export default timerSlice;
