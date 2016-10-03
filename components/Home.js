import React from 'react';
import {
  Text,
  View
} from 'react-native';
import ParallaxView from 'react-native-parallax-view';

const Home = React.createClass({
    render() {
      return (
        <ParallaxView
          backgroundSource={{uri: './imgs/main.jpg'}}
          windowHeight={300} >
          <View>
            <Text>Hello World!</Text>
          </View>
        </ParallaxView>
      );
    }
});

module.exports = Home;