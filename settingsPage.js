/**
 * React Native App
 * 
 * Fetch daily lunch
 * 
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Navigator,
  TextInput,
  Button,
  AsyncStorage,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native';

export default class SettingsPage extends Component {
  constructor(props) {
    super(props);

    this.saveSettings = this.saveSettings.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {restcode: ''};
  
    AsyncStorage.getItem('restCode').then((value) => {
      this.setState({'restcode': value});
    }).done();  
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

  saveSettings(event) { 
    try {
      AsyncStorage.setItem('restCode', this.state.restcode);
      console.log("RestSet=" + this.state.restcode);
    } catch (error) {
      // Error saving data
    }  
  }

  handleChange(event) {
    this.setState({restcode: event.target.value});
  }

  renderScene() {
      return (
        <View style={styles.container}> 
          <View style={{flexDirection: 'row'}}>
          <Text style={styles.listItem}>Ravintolan koodi</Text>
            <TextInput
              style={{height: 40, width: 100,  borderColor: 'gray', borderWidth: 1}}
              onChange={this.handleChange}
              value={this.state.restcode}
              keyboardType={'numeric'}
            /> 
          </View>
          <View>
            <Button onPress={this.saveSettings} title="Tallenna" /> 
          </View>
        </View>          
      );
  }
}

var NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
    return (
      <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}
          onPress={() => navigator.parentNavigator.pop()}>
        <Text style={{color: 'white', margin: 10,}}>
          &lt; Takaisin
        </Text>
      </TouchableOpacity>
    );
  },
  RightButton(route, navigator, index, navState) {
    return null;
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

module.exports = SettingsPage;
