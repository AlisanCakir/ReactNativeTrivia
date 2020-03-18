import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import {Navigation} from 'react-native-navigation';

import App from './App';

Navigation.registerComponent('App',()=>App)

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
        stack: {
            id:'AppStack',
            children:[{
                component:{
                    name:'App',
                }
            }
            ]
        }
    },
  });
});
