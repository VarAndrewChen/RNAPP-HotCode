/**
 * HomePage
 * @flow
 **/
'use strict';

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Navigator,
    DeviceEventEmitter
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import PopularPage from './PopularPage';
import FavoritePage from './FavoritePage';
import MyPage from './my/MyPage';
import Toast, {DURATION}from "react-native-easy-toast";
import TrendingPage from "./TrendingPage";
import ListViewTest from '../components/ListViewTest';
export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'tb_popular'
        };
    }

    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener('showToast', (text) => {
            this.toast.show(text, DURATION.LENGTH_LONG);
        })
    }

    componentWillUnmount() {
        this.listener && this.listener.remove();
    }
    _renderTab(Component,selectTab,title,renderIcon) {
        return(
            <TabNavigator.Item
                selected={this.state.selectedTab === selectTab}
                title={title}
                selectedTitleStyle={{color: '#2196f3'}}
                renderIcon={() => <Image style={styles.icon}
                                         source={renderIcon}/>}
                renderSelectedIcon={() => <Image style={[styles.icon, {tintColor: '#2196f3'}]}
                                                 source={renderIcon}/>}
                onPress={() => this.setState({selectedTab: selectTab})}>
                <Component {...this.props} />
            </TabNavigator.Item>
        )
    }
    render() {
        return (
            <View style={styles.container}>
                <TabNavigator>
                    {this._renderTab(PopularPage,'tb_popular',"最热",require('../../res/images/ic_polular.png'))}
                    {this._renderTab(TrendingPage,'tb_trending',"趋势",require('../../res/images/ic_trending.png'))}
                    {this._renderTab(FavoritePage,'tb_favourite',"收藏",require('../../res/images/ic_favorite.png'))}
                    {this._renderTab(MyPage,'tb_mine',"我的",require('../../res/images/ic_my.png'))}
                </TabNavigator>
                <Toast ref={toast => this.toast = toast}/>
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

