/**
 * PopularPage
 * @flow
 **/
'use strict'

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
import DataRepository from '../expand/dao/DataRepository';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import RepositoryCell from '../components/RepositoryCell';
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import RepositoryDetail from './RepositoryDetail';

//api: https://api.github.com/search/repositories?q=ios&sort=stars
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';


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
                {this.state.languages.map((v, i) => (v.checked ? <PopularTab key={i} tabLabel={v.name} {...this.props}/> : null))}
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
        this.dataRepository = new DataRepository();
        this.state = {
            result: '',
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            isLoading: false
        };
    }

    componentDidMount() {
        this._loadData()
    }

    _loadData() {
        this.setState({
            isLoading: true
        });
        let url = this._genFetchUrl(this.props.tabLabel);
        this.dataRepository.fetchRepository(url)
            .then(result => {
                let items = result && result.items ? result.items : result ? result : [];
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(items),
                    isLoading: false
                });
                if (result&&result.update_data&&!this.dataRepository.checkDate(result.update_data)){
                    DeviceEventEmitter.emit('showToast','数据已过时');
                    return this.dataRepository.fetchNetRepository(url);
                }else {
                    DeviceEventEmitter.emit('showToast','显示本地数据');
                }
            })
            .then(items => {
                if (!items || items.length === 0) return;
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(items)
                });
                DeviceEventEmitter.emit('showToast','显示网络数据');
            })
            .catch(error => this.setState({
                result: JSON.stringify(error),
                isLoading: false
            }));
    }
    onSelect(item) {
        this.props.navigator.push({
            component: RepositoryDetail,
            params: {
                item: item,
                ...this.props
            }
        })
    }
    _genFetchUrl(key) {
        return URL + key + QUERY_STR;
    }

    _renderRow(rowData) {
        if (rowData) {
            return <RepositoryCell
                onSelect={() => this.onSelect(rowData)}
                key={rowData.id}
                rowData={rowData}/>
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