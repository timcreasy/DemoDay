import React from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';
import ParallaxView from 'react-native-parallax-view';

const Home = React.createClass({
    render() {
      return (
        <View style={styles.container} >
          <ParallaxView
            backgroundSource={require('../imgs/main.jpg')}
            windowHeight={140} >
            <View style={styles.scrollContainer}>
              <Text style={styles.mainHeader}>Demos Near Me</Text>
            </View>
          </ParallaxView>
        </View>
      );
    }
});

const styles = StyleSheet.create({
  container: {
    paddingTop: 64
  },
  scrollContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20
  },
  mainHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#253137',
    paddingBottom: 15
  }
})

module.exports = Home;