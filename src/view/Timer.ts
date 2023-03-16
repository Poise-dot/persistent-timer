import { Button, Div, Input, Select } from "../interfaces/Types";
import Store from "../store/Store";

export default class Timer {
	public elements;
	private interval: any = 0;

	constructor() {
		this.elements = this.createElements();
		this.setupEventListeners();

		Store.subscribe(() => {
			const { minutes, seconds } = Store.getState().timer.clock;
			this.setClock(minutes, seconds);
		});

		this.resumeCountIfOngoing();
	}

	private createElements() {
		const timer: Div = document.createElement("div");
		timer.className = "timer";
		timer.innerHTML = `
		<div class="timer-clock">
			Minutes:
			<div class="clock-minutes">
			 	${Store.getState().timer.clock.minutes}
			</div>
			Seconds:
			<div class="clock-seconds">
				${Store.getState().timer.clock.seconds}
			</div>
		</div>
		<div class="timer-inputs">
			<label> Duration:
				<input
					class="timer-input-duration"
					type="number"
					value="0"
					min="0"
					title="duration in miliseconds"
				/>
			</label>
			<select class="timer-select-isCountingUp" title="Count up or down?">
				<option value="false">Down</option>
				<option value="true">Up</option>
			</select>
			<button class="timer-start-btn" type="button">Start</button>
			<button class="timer-stop-btn" type="button">STOP</button>
		</div>
		`;

		/* 
			<label> Duration:
				<input
					class="timer-input-mins"
					type="number"
					value="0"
					min="0"
					max="60"
					title="minutes"
				/>
				<input
					class="timer-input-secs"
					type="number"
					value="0"
					min="0"
					max="59"
					title="seconds"
				/>
			</label>
		*/

		const elements = {
			root: timer,
			minutes: timer.querySelector(".clock-minutes") as Div,
			seconds: timer.querySelector(".clock-seconds") as Div,
			input: timer.querySelector(".timer-input-duration") as Input,
			select: timer.querySelector(".timer-select-isCountingUp") as Select,
			btnStart: timer.querySelector(".timer-start-btn") as Button,
			btnStop: timer.querySelector(".timer-stop-btn") as Button,
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
				(e.currentTarget as Select).value === "true" ? true : false
			);
		});

		this.elements.btnStart.addEventListener("click", () => {
			this.count();
		});

		this.elements.btnStop.addEventListener("click", () => {
			if (Store.getState().timer.settings.isRunning) {
				clearInterval(this.interval);
				Store.dispatch("timer/stopCount");
			}
		});
	}
	private count() {
		const { startTime, duration } = Store.getState().timer.settings;

		if (!startTime) {
			Store.dispatch("timer/setStartTime", Date.now());
		}

		Store.dispatch("timer/startCount");

		this.interval = setInterval(() => {
			const currentTime: number = Date.now();
			const elapsedTime: number =
				currentTime - Store.getState().timer.settings.startTime;

			if (elapsedTime >= duration) {
				clearInterval(this.interval);
				Store.dispatch("timer/resetClock");
				Store.dispatch("timer/resetCount");
			} else {
				Store.dispatch("timer/computeClockCount");
			}

			console.log(Store.getState().timer.clock);
		}, 1000);
	}

	private resumeCountIfOngoing() {
		const { isRunning } = Store.getState().timer.settings;
		if (isRunning) {
			Store.dispatch("timer/computeClockCount");
			const { minutes, seconds } = Store.getState().timer.clock;
			this.setClock(minutes, seconds);
			this.count();
		}
	}
}
