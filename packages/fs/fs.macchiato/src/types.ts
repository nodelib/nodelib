export type PrepareOptionsFromClass<T> = {
	[TKey in keyof T]?: UnboxReturnTypeFromClassItem<T[TKey]>;
};

export type UnboxReturnTypeFromClassItem<T> =
	/**
	 * Unbox return type from class method.
	 */
	T extends (...args: unknown[]) => infer TReturnType ? TReturnType :
		/**
		 * Unbox return type from class property.
		 */
		T extends (infer TReturnType) ? TReturnType :
			/**
			 * Default branch. Potentially impossible case.
			 */
			T;
