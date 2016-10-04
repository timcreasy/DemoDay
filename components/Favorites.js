import React from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';
import {Card, CardItem, Thumbnail } from 'native-base';

const Favorites = React.createClass({

  render() {
    return (
      <View style={styles.container} >
        <Text>favorites</Text>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    paddingTop: 64
  }
})

module.exports = Favorites;