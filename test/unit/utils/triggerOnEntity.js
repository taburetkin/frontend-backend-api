import { triggerOnEntity } from "../../../utils.js";

describe('utils', () => {
    describe('triggerOnEntity', () => {
        it('should not throw if no entity', () => {
            expect(triggerOnEntity).to.not.throw();
        });
    });
});