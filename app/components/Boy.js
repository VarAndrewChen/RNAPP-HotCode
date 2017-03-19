import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Girl from './Girl';
import NavigationBar from './NavigationBar';

export default class Boy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            word: ''
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                 title={'Boy'}
                 style={{
                     backgroundColor: '#ee6363'
                 }}
                />
                <Text style={styles.text}>I am a boy.</Text>
                <Text style={styles.text}
                    onPress={() => {
                        this.props.navigator.push({
                            component: Girl,
                            params: {
                                word: '一枝🌹',
                                onCallBack: (word) => {
                                    this.setState({
                                        word
                                    })
                                }
                            }
                        })
                    }}>送女孩一枝🌹</Text>
                <Text style={styles.text}>{this.state.word?`收到女孩${this.state.word}`:''}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'gray',
    },
    text: {
        fontSize: 20
    }
});