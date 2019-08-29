/* eslint-disable */
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import 'jest-enzyme';

configure({ adapter: new Adapter() });

const util = require('util');

util.inspect.defaultOptions.maxArrayLength = null;
util.inspect.defaultOptions.depth = null;

global.MutationObserver = class {
  constructor(callback) {}

  disconnect() {}

  observe(element, initObject) {}
};

jest.mock('popper.js', () => {
  const PopperJS = jest.requireActual('popper.js');

  class Popper {
    constructor() {
      return {
        destroy: () => {},
        scheduleUpdate: () => {},
      };
    }
  }

  Popper.placements = PopperJS.placements;

  return Popper;
});
