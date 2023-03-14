import Slice from "../interfaces/Slice";
import State from "../interfaces/State";
import { Reducer } from "../interfaces/Types";

export default class Store {
	private static state: State = {};
	private static listeners: (() => any)[] = [];
	private static rootReducer: Reducer<State>;

	static createStore(properties: { slices: Slice<any>[] }) {
		const reducers = this.addSlices(properties.slices);
		this.rootReducer = this.combineReducers(reducers);
	}

	static getState(): State {
		return this.state;
	}

	static dispatch(type: string, payload?: any): void {
		this.state = this.rootReducer(this.state, { type, payload });
		this.persistState();
		this.notifyListeners();
	}

	static subscribe(listener: () => void): () => void {
		this.listeners.push(listener);
		return () => {
			this.listeners.splice(this.listeners.indexOf(listener), 1);
		};
	}

	private static addSlices(
		slices: Slice<any>[]
	): Record<string, Reducer<any>> {
		const reducers: Record<string, Reducer<any>> = {};
		const state: State | null = this.loadState();

		if (!state) {
			slices.forEach((slice) => {
				this.state[slice.name] = slice.initialState;
				Object.values(slice.reducers).forEach((r) => {
					reducers[`${slice.name}/${r.name}`] = r;
				});
			});
		} else {
			this.state = state;

			slices.forEach((slice) => {
				Object.values(slice.reducers).forEach((r) => {
					reducers[`${slice.name}/${r.name}`] = r;
				});
			});
		}

		return reducers;
	}
	private static combineReducers(
		reducers: Record<string, Reducer<any>>
	): Reducer<State> {
		const rootReducer: Reducer<State> = (state, action) => {
			const sliceName = action.type.split("/")[0];
			const sliceState = state[sliceName];
			const reducer = reducers[action.type];

			return { ...state, [sliceName]: reducer(sliceState, action) };
		};

		return rootReducer;
	}
	private static persistState(): void {
		const serializedState = JSON.stringify(this.state);
		localStorage.setItem("state", serializedState);
	}
	private static loadState(): State | null {
		const serializedState = localStorage.getItem("state");

		if (!serializedState) {
			return null;
		} else {
			return JSON.parse(serializedState) as State;
		}
	}
	private static notifyListeners(): void {
		this.listeners.forEach((l) => {
			l();
		});
	}
}
