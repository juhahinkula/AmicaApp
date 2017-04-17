/**
 * Sample React Native App
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  ListView,
  AsyncStorage,
  Navigator,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native';

export default class MainPage extends Component {
  constructor(props) {
    super(props);
    
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      restaurant: '',
      lang: 'fi',
      menus: [],
      datasource: ds,
      restCode: '0510',
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('lang').then((value) => {
      this.setState({"lang": value});
    }).done();
    
    AsyncStorage.getItem('restCode').then((value) => {
      this.setState({'restCode': value});
    }).done(); 

    console.log('Restcode=' + this.state.restCode);

    fetch("http://www.amica.fi/modules/json/json/Index?costNumber=" + this.state.restCode + "&language=" + this.state.lang) 
        .then((response) => response.json()) 
        .then((responseData) => { 
          if (responseData.MenusForDays != null) {
            this.setState({ 
              menus: responseData.MenusForDays[0].SetMenus,
              datasource: this.state.datasource.cloneWithRows(responseData.MenusForDays[0].SetMenus.map((data) => data.Components)),
              restaurant: responseData.RestaurantName, 
            }); 
          }
          else {
            this.setState({ 
              datasource: this.state.datasource.cloneWithRows(['Ei lounastietoja saatavilla']),
            });             
          }
    }) 
    .done();
  }

  render() {
    return (       
      <Navigator
          renderScene={this.renderScene.bind(this)}
          navigator={this.props.navigator}
          navigationBar={
            <Navigator.NavigationBar style={{backgroundColor: '#00007f'}}
                routeMapper={NavigationBarRouteMapper} />
        } /> 
    );
  }

  renderScene(route, navigation) {
      return (        
      <View style={styles.container}>   
        <View style={{flexDirection: 'row', height: 100, paddingTop: 50, backgroundColor: '#00007f'}}> 
          <Text style={styles.headerText}>
            {this.state.restaurant}
          </Text>   
        </View>
        <ListView
            style = {styles.listContainer}
            dataSource = {this.state.datasource}
            renderRow = {
               (rowData) => (
                  <Text style={styles.listItem}>
                     {rowData}
                  </Text>
               )
            }
            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />} 
         />           
      </View>          
      );  
  }
}

var NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
    return null;
  },
  RightButton(route, navigator, index, navState) {
    return (
      <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}
          onPress={() => navigator.parentNavigator.push({
          id: 'SettingsPage',
          name: 'Settings',
        })}>
        <Text style={{color: 'white', margin: 10,}}>
          Asetukset
        </Text>
      </TouchableOpacity>
    );
  },
  Title(route, navigator, index, navState) {
    return null;
}  
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 24,
    textAlign: 'center',
    margin: 10,
  },
  listContainer: {
    paddingTop: 22
  },
  listItem: {
    fontSize: 20,
    textAlign: 'center',
    padding: 7,
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
});

module.exports = MainPage;
