import { Button, Div, Input, Select } from "../interfaces/Types";
import Store from "../store/Store";

export default class Timer {
	public elements;

	constructor() {
		this.elements = this.createElements();
		this.setupEventListeners();

		Store.subscribe(() => {
			const { minutes, seconds } = Store.getState().timer.clock;
			this.setClock(minutes, seconds);
		});

		if (Store.getState().timer.settings.isRunning) {
			this.count();
		}
	}

	private createElements() {
		const timer: Div = document.createElement("div");
		timer.className = "timer";
		timer.innerHTML = `
		<div class="timer-clock">
			<div class="clock-minutes">
				${Store.getState().timer.clock.minutes}
			</div>
			<div class="clock-seconds">
				${Store.getState().timer.clock.seconds}
			</div>
		</div>
		<div class="timer-inputs">
			<label> Duration:
				<input
					class="timer-input"
					type="number"
					value="0"
					min="0"
					max="60"
					title="miliseconds"
				/>
			</label>
			<select class="timer-select-isCountingUp" title="Count up or down?">
				<option value="false">Down</option>
				<option value="true">Up</option>
			</select>
			<button class="timer-start-btn" type="button">Start</button>
		</div>
		`;

		/* <input
					class="timer-minutes-input"
					type="time"
					value="0"
					min="0"
					max="60"
					title="minutes"
				/>
				<input
					class="timer-seconds-input"
					type="number"
					value="0"
					min="0"
					max="59"
					title="seconds"
				/>
		*/

		const elements = {
			root: timer,
			minutes: timer.querySelector(".clock-minutes") as Div,
			seconds: timer.querySelector(".clock-seconds") as Div,
			input: timer.querySelector(".timer-input") as Input,
			select: timer.querySelector(".timer-select-isCountingUp") as Select,
			btnStart: timer.querySelector(".timer-start-btn") as Button,
		};

		return elements;
	}
	private setClock(minutes: number, seconds: number) {
		this.elements.minutes.innerHTML = minutes.toString();
		this.elements.seconds.innerHTML = seconds.toString();
	}
	private setupEventListeners(): void {
		this.elements.input.addEventListener("change", (e: Event) => {
			Store.dispatch(
				"timer/setDuration",
				parseInt((e.currentTarget as Input).value)
			);
		});

		this.elements.select.addEventListener("change", (e: Event) => {
			Store.dispatch(
				"timer/setIsCountingUp",
				(e.currentTarget as Select).value
			);
		});

		this.elements.btnStart.addEventListener("click", () => {
			this.count();
		});
	}
	private count() {
		const { settings } = Store.getState().timer;
		const duration: number = settings.duration;
		const isCountingUp: boolean = settings.isCountingUp;
		let startTime: number = settings.startTime;

		if (!startTime) {
			startTime = Date.now();
		}

		const id = setInterval(() => {
			const currentTime: number = Date.now();
			const elapsedTime: number = currentTime - <number>startTime;

			let minutes;
			let seconds;

			if (elapsedTime >= duration) {
				clearInterval(id);

				minutes = 0;
				seconds = 0;

				Store.dispatch("timer/setSettings", {
					startTime: 0,
					duration,
					isCountingUp,
					isRunning: false,
				});
			} else {
				const remainingTime: number = duration - elapsedTime;

				minutes = Math.floor(
					(remainingTime % (1000 * 60 * 60)) / (1000 * 60)
				);
				seconds = Math.ceil((remainingTime % (1000 * 60)) / 1000);

				if (seconds === 60) {
					minutes -= 1;
					minutes = minutes < 1 ? 0 : minutes;
					seconds = 0;
				}

				console.log(remainingTime, minutes, seconds);
				Store.dispatch("timer/setSettings", {
					startTime,
					duration,
					isCountingUp,
					isRunning: true,
				});
			}

			Store.dispatch("timer/setClock", { minutes, seconds });
		}, 1000);
	}
}
