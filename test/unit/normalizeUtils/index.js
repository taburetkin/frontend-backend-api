import { normalize, withBodyArguments, withoutBodyArguments } from "../../../normalizeUtils";

describe('nonrmalizeUtils', () => {

    describe('normalize', () => {
        let options;
        beforeEach(() => {
            options = {};
            sandbox.spy(withBodyArguments);
            sandbox.spy(withoutBodyArguments);
        });
        it('should return provided options', () => {
            
            let res = normalize([], options, []);
            expect(res).to.be.equal(options);
        });
        it('should not do more runs than needed', () => {
            
            let runners = withBodyArguments;
            normalize(runners, options, ['foo']);
            expect(runners[0]).to.be.calledOnce;
            expect(runners[1]).to.be.not.called;
            expect(runners[2]).to.be.not.called;
        });
        it('should call all withBodyArguments runers only once if arguments length is greater', () => {
            let args = [{}, 'foo', {}, () => {}, {}, 1, 2, 3];
            let runners = withBodyArguments;
            normalize(runners, options, args);

            for(let runnerNumber = 0; runnerNumber < withBodyArguments.length; runnerNumber++)
                expect(runners[runnerNumber]).to.be.calledOnce;

        });
        it('should call all withoutBodyArguments runers only once if arguments length is greater', () => {
            let args = [{}, 'foo', () => {}, {}, 1, 2, 3];
            let runners = withoutBodyArguments;
            normalize(runners, options, args);

            for(let runnerNumber = 0; runnerNumber < withoutBodyArguments.length; runnerNumber++)
                expect(runners[runnerNumber]).to.be.calledOnce;

        });
    });
    describe('withBodyArguments runners', function() {
        beforeEach(() => {
            sandbox.spy(withBodyArguments)
        });
    })
});