import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  View
} from 'react-native';
import {Scene, Router} from 'react-native-router-flux';
import Home from './components/Home';
import Favorites from './components/Favorites';

const DemoDay = React.createClass({
  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene key="home" component={Home} title="Cohort 14" initial={true} />
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
