import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';

export default class RepositoryCell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFavorite: this.props.projectModel.isFavorite,
            favouriteIcon: this.props.projectModel.isFavorite
                ? require('../../res/images/ic_star.png')
                : require('../../res/images/ic_unstar_transparent.png')
        }
    }
    componentWillReceiveProps(nextProps) {
        this._setFavouriteState(nextProps.projectModel.isFavorite);
    }
    _setFavouriteState(isFavorite) {
        this.setState({
            isFavorite: isFavorite,
            favouriteIcon: isFavorite
                ? require('../../res/images/ic_star.png')
                : require('../../res/images/ic_unstar_transparent.png')
        })
    }

    _onPressFavourite() {
        this._setFavouriteState(!this.state.isFavorite);
        this.props.onFavorite(this.props.projectModel.item,!this.state.isFavorite)
    }

    render() {
        let data = this.props.projectModel.item ? this.props.projectModel.item : this.props.projectModel;
        let favouriteButton = <TouchableOpacity
            onPress={() => this._onPressFavourite()}
        >
            <Image
                style={{width: 22, height: 22, tintColor: '#2196f3'}}
                source={this.state.favouriteIcon}
            />
        </TouchableOpacity>;
        return (
            <TouchableOpacity
                onPress={this.props.onSelect}
                style={styles.container}>
                <View style={styles.cell_container}>
                    <Text style={styles.title}>{data.full_name}</Text>
                    <Text style={styles.description}>{data.description}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text>Author:</Text>
                            <Image
                                style={{width: 22, height: 22}}
                                source={{uri: data.owner.avatar_url}}
                            />
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text>Stars:</Text>
                            <Text>{data.stargazers_count}</Text>
                        </View>
                        {favouriteButton}
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