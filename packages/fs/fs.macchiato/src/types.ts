export type PrepareOptionsFromClass<T> = {
	[P in keyof T]?: UnboxReturnTypeFromClassItem<T[P]>;
};

export type UnboxReturnTypeFromClassItem<T> =
	/**
	 * Unbox return type from class method.
	 */
	T extends (...args: Array<unknown>) => infer U ? U :
	/**
	 * Unbox return type from class property.
	 */
	T extends (infer U) ? U :
	/**
	 * Default branch. Potentially impossible case.
	 */
	T;
