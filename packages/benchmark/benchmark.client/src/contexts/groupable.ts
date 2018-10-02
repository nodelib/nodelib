import Group from '../group';

export default abstract class Groupable {
	public abstract get group(): Group | undefined;
	public abstract set group(value: Group | undefined);
}
