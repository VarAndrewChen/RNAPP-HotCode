import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Navigator
} from 'react-native';
import WelcomePage from './WelcomePage';

 function setup() {
    class Root extends Component {
        render() {
            return (
                <Navigator
                    initialRoute={{component:WelcomePage}}
                    renderScene={(route,navigator) =>{
                        let Component =route.component;
                        return <Component {...route.params} navigator={navigator}/>
                    }}
                />
            )
        }
    }
    return <Root/>
}
module.exports = setup;