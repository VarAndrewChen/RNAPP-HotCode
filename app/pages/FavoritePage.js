/**
 * PopularPage
 * @flow
 **/
'use strict';

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    RefreshControl,
    DeviceEventEmitter
} from 'react-native';
import NavigationBar from '../components/NavigationBar';
import DataRepository, {FLAG_STORAGE} from '../expand/dao/DataRepository';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import RepositoryCell from '../components/RepositoryCell';
import TrendingCell from  '../components/TrendingCell';
import FavoriteDao from '../expand/dao/FavoriteDao';
import ProjectModel from  '../model/ProjectModel';
import Utils from '../utils/Utils';
import ActionUtils from  '../utils/ActionUtils';

export default class FavoritePage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let navigationBar = <NavigationBar
            title={'收藏'}
            statusBar={{
                backgroundColor: '#2196f3'
            }}
        />;
        let content =
            (<ScrollableTabView
                tabBarBackgroundColor="#2196f3"
                tabBarActiveTextColor="white"
                tabBarInactiveTextColor="mintcream"
                tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
                renderTabBar={() => <ScrollableTabBar/>}
            >
                <FavoriteTab tabLabel='最热' {...this.props} flag={FLAG_STORAGE.flag_popular}/>
                <FavoriteTab tabLabel='趋势' {...this.props} flag={FLAG_STORAGE.flag_trending}/>
            </ScrollableTabView>);
        return (
            <View style={styles.container}>
                {navigationBar}
                {content}
            </View>
        )
    }
}
class FavoriteTab extends Component {
    constructor(props) {
        super(props);
        this.favoriteDao = new FavoriteDao(this.props.flag);
        this.state = {
            result: '',
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            isLoading: false,
            favoriteKeys: []
        };
    }

    componentDidMount() {
        this._loadData(false)
    }

    _getDataSource(items) {
        return this.state.dataSource.cloneWithRows(items);
    }

    _loadData(isShowLoading) {
        if (isShowLoading)
            this.setState({
                isLoading: true,
            });
        this.favoriteDao.getAllItems().then((items)=> {
            var resultData = [];
            for (var i = 0, len = items.length; i < len; i++) {
                resultData.push(new ProjectModel(items[i], true));
            }
            this.setState({
                isLoading: false,
                dataSource: this._getDataSource(resultData),
            });
        }).catch((error)=> {
            this.setState({
                isLoading: false,
            });
        });
    }


    _renderRow(projectModel) {
        console.log(projectModel);
        if (projectModel) {
            let CellComponent = this.props.flag === FLAG_STORAGE.flag_popular ? RepositoryCell : TrendingCell;
            let popularData = {};
            let trendingData = {};
            if(projectModel.item.owner) popularData = Object.assign({},projectModel);
            else trendingData = Object.assign({},projectModel);
            return (<CellComponent
                key={this.props.flag === FLAG_STORAGE.flag_popular ? projectModel.item.id : projectModel.item.fullName}
                projectModel={this.props.flag === FLAG_STORAGE.flag_popular ? popularData :trendingData}
                isFavorite={true}
                onSelect={() => ActionUtils.onSelectRepository({
                    projectModel: projectModel,
                    flag: this.props.flag,
                    ...this.props
                })}
                onFavorite={(item, isFavorite) => ActionUtils.onFavorite((this.favoriteDao, item, isFavorite, this.props.flag))}
            />)
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(e) => this._renderRow(e)}
                    enableEmptySections={true}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isLoading}
                            onRefresh={() => {
                                this._loadData()
                            }}
                            colors={['#2196f3']}
                            tinColor={['#2196f3']}
                            title={'Loading'}
                            titleColor={'#2196f3'}
                        />
                    }
                />
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