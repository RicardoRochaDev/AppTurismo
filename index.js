

/**
 * @format
 */


import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

global.direccionIP= '192.168.1.37'


AppRegistry.registerComponent(appName, () => App);

