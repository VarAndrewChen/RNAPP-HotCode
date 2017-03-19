import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';

export default class RepositoryCell extends Component {
    render() {
        return (
            <TouchableOpacity style={styles.container}>
                <View style={styles.cell_container}>
                    <Text style={styles.title}>{this.props.rowData.full_name}</Text>
                    <Text style={styles.description}>{this.props.rowData.description}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text>Author:</Text>
                            <Image
                                style={{width: 22, height: 22}}
                                source={{uri: this.props.rowData.owner.avatar_url}}
                            />
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text>Stars:</Text>
                            <Text>{this.props.rowData.stargazers_count}</Text>
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
        shadowOffset: {width: 0.5,height: 0.5},
        shadowColor: 'gray',
        shadowOpacity: .4,
        shadowRadius: 1,
        elevation: 2
    }
});