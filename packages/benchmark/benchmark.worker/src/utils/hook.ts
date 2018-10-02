import { Hook, NSHook } from '@nodelib/benchmark.client';

/**
 * Returns true if hook must be applyed for each nested group.
 */
export function isNestedHook(hook: Hook): boolean {
	const hooks: NSHook.Type[] = [
		NSHook.Type.BeforeEach,
		NSHook.Type.BeforeEachIteration,
		NSHook.Type.AfterEach,
		NSHook.Type.AfterEachIteration
	];

	return hooks.indexOf(hook.type) !== -1;
}

/**
 * Returns hooks with specified types.
 */
export function getHooksWithTypes(hooks: Hook[], types: NSHook.Type[]): Hook[] {
	return hooks.filter((hook) => types.indexOf(hook.type) !== -1);
}
