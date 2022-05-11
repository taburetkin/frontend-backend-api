import { expect } from "chai";
import { triggerOnEntity } from "../../../utils.js";

describe('utils', () => {
    describe('triggerOnEntity', () => {
        it('should not throw if no entity', () => {
            expect(triggerOnEntity).to.not.throw();
        });
        it('should not throw if entity has no trigger or triggerMethod methods', () => {
            expect(triggerOnEntity.bind(null, {})).to.not.throw();
            expect(triggerOnEntity.bind(null, { trigger: true })).to.not.throw();
            expect(triggerOnEntity.bind(null, { triggerMethod: true, trigger: true })).to.not.throw();
        });
        describe('calling method', function() {
            let trigger;
            let triggerMethod;
            beforeEach(() => {
                trigger = sandbox.spy();
                triggerMethod = sandbox.spy();
            });
            it('should call triggerMethod at first if it exist', () => {
                let entity = { trigger, triggerMethod };
                triggerOnEntity(entity, 'foo', 1,2,3);
                expect(triggerMethod).be.calledOnceWith('foo', 1,2,3);
                expect(trigger).be.not.called;
            });
            it('should call trigger if it exist', () => {
                let entity = { trigger, triggerMethod: true };
                triggerOnEntity(entity, 'foo', 1,2,3);
                expect(trigger).be.calledOnceWith('foo', 1,2,3);
                expect(triggerMethod).be.not.called;
            });
        });
    });
});