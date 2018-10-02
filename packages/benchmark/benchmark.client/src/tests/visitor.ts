/**
 * @fileoverview
 * Auxiliary structures for testing visitable classes.
 */

import * as sinon from 'sinon';

import { Visitor } from '../contexts/visitable';

import Group from '../group';
import Hook from '../hook';
import Race from '../race';

export class TestVisitor implements Visitor {
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
