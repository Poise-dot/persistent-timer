import Action from "./Action";

export type Reducer<T> = (state: T, action: Action) => T;

export type Button = HTMLButtonElement;
export type Div = HTMLDivElement;
export type Input = HTMLInputElement;
export type Select = HTMLSelectElement;
