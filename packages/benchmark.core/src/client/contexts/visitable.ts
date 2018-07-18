import Visitor from '../visitor';

export default abstract class Visitable {
	public abstract accept(visitor: Visitor): void;
}
