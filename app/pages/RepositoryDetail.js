/**
 * RepositoryDetail
 * @flow
 **/
'use strict';

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
import FavoriteDao from '../expand/dao/FavoriteDao';

const TRENDING_URL = 'https://github.com/';
export default class RepositoryDetail extends Component {
    constructor(props) {
        super(props);
        let url = props.projectModel.item.html_url || TRENDING_URL + props.projectModel.item.fullName;
        let title = props.projectModel.item.full_name || props.projectModel.item.fullName;
        this.favoriteDao = new FavoriteDao(this.props.flag);
        this.state = {
            url: url,
            canGoBack: false,
            title: title,
            isFavorite: this.props.projectModel.isFavorite,
            favoriteIcon: this.props.projectModel.isFavorite ? require('../../res/images/ic_star.png') : require('../../res/images/ic_star_navbar.png')
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
    _setFavoriteState(isFavorite) {
        this.setState({
            isFavorite: isFavorite,
            favoriteIcon: isFavorite ? require('../../res/images/ic_star.png') : require('../../res/images/ic_star_navbar.png')
        })
    }

    _onRightButtonClick() {//favoriteIcon单击回调函数
        let projectModel = this.props.projectModel;
        this._setFavoriteState(projectModel.isFavorite = !projectModel.isFavorite);
        let key = projectModel.item.fullName ? projectModel.item.fullName : projectModel.item.id.toString();
        if (projectModel.isFavorite) {
            this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel.item));
        } else {
            this.favoriteDao.removeFavoriteItem(key);
        }
    }

    _renderRightButton() {
        return (<View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={()=>this._onRightButtonClick()}>
                    <Image
                        style={{width: 20, height: 20, marginRight: 10}}
                        source={this.state.favoriteIcon}/>
                </TouchableOpacity>
            </View>
        )
    }
    render() {
        let titleLayoutStyle = this.state.title.length > 20 ? {paddingRight: 30} : null;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={this.state.title}
                    style={{backgroundColor: '#2196f3'}}
                    leftButton={ViewUtils.renderLeftButton(() => this._onBack())}
                    rightButton={this._renderRightButton()}
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
