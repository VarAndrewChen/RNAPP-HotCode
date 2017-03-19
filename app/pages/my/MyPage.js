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
                        params: {...this.props}
                    })}}
                    style={styles.tips}
                >自定义标签</Text>
                <Text
                    onPress={() => {this.props.navigator.push({
                        component: SortKeyPage,
                        params: {...this.props}
                    })}}
                    style={styles.tips}
                >标签排序</Text>
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