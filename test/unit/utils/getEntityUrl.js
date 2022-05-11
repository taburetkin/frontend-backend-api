import { getEntityUrl } from "../../../utils";

describe('utils', () => {
    describe("getEntityUrl", () => {
        it('should not throw if entity is not provided', () => {
            expect(getEntityUrl).to.not.throw();
        });
        it('should return invoked value of object property "url" if its a function', () => {
            let obj = { 
                url() {
                    return 'bar';
                }
            };
            sandbox.spy(obj, 'url');

            let res = getEntityUrl(obj, 1, 2, 3);
            expect(res).to.be.equal('bar');
            expect(obj.url).to.be.calledOnceWithExactly(1,2,3).and.calledOn(obj);
        });
    });
});