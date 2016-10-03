import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  View
} from 'react-native';
import Home from './components/Home';

const DemoDay = React.createClass({
  render() {
    return (
      <View style={styles.container}>
        <Home />
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  }
});

AppRegistry.registerComponent('DemoDay', () => DemoDay);
