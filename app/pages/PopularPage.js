import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    RefreshControl
} from 'react-native';
import NavigationBar from '../components/NavigationBar';
import DataRepository from '../expand/dao/DataRepository';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import RepositoryCell from '../components/RepositoryCell';
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';


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
                {this.state.languages.map((v,i) => (v.checked ? <PopularTab key={i} tabLabel={v.name}/> : null))}
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
        let url = URL + this.props.tabLabel + QUERY_STR;
        this.dataRepository.fetchNetRepository(url)
            .then(responseJson => this.setState({
                dataSource: this.state.dataSource.cloneWithRows(responseJson.items),
                isLoading: false
            }))
            .catch(error => this.setState({
                result: JSON.stringify(error),
                isLoading: false
            }));
    }

    _renderRow(rowData) {
        if (rowData) {
            return <RepositoryCell rowData={rowData}/>
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