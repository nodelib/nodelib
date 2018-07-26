import Group from './group';
import Hook from './hook';
import Race from './race';

export default abstract class Visitor {
	public abstract visitGroup(group: Group): void;
	public abstract visitHook(hook: Hook): void;
	public abstract visitRace(race: Race): void;
}
