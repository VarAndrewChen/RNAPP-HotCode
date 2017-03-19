import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import NavigationBar from './NavigationBar';

export default class Girl extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    _renderButton(image) {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.navigator.pop();
                }}
            >
                <Image style={{width:22,height:22,margin:5}} source={image}></Image>
            </TouchableOpacity>
        )
    }
    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'Girl'}
                    style={{
                        backgroundColor: '#ee6363'
                    }}
                    leftButton={
                        this._renderButton(require('./../../res/images/ic_arrow_back_white_36pt.png'))
                    }
                    rightButton={
                        this._renderButton(require('./../../res/images/ic_star.png'))
                    }
                />
                <Text style={styles.text}>I am  a girl.</Text>
                <Text style={styles.text}>收到男孩{this.props.word}</Text>
                <Text style={styles.text} onPress={() => {
                    this.props.onCallBack('一盒🍫');
                    this.props.navigator.pop();
                }}>回赠男孩一盒🍫</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    text: {
        fontSize: 20
    }
});