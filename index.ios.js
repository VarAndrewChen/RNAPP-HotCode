/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Navigator,
    ListView
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import Boy from './app/component/Boy';
import ListViewTest from './app/component/ListViewTest';
import FetchTest from './app/component/Fetch';


export default class HotCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'tb_popular'
        };
    }

    render() {
        return (
            <View style={styles.container}>
                {/* <TabNavigator>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tb_popular'}
                        title="最热"
                        selectedTitleStyle={{color:'red'}}
                        renderIcon={() => <Image style={styles.icon} source={require('./res/images/ic_polular.png')}/>}
                        renderSelectedIcon={() => <Image style={[styles.icon,{tintColor:'red'}]} source={require('./res/images/ic_polular.png')}/>}
                        badgeText="1"
                        onPress={() => this.setState({selectedTab: 'tb_popular'})}>
                        <View style={styles.page_one}></View>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tb_trending'}
                        title="趋势"
                        selectedTitleStyle={{color:'red'}}
                        renderIcon={() => <Image style={styles.icon} source={require('./res/images/ic_trending.png')}/>}
                        renderSelectedIcon={() => <Image style={[styles.icon,{tintColor:'red'}]} source={require('./res/images/ic_trending.png')}/>}
                        onPress={() => this.setState({selectedTab: 'tb_trending'})}>
                        <View style={styles.page_two}></View>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tb_favorite'}
                        title="收藏"
                        selectedTitleStyle={{color:'red'}}
                        renderIcon={() => <Image style={styles.icon} source={require('./res/images/ic_polular.png')}/>}
                        renderSelectedIcon={() => <Image style={[styles.icon,{tintColor:'red'}]} source={require('./res/images/ic_polular.png')}/>}
                        badgeText="1"
                        onPress={() => this.setState({selectedTab: 'tb_favorite'})}>
                        <View style={styles.page_one}></View>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tb_mine'}
                        title="我的"
                        selectedTitleStyle={{color:'red'}}
                        renderIcon={() => <Image style={styles.icon} source={require('./res/images/ic_trending.png')}/>}
                        renderSelectedIcon={() => <Image style={[styles.icon,{tintColor:'red'}]} source={require('./res/images/ic_trending.png')}/>}
                        onPress={() => this.setState({selectedTab: 'tb_mine'})}>
                        <View style={styles.page_two}></View>
                    </TabNavigator.Item>
                </TabNavigator>
                <Navigator
                    initialRoute={{
                        component: Boy
                    }}
                    renderScene={(route,navigator) => {
                        let Component = route.component;
                        return (<Component navigator={navigator} {...route.params}/>);
                    }}>
                </Navigator>
                <ListViewTest/>*/}
                <FetchTest/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF'
    },
    page_one: {
        flex: 1,
        backgroundColor: 'red'
    },
    page_two: {
        flex: 1,
        backgroundColor: 'green'
    },
    icon: {
        width: 22,
        height: 22
    }
});

AppRegistry.registerComponent('HotCode', () => HotCode);
