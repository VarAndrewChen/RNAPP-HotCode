/**
 * MyPage
 * @flow
 **/
'use strict'


import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView
} from 'react-native';
import NavigationBar from '../../components/NavigationBar';
import CustomKeyPage from './CustomKeyPage';
import SortKeyPage from './SortKeyPage';
import {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao';

export default class MyPage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title='我的'
                    statusBar={{
                        backgroundColor: '#2196f3'
                    }}
                />
                <Text
                    onPress={() => {this.props.navigator.push({
                        component: CustomKeyPage,
                        params: {
                            ...this.props,
                            flag:FLAG_LANGUAGE.flag_key
                        }
                    })}}
                    style={styles.tips}
                >自定义标签</Text>
                <Text
                    onPress={() => {this.props.navigator.push({
                        component: CustomKeyPage,
                        params: {
                            ...this.props,
                            flag:FLAG_LANGUAGE.flag_language
                        }
                    })}}
                    style={styles.tips}
                >自定义语言</Text>
                <Text
                    onPress={() => {this.props.navigator.push({
                        component: SortKeyPage,
                        params: {
                            ...this.props,
                            flag:FLAG_LANGUAGE.flag_key
                        }
                    })}}
                    style={styles.tips}
                >标签排序</Text>
                <Text
                    onPress={() => {this.props.navigator.push({
                        component: SortKeyPage,
                        params: {
                            ...this.props,
                            flag:FLAG_LANGUAGE.flag_language
                        }
                    })}}
                    style={styles.tips}
                >语言排序</Text>
                <Text
                    onPress={() => {this.props.navigator.push({
                        component: CustomKeyPage,
                        params: {
                            ...this.props,
                            isRemoveKey: true
                        }
                    })}}
                    style={styles.tips}
                >标签移除</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tips: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    }
});