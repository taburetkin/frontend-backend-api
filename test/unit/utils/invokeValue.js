import { invokeValue } from "../../../utils";

describe('utils', () => {
    describe('invokeValue', () => {
        it('should invoke with given context and arguments', () => {
            let spy = sandbox.spy();
            let context = {};
            invokeValue(spy, context, 1,2,3);
            expect(spy).to.be.calledOnceWithExactly(1,2,3).and.calledOn(context);
        });
        it('should return invoked value', () => {
            let res = invokeValue(() => "bla-blabla");
            expect(res).to.be.equal("bla-blabla");
        });
        it('should return provided value if its not a function', () => {
            let res = invokeValue("bla-blabla");
            expect(res).to.be.equal("bla-blabla");
        });
    });
});