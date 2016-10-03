import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  View
} from 'react-native';
import {Scene, Router} from 'react-native-router-flux';
import Home from './components/Home';

const DemoDay = React.createClass({
  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene key="home" component={Home} title="Cohort 14" initial={true} />
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
