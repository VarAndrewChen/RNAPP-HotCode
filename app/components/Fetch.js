import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import NavigationBar from './NavigationBar';
import HttpUtils from './../utils/HttpUtils';
export default class FetchTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: ''
        }
    }

    _onload(url) {
        return HttpUtils.get(url)
            .then((responseJson) => {
                this.setState({
                    result: JSON.stringify(responseJson)
                })
            })
            .catch((error) => {
                this.setState({
                    result: JSON.stringify(error)
                })
            });
    }

    _onSubmit(url, option) {
        return HttpUtils.post(url,option)
            .then((responseJson) => {
                this.setState({
                    result: JSON.stringify(responseJson)
                })
            })
            .catch((error) => {
                this.setState({
                    result: JSON.stringify(error)
                })
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title='FetchTest'
                />
                <Text
                    style={styles.text}
                    onPress={() => {
                        this._onload('http://rap.taobao.org/mockjsdata/15251/api/test')
                    }}
                >获取数据</Text>
                <Text
                    style={styles.text}
                    onPress={() => {
                        this._onSubmit('http://rap.taobao.org/mockjsdata/15251/api/login', {
                            username: 'easyCode',
                            password: '123'
                        })
                    }}
                >提交数据</Text>
                <Text>{this.state.result ? `获得结果:${this.state.result}` : null}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    text: {
        fontSize: 20
    },
    wrap: {
        height: 50
    },
    tips: {
        fontSize: 18
    },
    line: {
        height: 1,
        backgroundColor: 'black'
    }
});