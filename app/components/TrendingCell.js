import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import HTMLView from 'react-native-htmlview';

export default class TrendingCell extends Component {
    render() {
        let data = this.props.rowData;
        let description = `<p>${data.description}</p>`;
        return (
            <TouchableOpacity
                onPress={this.props.onSelect}
                style={styles.container}>
                <View style={styles.cell_container}>
                    <Text style={styles.title}>{data.fullName}</Text>
                    <HTMLView
                        stylesheet={{
                            a: styles.description,
                            p: styles.description
                        }}
                        value={description}
                        onLinkPress={(url) => {
                        }}
                    />
                    <Text style={styles.description}>{data.meta}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.description}>Build by:</Text>
                            {data.contributors.map((v, i) => {
                                return (
                                    <Image
                                        key={i}
                                        style={{width: 22, height: 22}}
                                        source={{uri: v}}
                                    />
                                )
                            })}
                        </View>
                        <Image style={{width: 22, height: 22}} source={require('../../res/images/ic_star.png')}/>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    title: {
        fontSize: 16,
        marginBottom: 2,
        color: '#212121'
    },
    description: {
        fontSize: 14,
        marginBottom: 2,
        color: '#757575',
        borderRadius: 2
    },
    cell_container: {
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        marginVertical: 3,
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: '#ddd',
        shadowOffset: {width: 0.5, height: 0.5},
        shadowColor: 'gray',
        shadowOpacity: .4,
        shadowRadius: 1,
        elevation: 2
    }
});