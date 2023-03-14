import Slice from "../interfaces/Slice";
import State from "../interfaces/State";
import { Reducer } from "../interfaces/Types";
import Database from "../services/Database";

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

	static getSliceState(sliceName: string): State {
		return this.state[sliceName];
	}

	static dispatch(type: string, payload?: any): void {
		this.state = this.rootReducer(this.state, { type, payload });
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
		slices.forEach((slice) => {
			this.state[slice.name] = slice.initialState;
			Object.values(slice.reducers).forEach((r) => {
				reducers[`${slice.name}/${r.name}`] = r;
			});
		});

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
	private static notifyListeners(): void {
		this.listeners.forEach((l) => {
			l();
		});
	}
}
