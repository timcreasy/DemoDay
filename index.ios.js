import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';
import {Scene, Router, Actions} from 'react-native-router-flux';
import Home from './components/Home';
import Favorites from './components/Favorites';
import Login from './components/Login';
import Register from './components/Register';
import emitter from './events';

const DemoDay = React.createClass({

  goHome() {
    Actions.refresh();
    Actions.pop();
  },

  favoritesPressed() {
    Actions.favorites();
  },

  logoutPressed() {
    emitter.emit('logout');
    AsyncStorage.removeItem('currentUser')
      .then(() => {
        Actions.login({type: "reset"});
      });
  },

  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene key="login" component={Login} initial={true} hideNavBar={true}/>
          <Scene key="register" component={Register} title="Register" />
          <Scene key="home" component={Home} title="Cohort 14" onRight={this.favoritesPressed} rightTitle="Favorites" leftTitle="Logout" onLeft={this.logoutPressed}/>
          <Scene key="favorites" component={Favorites} title="Favorites" onBack={this.goHome}/>
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
