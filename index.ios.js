import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  TouchableOpacity
} from 'react-native';
import {Scene, Router, Actions} from 'react-native-router-flux';
import Home from './components/Home';
import Favorites from './components/Favorites';
import Login from './components/Login';
import Register from './components/Register';

const DemoDay = React.createClass({

  favoritesPressed() {
    Actions.favorites();
  },

  registerPressed() {
    Actions.register();
  },

  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene key="login" component={Login} title="Login" initial={true} onRight={this.registerPressed} rightTitle="Register" />
          <Scene key="register" component={Register} title="Register" />
          <Scene key="home" component={Home} title="Cohort 14" onRight={this.favoritesPressed} rightTitle="Favorites"/>
          <Scene key="favorites" component={Favorites} title="Favorites" />
        </Scene>
      </Router>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

AppRegistry.registerComponent('DemoDay', () => DemoDay);
