import { invokeProperty } from "../../../utils";

describe('utils', () => {

    describe("invokeProperty", () => {
        it('should not throw if object is nullable or not an object', () => {
            expect(invokeProperty.bind(null)).to.not.throw();
            expect(invokeProperty.bind(null, null)).to.not.throw();
            expect(invokeProperty.bind(null, undefined)).to.not.throw();
            expect(invokeProperty.bind(null, () => {})).to.not.throw();
            expect(invokeProperty.bind(null, "foo")).to.not.throw();
        });
        it('should return object value if its not a function', () => {
            let obj = { foo: 'bar' };
            let res = invokeProperty(obj, 'foo');
            expect(res).to.be.equal(obj.foo);
        });
        it('should return invoke value of object property if its a function', () => {
            let obj = { 
                foo() {
                    return 'bar';
                }
            };
            sandbox.spy(obj, 'foo');

            let res = invokeProperty(obj, 'foo', 1, 2, 3);
            expect(res).to.be.equal('bar');
            expect(obj.foo).to.be.calledOnceWithExactly(1,2,3).and.calledOn(obj);
        });
    });
});