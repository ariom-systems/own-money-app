/**
 * @format
 */

const isAndroid = require('react-native').Platform.OS === 'android';
const isHermesEnabled = !!global.HermesInternal;

if (isHermesEnabled || isAndroid) {
	require('@formatjs/intl-getcanonicallocales/polyfill');
	require('@formatjs/intl-locale/polyfill');

	require('@formatjs/intl-pluralrules/polyfill');
	require('@formatjs/intl-pluralrules/locale-data/en.js');
	require('@formatjs/intl-pluralrules/locale-data/th.js');

	require('@formatjs/intl-numberformat/polyfill');
	require('@formatjs/intl-numberformat/locale-data/en.js');
	require('@formatjs/intl-numberformat/locale-data/th.js');
}

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
