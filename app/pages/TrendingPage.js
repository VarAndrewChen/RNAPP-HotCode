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
    Image,
    ListView,
    RefreshControl,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native';
import NavigationBar from '../components/NavigationBar';
import DataRepository, {FLAG_STORAGE} from '../expand/dao/DataRepository';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import TrendingCell from '../components/TrendingCell';
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import FavoriteDao from '../expand/dao/FavoriteDao';
import RepositoryDetail from './RepositoryDetail';
import Popover from '../components/Popover';
import TimeSpan from '../model/TimeSpan';
import ProjectModel from  '../model/ProjectModel';

const TimeSpanTextArray = [new TimeSpan('Today', 'since=daily'), new TimeSpan('This Week', 'since=weekly'), new TimeSpan('This Month', 'since=monthly')];
const API_URL = 'https://github.com/trending/';
let favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
let dataRepository = new DataRepository(FLAG_STORAGE.flag_trending);

export default class TrendingPage extends Component {
    constructor(props) {
        super(props);
        this.dataRepository = new DataRepository(FLAG_STORAGE.flag_trending);
        this.languageDao = LanguageDao.init(FLAG_LANGUAGE.flag_language);
        this.state = {
            result: '',
            languages: [],
            isVisible: false,
            buttonRect: {},
            timeSpan: TimeSpanTextArray[0]
        };
    }

    componentDidMount() {
        this._loadData();
    }

    _closePopover() {
        this.setState({isVisible: false});
    }

    _loadData() {
        this.languageDao.fetch()
            .then(result => {
                this.setState({
                    languages: result
                })
            })
            .catch(error => {
            })
    }

    _onSelectTimeSpan(timeSpan) {
        this._closePopover();
        this.setState({
            timeSpan: timeSpan
        })
    }

    _showPopover() {
        this.refs.button.measure((ox, oy, width, height, px, py) => {
            this.setState({
                isVisible: true,
                buttonRect: {x: px, y: py, width: width, height: height}
            });
        });
    }

    _renderTitleView() {
        return (
            <View>
                <TouchableOpacity
                    ref='button'
                    onPress={() => this._showPopover()}
                >
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{
                            fontSize: 18,
                            color: '#FFFFFF',
                            fontWeight: '400'
                        }}>Trending {this.state.timeSpan.showText}</Text>
                        <Image
                            style={{width: 12, height: 12, marginLeft: 5}}
                            source={require('../../res/images/ic_spinner_triangle.png')}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        let navigationBar =
            <NavigationBar
                titleView={this._renderTitleView()}
                statusBar={{
                    backgroundColor: '#2196f3'
                }}
            />;
        let content = this.state.languages.length > 0
            ? (<ScrollableTabView
                tabBarBackgroundColor="#2196f3"
                tabBarActiveTextColor="white"
                tabBarInactiveTextColor="mintcream"
                tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
                renderTabBar={() => <ScrollableTabBar/>}
            >
                {this.state.languages.map((v, i) => (v.checked ?
                    <TrendingTab key={i} tabLabel={v.name} {...this.props} timeSpan={this.state.timeSpan}/> : null))}
            </ScrollableTabView>)
            : null;
        let timeSpanView =
            <Popover
                isVisible={this.state.isVisible}
                fromRect={this.state.buttonRect}
                placement="bottom"
                onClose={() => this._closePopover()}
                contentStyle={{opacity: 0.82, backgroundColor: '#343434'}}
                style={{backgroundColor: 'red'}}>
                <View style={{alignItems: 'center'}}>
                    {TimeSpanTextArray.map((v, i, arr) => {
                        return <TouchableOpacity key={i} onPress={() => this._onSelectTimeSpan(v)}
                                                 underlayColor='transparent'>
                            <Text
                                style={{fontSize: 18, color: 'white', padding: 8, fontWeight: '400'}}>
                                {v.showText}
                            </Text>
                        </TouchableOpacity>
                    })
                    }
                </View>
            </Popover>;
        return (
            <View style={styles.container}>
                {navigationBar}
                {content}
                {timeSpanView}
            </View>
        )
    }
}
class TrendingTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: '',
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            isLoading: false,
            favoriteKeys: []
        };
    }

    componentDidMount() {
        this._loadData(this.props.timeSpan, true);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.timeSpan !== this.props.timeSpan) {
            this._loadData(nextProps.timeSpan, true);
        }
    }

    _loadData(timeSpan, isRefresh) {
        this.setState({
            isLoading: true
        });
        let url = this._genFetchUrl(timeSpan, this.props.tabLabel);
        dataRepository.fetchRepository(url)
            .then(result => {
                let items = result && result.item ? result.item : result ? result : [];
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(items),
                    isLoading: false
                });
                if (result && result.update_data && !dataRepository.checkDate(result.update_data)) {
                    DeviceEventEmitter.emit('showToast', '数据已过时');
                    return dataRepository.fetchNetRepository(url);
                } else {
                    DeviceEventEmitter.emit('showToast', '显示缓存数据');
                }
            })
            .then(items => {
                if (!items || items.length === 0) return;
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(items)
                });
                DeviceEventEmitter.emit('showToast', '显示网络数据');
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

    _genFetchUrl(timeSpan, category) {
        return API_URL + category + '?' + timeSpan.searchText;
    }

    _renderRow(rowData) {
        if (rowData) {
            return <TrendingCell
                onSelect={() => this.onSelect(rowData)}
                key={rowData.id}
                rowData={rowData}/>
        }
    }

    _onRefresh() {
        this._loadData(this.props.timeSpan);
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
                                this._onRefresh()
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