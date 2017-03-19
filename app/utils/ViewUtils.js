import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';

export default class ViewUtils extends Component{
    static renderLeftButton(callBack) {
        return (
            <TouchableOpacity
                style={{padding:8}}
                onPress={() => callBack()}
            >
                <Image
                    style={{width:22,height:22,margin:5}}
                    source={require('./../../res/images/ic_arrow_back_white_36pt.png')} />
            </TouchableOpacity>
        )
    }
    static renderRightButton(title, callBack) {
        return <TouchableOpacity
            style={{alignItems: 'center',}}
            onPress={callBack}>
            <View style={{marginRight: 10}}>
                <Text style={{fontSize: 20, color: '#FFFFFF',}}>{title}</Text>
            </View>
        </TouchableOpacity>
    }
}