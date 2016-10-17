import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  AsyncStorage
} from 'react-native';
import {Card, CardItem, Thumbnail } from 'native-base';

const Favorites = React.createClass({

  getInitialState() {
    return({ favorites: [] });
  },

  componentDidMount() {

    AsyncStorage.getItem('currentUser')
      .then(res => JSON.parse(res))
      .then(data => {
        if (data.favorites) {
          this.setState({favorites: data.favorites});
        }
      })
      .catch(error => console.log("An error occured", error));

  },

  render() {
    return (
      <View style={styles.container} >
        <Text>Favorites</Text>
        {
          this.state.favorites.map((favorite, index) => {
            return (
              <View key={index}>
                <Text>{favorite}</Text>
              </View>
            );
          })
        }
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