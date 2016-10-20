import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  AsyncStorage,
  ScrollView
} from 'react-native';
import {Card, CardItem, Thumbnail } from 'native-base';
import CheckBox from 'react-native-icon-checkbox';

const Favorites = React.createClass({

  getInitialState() {
    return({ favorites: [] });
  },

  componentDidMount() {

    AsyncStorage.getItem('currentUser')
      .then(res => JSON.parse(res))
      .then(user => {
        
        const options = {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        };

        const ENDPOINT = "http://104.236.71.66:3000/api/favorites/" + user._id;

        fetch(ENDPOINT, options)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            this.setState({favorites: data.favorites});
          })
          .catch(console.error);


      })
      .catch(error => console.log("An error occured", error));

  },

  getDemoId(cardData) {
    return cardData.scanUrl.split('https://phy.net/')[1].split('?')[0];
  },

  unfavoritePressed(cardData) {
    AsyncStorage.getItem('currentUser')
      .then(res => JSON.parse(res))
      .then(user => {
        // ENDPOINT
        const ENDPOINT = 'http://104.236.71.66:3000/api/favorites';
        const requestObj = {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            employer: user._id,
            student: this.getDemoId(cardData),
            card: cardData
          })
        };
        fetch(ENDPOINT, requestObj)
        .then(() => {
          const UPDATEDLIST = "http://104.236.71.66:3000/api/favorites/" + user._id;
          fetch(UPDATEDLIST)
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              this.setState({favorites: data.favorites});
            })
            .catch(console.error);
        })
        .catch(err => console.log(err));
      });

  },

  render() {
    return (
      <View style={styles.container} >
        <ScrollView>
          <Text>Favorites</Text>
          {
            this.state.favorites.map((demo, index) => {
              demo = demo.card;
              const favicon = demo.faviconUrl;
              return (
                <Card key={index}>
                  <CardItem>
                    <Thumbnail source={{uri: favicon}} />
                    <Text>{demo.title}</Text>
                    <CheckBox
                      size={30}
                      checked={true}
                      onPress={() => this.unfavoritePressed(demo)}
                      uncheckedIconName="star-border"
                      checkedIconName="star" />
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