import { BackendApi } from "../../../BackendApi";

describe('BackendApi', () => {
    describe('fetch based', () => {
        it('should not throw at construct time if no arguments provided', () => {
            expect(() => new BackendApi()).to.not.throw;
        });
    });
});