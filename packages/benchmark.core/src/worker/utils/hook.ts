import Hook, { HookType } from '../../client/hook';

/**
 * Returns hooks with specified types.
 */
export function getHooksWithTypes(hooks: Hook[], types: HookType[]): Hook[] {
	return hooks.filter((hook) => types.indexOf(hook.type) !== -1);
}

/**
 * Returns true if hook must be applyed for each nested group.
 */
export function isNestedHook(hook: Hook): boolean {
	const types = [
		HookType.BeforeEach,
		HookType.BeforeEachIteration,
		HookType.AfterEach,
		HookType.AfterEachIteration
	];

	return types.indexOf(hook.type) !== -1;
}
