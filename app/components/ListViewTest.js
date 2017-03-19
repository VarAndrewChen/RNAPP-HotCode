import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    TouchableOpacity,
    RefreshControl
} from 'react-native';
import NavigationBar from './NavigationBar';
import Toast, {DURATION} from 'react-native-easy-toast';

let data = {
    "result": [
        {
            "email": "u.young@white.net", "fullName": "John Harris"
        }
        ,
        {
            "email": "d.young@davis.net", "fullName": "Margaret Miller"
        }
        ,
        {
            "email": "x.moore@miller.co.uk", "fullName": "Angela Davis"
        }
        ,
        {
            "email": "g.hall@taylor.org", "fullName": "Angela Anderson"
        }
        ,
        {
            "email": "e.white@anderson.gov", "fullName": "Jeffrey Jackson"
        }
        ,
        {
            "email": "k.lopez@allen.net", "fullName": "Susan Moore"
        }
        ,
        {
            "email": "x.gonzalez@johnson.io", "fullName": "Michael Moore"
        }
        ,
        {
            "email": "u.wilson@lewis.net", "fullName": "Scott Smith"
        }
        ,
        {
            "email": "o.jones@smith.net", "fullName": "Paul Hall"
        }
        ,
        {
            "email": "o.jackson@martinez.net", "fullName": "Donna Hall"
        }
        ,
        {
            "email": "k.johnson@rodriguez.gov", "fullName": "Betty White"
        }
        ,
        {
            "email": "y.robinson@harris.com", "fullName": "Brenda Miller"
        }
        ,
        {
            "email": "r.walker@hernandez.edu", "fullName": "Richard Young"
        }
        ,
        {
            "email": "f.lopez@brown.net", "fullName": "Kevin Rodriguez"
        }
        ,
        {
            "email": "u.hall@gonzalez.org", "fullName": "Larry Martin"
        }
        ,
        {
            "email": "p.martinez@hall.edu", "fullName": "Charles Young"
        }
        ,
        {
            "email": "x.moore@miller.org", "fullName": "Brian Martin"
        }
    ]
};
export default class ListViewTest extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows(data.result),
            isLoading: true
        }
    }
    componentDidMount() {
        this._onload()
    }
    _renderRow(item) {
        return (
            <View style={styles.wrap}>
                <TouchableOpacity
                    onPress={() => {
                        this.toast.show(`你单击了:${item.fullName}`, DURATION.LENGTH_LONG);
                    }}
                >
                    <Text style={styles.tips}>{item.fullName}</Text>
                    <Text style={styles.tips}>{item.email}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        return (
            <View key={rowID} style={styles.line}>
            </View>
        )
    }

    _renderFooter() {
        return <Image style={{width: 400, height: 200}}
                      source={{uri: 'https://cdn.pixabay.com/photo/2017/03/13/10/25/hummingbird-2139279_1280.jpg'}}/>
    }
    _onload() {
        setTimeout(() => {
            this.setState({
                isLoading: false
            })
        },2000);
    }
    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title='ListViewTest'
                />
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(item) => this._renderRow(item)}
                    renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                    renderFooter={() => this._renderFooter()}
                    refreshControl={<RefreshControl
                        refreshing={this.state.isLoading}
                        onRefresh={() => {this._onload()}}
                    />}
                />
                <Toast ref={toast => {
                    this.toast = toast
                }}/>
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
    },
    wrap: {
        height: 50
    },
    tips: {
        fontSize: 18
    },
    line: {
        height: 1,
        backgroundColor: 'black'
    }
});