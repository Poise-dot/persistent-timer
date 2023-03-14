import TimerSettings from "../interfaces/TimerSettings";
import { Div, Input, Select } from "../interfaces/Types";
import timerSlice from "../store/slices/timer-slice";
import Store from "../store/Store";

export default class Timer {
	public elements: Record<string, any>;

	constructor() {
		this.elements = this.createElements();
		this.setupEventListeners();
	}

	private createElements(): Record<string, any> {
		const timer: Div = document.createElement("div");
		timer.className = "timer";
		timer.innerHTML = `
		<div className="timer-clock">
			<div className="timer-minutes">
				minutes
			</div>
			<div className="timer-seconds">
				seconds
			</div>
		</div>
		<div className="timer-inputs">
			<label> Target time:
				<input
					class="timer-input"
					type="number"
					value="0"
					min="0"
					title="target time"
				/>
			</label>
			<select class="timer-select-isCountingUp" title="Count up or down?">
				<option value="false">Down</option>
				<option value="true">Up</option>
			</select>
			<button class="timer-start-btn" type="button">Start</button>
		</div>
		
		`;

		const elements = {
			root: timer,
			minutes: timer.querySelector(".timer-minutes"),
			seconds: timer.querySelector(".timer-seconds"),
			input: timer.querySelector(".timer-input"),
			select: timer.querySelector(".timer-select-isCountingUp"),
			btnStart: timer.querySelector(".timer-start-btn"),
		};

		return elements;
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
	}
}
