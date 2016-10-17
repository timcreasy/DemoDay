import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  AsyncStorage,
  ScrollView
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
        <ScrollView>
          <Text>Favorites</Text>
          {
            this.state.favorites.map((demo, index) => {
              const favicon = demo.faviconUrl;
              return (
                <Card key={index}>
                  <CardItem>
                    <Thumbnail source={{uri: favicon}} />
                    <Text>{demo.title}</Text>
                  </CardItem>
                  <CardItem cardBody>
                    <Text>{demo.desc}</Text>
                  </CardItem>
                </Card>
              );
            })
          }
        </ScrollView>
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