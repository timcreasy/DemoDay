import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  AsyncStorage,
  ScrollView,
  Linking
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
    if (cardData.scanUrl.split('://')[0] === 'https'){
      return cardData.scanUrl.split('https://phy.net/')[1].split('?')[0];
    } else if (cardData.scanUrl.split('://')[0] === 'http') {
      return cardData.scanUrl.split('http://phy.net/')[1].split('?')[0];
    }
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

  goToHomepage(demo) {
    Linking.openURL(demo.destinationUrl).catch(err => console.error('An error occurred', err));
  },

  render() {
    return (
      <View style={styles.container} >
        <ScrollView>
          {
            this.state.favorites.map((demo, index) => {
              demo = demo.card;
              const favicon = demo.faviconUrl;
              return (
                <View key={index}>
                  <Card
                    style={styles.card}>
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
                    <CardItem cardBody button onPress={() => this.goToHomepage(demo)}>
                      <Text>{demo.desc}</Text>
                    </CardItem>
                  </Card>
                </View>
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
    paddingTop: 70,
    paddingHorizontal: 10,
    paddingVertical: 20,
    flex: 1
  },
  card: {
    marginBottom: 15
  }
})

module.exports = Favorites;