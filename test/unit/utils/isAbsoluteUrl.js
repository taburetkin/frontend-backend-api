import { isAbsoluteUrl } from "../../../utils";

describe('utils', () => {
    describe('isAbsoluteUrl', () => {
        it('should return true if url starts with http://', () => {
            let res = isAbsoluteUrl('http://blablala');
            expect(res).to.be.equal(true);
        });
        it('should return true if url starts with https://', () => {
            let res = isAbsoluteUrl('https://blablala');
            expect(res).to.be.equal(true);
        });
        it('should return fals if url starts with http', () => {
            let res = isAbsoluteUrl('httpblablala');
            expect(res).to.be.equal(false);
        });
    });
});