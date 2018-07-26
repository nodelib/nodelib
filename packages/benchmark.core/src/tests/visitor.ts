/**
 * @fileoverview
 * Auxiliary structures for testing (@see {@link Visititor}).
 */

import * as sinon from 'sinon';

import Group from '../client/group';
import Hook from '../client/hook';
import Race from '../client/race';
import Visitor from '../client/visitor';

export default class TestVisitor implements Visitor {
	public readonly visitGroupStub: sinon.SinonStub = sinon.stub();
	public readonly visitHookStub: sinon.SinonStub = sinon.stub();
	public readonly visitRaceStub: sinon.SinonStub = sinon.stub();

	public visitGroup(ctx: Group): void {
		this.visitGroupStub(ctx);
	}

	public visitHook(ctx: Hook): void {
		this.visitHookStub(ctx);
	}

	public visitRace(ctx: Race): void {
		this.visitRaceStub(ctx);
	}
}
