/**
 * SortKeyPage
 * @flow
 **/
'use strict'

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    TouchableOpacity,
    TouchableHighlight
} from 'react-native';
import NavigationBar from '../../components/NavigationBar';
import CustomKeyPage from './CustomKeyPage';
import LanguageDao, {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao';
import ArrayUtils from '../../utils/ArrayUtils';
import SortableListView from 'react-native-sortable-listview';
import ViewUtils from '../../utils/ViewUtils';

export default class SortKeyPage extends Component {
    constructor(props) {
        super(props);
        this.dataArray = [];
        this.sortResultArray = [];
        this.originalCheckedArray = [];
        this.state = {
            checkedArray: []
        };
    }

    componentDidMount() {
        this.languageDao = LanguageDao.init(this.props.flag);
        this._loadData();
    }

    _loadData() {
        this.languageDao.fetch()
            .then(result => {
                this._getCheckedItems(result);
            })
            .catch(error => {

            })
    }

    _getCheckedItems(result) {
        this.dataArray = result;
        let checkedArray = [];
        result.map(v => {
            if (v.checked) checkedArray.push(v);
        });
        this.setState({
            checkedArray: checkedArray
        });
        this.originalCheckedArray = ArrayUtils.clone(checkedArray);
    }

    _getSortResult() {
        this.sortResultArray = ArrayUtils.clone(this.dataArray);
        for (let i = 0; i < this.originalCheckedArray.length; i++) {
            let item = this.originalCheckedArray[i];
            let index = this.dataArray.indexOf(item);
            this.sortResultArray.splice(index, 1, this.state.checkedArray[i])
        }
    }

    _onBack() {
        if (!ArrayUtils.isEqual(this.originalCheckedArray, this.state.checkedArray)) {
            Alert.alert(
                '提示',
                '是否要保存修改呢?',
                [
                    {
                        text: '否', onPress: () => {
                        this.props.navigator.pop();
                    }
                    }, {
                    text: '是', onPress: () => {
                        this._onSave(true);
                    }
                }
                ]
            )
        } else {
            this.props.navigator.pop();
        }
    }

    _onSave(hasChecked) {
        if (!hasChecked && ArrayUtils.isEqual(this.originalCheckedArray, this.state.checkedArray)) {
            this.props.navigator.pop();
            return;
        }
        this._getSortResult();
        this.languageDao.save(this.sortResultArray);
        this.props.navigator.pop();
    }

    render() {
        let title = this.props.flag === FLAG_LANGUAGE.flag_language?'语言排序':'标签排序';
        let rightButton = <TouchableOpacity
            onPress={() => this._onSave()}
        >
            <View style={{padding: 10}}>
                <Text style={styles.title}>保存</Text>
            </View>
        </TouchableOpacity>;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={title}
                    style={{backgroundColor: '#2196f3'}}
                    leftButton={ViewUtils.renderLeftButton(() => {
                        this._onBack();
                    })}
                    rightButton={rightButton}
                />
                <SortableListView
                    style={{flex: 1}}
                    data={this.state.checkedArray}
                    order={Object.keys(this.state.checkedArray)}
                    onRowMoved={e => {
                        this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0]);
                        this.forceUpdate();
                    }}
                    renderRow={row => <SortCell data={row}/>}
                />
            </View>
        )
    }
}
class SortCell extends Component {
    render() {
        return (
            <TouchableHighlight
                underlayColor={'#eee'}
                delayLongPress={500}
                style={styles.item}
                {...this.props.sortHandlers}
            >
                <View style={styles.row}>
                    <Image
                        style={styles.image}
                        source={require('./images/ic_sort.png')}/>
                    <Text>{this.props.data.name}</Text>
                </View>
            </TouchableHighlight>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    item: {
        padding: 15,
        backgroundColor: "#F8F8F8",
        borderBottomWidth: 1,
        borderColor: '#eee'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    image: {
        width: 16,
        height: 16,
        marginRight: 10,
        tintColor: '#2196f3'
    },
    title: {
        fontSize: 20,
        color: 'white'
    }
});