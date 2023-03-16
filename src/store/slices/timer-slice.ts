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
			isRunning: false,
		},
	},
	reducers: {
		computeClockCount(state) {
			const currentTime: number = Date.now();
			const elapsedTime: number = currentTime - state.settings.startTime;

			let minutes: number = 0;
			let seconds: number = 0;

			if (!state.settings.isCountingUp) {
				minutes = Math.floor(
					((state.settings.duration - elapsedTime) %
						(1000 * 60 * 60)) /
						(1000 * 60)
				);
				seconds = Math.ceil(
					((state.settings.duration - elapsedTime) % (1000 * 60)) /
						1000
				);

				if (seconds === 60) {
					minutes -= 1;
					minutes = minutes < 1 ? 0 : minutes;
					seconds = 0;
				}
			} else {
				minutes = Math.floor(
					(elapsedTime % (1000 * 60 * 60)) / (1000 * 60)
				);
				seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
			}

			return {
				...state,
				clock: {
					minutes: minutes,
					seconds: seconds,
				},
			};
		},
		startCount(state) {
			return {
				...state,
				settings: {
					...state.settings,
					isRunning: true,
				},
			};
		},
		resetCount(state) {
			return {
				...state,
				settings: {
					...state.settings,
					startTime: 0,
					isRunning: false,
				},
			};
		},
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
		resetClock(state) {
			const currentTime: number = Date.now();
			const elapsedTime: number = currentTime - state.settings.startTime;

			if (!state.settings.isCountingUp) {
				return {
					...state,
					clock: {
						minutes: 0,
						seconds: 0,
					},
				};
			}

			return {
				...state,
				minutes: Math.floor(
					(elapsedTime % (1000 * 60 * 60)) / (1000 * 60)
				),
				seconds: Math.floor((elapsedTime % (1000 * 60)) / 1000),
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
					isCountingUp: action.payload,
				},
			};
		},
	},
};

export default timerSlice;
