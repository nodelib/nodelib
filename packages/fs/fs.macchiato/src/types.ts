export type PrepareOptionsFromClass<T> = {
	[TKey in NonFunctionPropertyNames<T>]?: T[TKey];
};

type NonFunctionPropertyNames<T> = {
	[TKey in keyof T]: T[TKey] extends () => unknown ? never : TKey;
}[keyof T];
