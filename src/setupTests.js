import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import 'jest-enzyme';

const util = require('util')
util.inspect.defaultOptions.maxArrayLength = null; 
util.inspect.defaultOptions.depth = null; 