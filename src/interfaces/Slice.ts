import { Reducer } from "./Types";

export default interface Slice<T> {
	name: string;
	initialState: T;
	reducers: {
		[key: string]: Reducer<T>;
	};
}
