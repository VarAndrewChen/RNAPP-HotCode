/**
 * RepositoryDetail
 * @flow
 **/
'use strict'

import React, {Component} from 'react'
import {
    Image,
    ScrollView,
    StyleSheet,
    WebView,
    Platform,
    TouchableOpacity,
    Text,
    View,
} from 'react-native'
import NavigationBar from '../components/NavigationBar';
import ViewUtils from '../utils/ViewUtils';

const TRENDING_URL = 'https://github.com/';
export default class RepositoryDetail extends Component {
    constructor(props) {
        super(props);
        let url = props.item.html_url || TRENDING_URL + props.item.fullName;
        let title = props.item.full_name || props.item.fullName;
        this.state = {
            url: url,
            canGoBack: false,
            title: title
        }
    }

    _onBack() {
        if (this.state.canGoBack) {
            this.webView.goBack();
        } else {
            this.props.navigator.pop();
        }
    }

    _onNavigationStateChange(e) {
        this.setState({
            canGoBack: e.canGoBack,
            url: e.url
        })
    }

    render() {
        let titleLayoutStyle = this.state.title.length > 20 ? {paddingRight: 30} : null;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={this.state.title}
                    style={{backgroundColor: '#6495ed'}}
                    leftButton={ViewUtils.renderLeftButton(() => this._onBack())}
                />
                <WebView
                    ref={webView => this.webView = webView}
                    startInLoadingState={true}
                    onNavigationStateChange={(e) => this._onNavigationStateChange(e)}
                    source={{uri: this.state.url}}/>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
});
