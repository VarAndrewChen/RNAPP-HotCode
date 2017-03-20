/**
 * CustomKeyPage
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
    ScrollView,
    TouchableOpacity
} from 'react-native';
import NavigationBar from '../../components/NavigationBar';
import ViewUtils from './../../utils/ViewUtils';
import LanguageDao, {FLAG_LANGUAGE} from './../../expand/dao/LanguageDao';
import CheckBox from 'react-native-check-box';
import ArrayUtils from '../../utils/ArrayUtils';


export default class CustomKeyPage extends Component {
    constructor(props) {
        super(props);
        this.isRemoveKey = !!props.isRemoveKey;
        this.languageDao = LanguageDao.init(FLAG_LANGUAGE.flag_key);
        this.state = {
            dataArray: [],
            changeValues: []
        };
    }

    componentDidMount() {
        this._loadData();
    }

    _loadData() {
        this.languageDao.fetch()
            .then(result => {
                this.setState({
                    dataArray: result.slice()
                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    _onSave() {
        if (this.state.changeValues.length !== 0){
            if (this.isRemoveKey) {
                for (let i =0 ,changeValues =this.state.changeValues;i <changeValues.length;i++) {
                    ArrayUtils.remove(this.state.dataArray,changeValues[i]);
                }
            }
            this.languageDao.save(this.state.dataArray);
        }
        this.props.navigator.pop()
    }
    _onBack() {
        if (this.state.changeValues.length === 0 ) {
            this.props.navigator.pop();
            return
        }
        Alert.alert(
            '提示',
            '要保存修改吗',
            [
                {text: '取消', onPress: () => {
                    this.props.navigator.pop()
                }, style: 'cancel'},
                {text: '保存', onPress: () => {
                    this._onSave()
                }},
            ],
            { cancelable: false }
        )
    }
    _onClick(data) {
        if (!this.isRemoveKey) data.checked = !data.checked;
        ArrayUtils.updateArray(this.state.changeValues,data);
    }
    _renderCheckBox(data) {
        let leftText = data.name;
        let isChecked = this.isRemoveKey?false:data.checked;
        return (
            <CheckBox
                style={{flex:1,padding:10}}
                onClick={() => {
                    this._onClick(data)
                }}
                leftText={leftText}
                isChecked={isChecked}
                checkedImage={<Image style={{tintColor: '#2196f3'}}
                    source={require('./images/ic_check_box.png')}/>}
                unCheckedImage={<Image style={{tintColor: '#2196f3'}}
                    source={require('./images/ic_check_box_outline_blank.png')}
                />}
            />
        )
    }
    _renderView() {
        let views = [],
            data = this.state.dataArray,
            len = data.length;
        if (!data || len ===0) return null;
        for (let i=0;i < len-2;i+=2){
            views.push(
                <View key={i}>
                    <View style={styles.item}>
                        {this._renderCheckBox(data[i])}
                        {this._renderCheckBox(data[i+1])}
                    </View>
                    <View style={styles.line}></View>
                </View>
            )
        }
        views.push(
            <View key={len-1}>
                <View style={styles.item}>
                    {len%2===0?this._renderCheckBox(data[len-2]):null}
                    {this._renderCheckBox(data[len-1])}
                </View>
                <View style={styles.line}></View>
            </View>
        );
        return views;
    }

    render() {
        let title = this.isRemoveKey?'标签移除':'自定义标签';
        let rightButtonTitle = this.isRemoveKey?'移除':'保存';
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={title}
                    statusBar={{
                        backgroundColor: '#2196f3'
                    }}
                    leftButton={ViewUtils.renderLeftButton(() => {
                        this._onBack()
                    })}
                    rightButton={ViewUtils.renderRightButton(rightButtonTitle,() => {
                        this._onSave()
                    })}
                />
                <ScrollView>
                    {this._renderView()}
                </ScrollView>
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
    },
    title: {
        fontSize: 20,
        color: 'white'
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    line: {
        height: 0.3,
        backgroundColor: 'black'
    }
});