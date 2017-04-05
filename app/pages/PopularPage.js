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
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import FavoriteDao from '../expand/dao/FavoriteDao';
import ProjectModel from  '../model/ProjectModel';
import Utils from '../utils/Utils';
import ActionUtils from  '../utils/ActionUtils';

//api: https://api.github.com/search/repositories?q=ios&sort=stars
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

export default class PopularPage extends Component {
    constructor(props) {
        super(props);
        this.languageDao = LanguageDao.init(FLAG_LANGUAGE.flag_key);
        this.state = {
            languages: []
        };
    }

    componentDidMount() {
        this._loadData();
    }

    _loadData() {
        this.languageDao.fetch()
            .then(result => {
                this.setState({
                    languages: result
                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    render() {
        let content = this.state.languages.length > 0
            ? (<ScrollableTabView
                tabBarBackgroundColor="#2196f3"
                tabBarActiveTextColor="white"
                tabBarInactiveTextColor="mintcream"
                tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
                renderTabBar={() => <ScrollableTabBar/>}
            >
                {this.state.languages.map((v, i) => (v.checked ?
                    <PopularTab key={i} tabLabel={v.name} {...this.props}/> : null))}
            </ScrollableTabView>)
            : null;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'最热'}
                    statusBar={{
                        backgroundColor: '#2196f3'
                    }}
                />
                {content}
            </View>
        )
    }
}
class PopularTab extends Component {
    constructor(props) {
        super(props);
        this.dataRepository = new DataRepository(FLAG_STORAGE.flag_popular);
        this.state = {
            result: '',
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            isLoading: false,
            favoriteKeys: []
        };
    }

    componentDidMount() {
        this._loadData()
    }

    /***
     * 更新ProjectItems的Favorite状态
     * @param items
     * @private
     */
    _flushFavoriteState(items) {
        if (items) {
            let projectModels = [];
            items.map(v => {
                projectModels.push(new ProjectModel(v, Utils.checkFavorite(v,this.state.favoriteKeys)));
            });
            this.setState({
                isLoading: false,
                dataSource: this._getDataSource(projectModels)
            })
        }
    }

    /***
     * 获取本地用户收藏的ProjectItems
     * @param items
     * @private
     */
    _getFavoriteKeys(items) {
        favoriteDao.getFavoriteKeys()
            .then(keys => {
                if (keys){
                    this.setState({favoriteKeys: keys});
                }
                this._flushFavoriteState(items);
            })
            .catch(e => {
                this._flushFavoriteState(items);
            })
    }

    _getDataSource(items) {
        return this.state.dataSource.cloneWithRows(items);
    }

    _loadData() {
        this.setState({
            isLoading: true
        });
        let url = this._genFetchUrl(this.props.tabLabel);
        this.dataRepository.fetchRepository(url)
            .then(result => {
                let items = result && result.items ? result.items : result ? result : [];
                this._getFavoriteKeys(items);
                if (result && result.update_data && !this.dataRepository.checkDate(result.update_data)) {
                    return this.dataRepository.fetchNetRepository(url);
                }
            })
            .then(items => {
                if (!items || items.length === 0) return;
                this._getFavoriteKeys(items);
            })
            .catch(error => this.setState({
                result: JSON.stringify(error),
                isLoading: false
            }));
    }


    _genFetchUrl(key) {
        return URL + key + QUERY_STR;
    }

    _renderRow(projectModel) {
        if (projectModel) {
            return <RepositoryCell
                key={projectModel.item.id}
                projectModel={projectModel}
                onSelect={() => ActionUtils.onSelectRepository({
                    projectModel: projectModel,
                    flag: FLAG_STORAGE.flag_popular,
                    ...this.props
                })}
                onFavorite={(item, isFavorite) => ActionUtils.onFavorite(favoriteDao,item, isFavorite)}
            />
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) => this._renderRow(rowData)}
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