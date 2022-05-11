// const chai = require('chai');
// const sinon = require('sinon');
// const sinonChai = require('sinon-chai');
// //const chaiPromise = require('chai-as-promised');

// //chai.use(chaiPromise);
// chai.use(sinonChai);

// global.chai = chai;
// global.sinon = sinon;
// global.expect = chai.expect;

//const chai = require('chai');
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

global.expect = chai.expect;
global.sinon = sinon;

beforeEach(function() {
    global.sandbox = sinon.createSandbox();
});

afterEach(function() {
    global.sandbox.restore();
});