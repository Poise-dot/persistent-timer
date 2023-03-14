import Slice from "../../interfaces/Slice";
import State from "../../interfaces/State";

const timerSlice: Slice<State> = {
	name: "timer",
	initialState: {
		clock: {
			minutes: 0,
			seconds: 0,
		},
		settings: {
			startTime: 0,
			duration: 0,
			isCountingUp: false,
			isTimerRunning: false,
		},
	},
	reducers: {
		setClock(state, action) {
			return {
				...state,
				clock: {
					...state.time,
					minutes: action.payload.minutes,
					seconds: action.payload.seconds,
				},
			};
		},
		setStartTime(state, action) {
			return {
				...state,
				settings: {
					...state.settings,
					startTime: action.payload,
				},
			};
		},
		setDuration(state, action) {
			return {
				...state,
				settings: {
					...state.settings,
					duration: action.payload,
				},
			};
		},
		setIsCountingUp(state, action) {
			return {
				...state,
				settings: {
					...state.settings,
					IsCountingUp: action.payload,
				},
			};
		},
		setSettings(state, action) {
			return {
				...state,
				settings: action.payload,
			};
		},
	},
};

export default timerSlice;
