import { BackendApi } from "../../../BackendApi";

class MyBackendApi extends BackendApi {
    send() { }
}

describe('BackboneApi', () => {
    describe('call api signatures', () => {

        let url = 'foo/bar';
        let options = {};
        let syncFunc = () => {};
        let entity = {};
        let body = {};

        const methodsByType = {
            get: 'withoutBody',
            delete: 'withoutBody',
            post: 'withBody',
            put: 'withBody',
            patch: 'withBody'
        }

        const commonsIts = {
            all: {
                'must throw if no arguments provided'() {
                    expect(this.testetMethod).to.throw();
                },
                'must throw if first argument is not a string or an object'() {
                    expect(() => this.testetMethod(() => {})).to.throw();
                    expect(() => this.testetMethod(null)).to.throw();
                },
            },
            url: {
                'should not throw if only url was provided'() {                    
                    let spy = () => this.testetMethod(url);
                    expect(spy).to.not.throw();
                },
                'should throw if first and second arguments are strings'() {
                    let spy = () => this.testetMethod(url, url);
                    expect(spy).to.throw();
                },
                'should accept function as second argument'() {                    
                    expect(() => this.testetMethod(url, syncFunc)).to.not.throw();
                },
                'should accept object as second argument'() {                    
                    expect(() => this.testetMethod(url, options)).to.not.throw();
                },
                'should throw if second argument not fuction and not an object'() {
                    expect(() => this.testetMethod(url, 123)).to.throw();
                    expect(() => this.testetMethod(url, null)).to.throw();
                },
            },
            entity: {
                'should not throw if only entity was provided'() {                    
                    expect(() => this.testetMethod(entity)).to.not.throw();
                },
                'second argument can be a string, function or object, otherwise throw'() {
                    expect(() => this.testetMethod(entity, url)).to.not.throw();
                    expect(() => this.testetMethod(entity, syncFunc)).to.not.throw();
                    expect(() => this.testetMethod(entity, options || body)).to.not.throw();
                    expect(() => this.testetMethod(entity, null)).to.throw();
                    expect(() => this.testetMethod(entity, 123)).to.throw();
                },
            }
        }

        const asserts = {
            withBody: {

                // post(
                //  entity | url, 
                //  url | body | syncFn, 
                //  options | body | syncFn,
                //  options | syncFn,
                //  options
                // )

                url: {

                    // post(
                    //  url, 
                    //  body | syncFn, 
                    //  options | syncFn,
                    //  options
                    // )

                    ...commonsIts.url,

                    'third argument can be function or an object'() {
                        expect(() => this.testetMethod(url, body, options)).to.not.throw();
                        expect(() => this.testetMethod(url, body, syncFunc)).to.not.throw();
                        expect(() => this.testetMethod(url, syncFunc, options)).to.not.throw();                        
                    },
                    'fourth argument can be only an object if there sync and body prodived'() {

                        expect(() => this.testetMethod(url, body, syncFunc, options)).to.not.throw();

                        expect(() => this.testetMethod(url, body, options, options)).to.throw();
                        expect(() => this.testetMethod(url, syncFunc, options, options)).to.throw();

                    }

                },
                entity: {

                    // post(
                    //  entity, 
                    //  url | body | syncFn, 
                    //  options | body | syncFn,
                    //  options | syncFn,
                    //  options
                    // )  

                    ...commonsIts.entity,
                    'third argument can be an object or function'() {
                        expect(() => this.testetMethod(entity, body, options)).to.not.throw();
                        expect(() => this.testetMethod(entity, body, syncFunc)).to.not.throw();
                        expect(() => this.testetMethod(entity, url, body)).to.not.throw();

                        expect(() => this.testetMethod(entity, url, null)).to.throw();
                    },
                    'third argument can be an object if second was object too'() {
                        expect(() => this.testetMethod(entity, body, options)).to.not.throw();
                    },
                    'forth argument can be an object if third was an object too, but not second'() {

                        expect(() => this.testetMethod(entity, url, body, options)).to.not.throw();

                        expect(() => this.testetMethod(entity, body, body, options)).to.throw();
                    },
                    'fifth argument can be an object if all other arguments were provided'() {
                        expect(() => this.testetMethod(entity, url, body, syncFunc, options)).to.not.throw();

                        expect(() => this.testetMethod(entity, url, body, body, options)).to.throw();
                    }
                }
            },
            withoutBody: {
                url: {
                    ...commonsIts.url,
                    'third argument can be only an object and only if second one was a function'() {
                        expect(() => this.testetMethod(url, syncFunc, options)).to.not.throw();

                        expect(() => this.testetMethod(url, options, options)).to.throw();
                    }
                },
                entity: {
                    ...commonsIts.entity,
                    'third argument should accept only object or function'() {
                        expect(() => this.testetMethod(entity, url, syncFunc)).to.not.throw();
                        expect(() => this.testetMethod(entity, url, options)).to.not.throw();
                        expect(() => this.testetMethod(entity, syncFunc, options)).to.not.throw();
                    },
                    'should throw if second and third arguments are objects'() {
                        expect(() => this.testetMethod(entity, options, {})).to.throw();
                    }
                }
            }
        }

        beforeEach(function() {
            this.backend = new MyBackendApi();
        });

        describe('GET, DELETE, POST, PUT, PATCH', () => {

            Object.keys(methodsByType).forEach(method => {
                describe(method, () => {
                    let methodType = methodsByType[method];
                    let methodAsserts = asserts[methodType];

                    beforeEach(function() {
                        this.method = method;
                        this.testetMethod = this.backend[method].bind(this.backend);
                    });

                    //console.log(method);

                    Object.keys(commonsIts.all).forEach(itKey => {
                        //console.log('   ', itKey)
                        it(itKey, commonsIts.all[itKey]);
                    });

                    Object.keys(methodAsserts).forEach(describeItemKey => {
                        let describeHeader = 'when first argument is ' + describeItemKey;
                        describe(describeHeader, () => {
                            //console.log('   ', describeHeader)
                            let itItems = methodAsserts[describeItemKey];

                            Object.keys(itItems).forEach(itItemHeader => {
                                //console.log('       ', itItemHeader)
                                it(itItemHeader, itItems[itItemHeader]);
                            });
                        });
                    });
                });
            });

        });
    });
});
