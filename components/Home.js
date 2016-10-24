import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  AsyncStorage,
  RefreshControl,
  Linking
} from 'react-native';
import ParallaxView from 'react-native-parallax-view';
import { NativeModules } from 'react-native';
import { NativeAppEventEmitter } from 'react-native';
import {Card, CardItem, Thumbnail } from 'native-base';
import CheckBox from 'react-native-icon-checkbox';
import { Actions } from 'react-native-router-flux';
import TimerMixin from 'react-timer-mixin';
import emitter from '../events';

const BeaconBridge = NativeModules.BeaconBridge;

const Home = React.createClass({

  mixins: [TimerMixin],

  getInitialState() {
    return({
      demos: [],
      tempDemoArray: [],
      isFavorited: false,
      favorites: [],
      refreshing: false
    });
  },

  componentDidMount() {
    BeaconBridge.initPhyManagerWithApiKey("51fd9f81-3d04-5c1b-8cd3-d86a3ea04453");
    NativeAppEventEmitter.addListener('BeaconsFound', (demos) => {
      this.setState({tempDemoArray: JSON.parse(demos)});
    });
    this.getFavoritesForUser();
    emitter.addListener('logout', () => {
      BeaconBridge.stopScanningForBeacons();
    });
  },

  componentWillUnmount() {
    BeaconBridge.stopScanningForBeacons();
  },

  getDemoId(cardData) {
    return cardData.scanUrl.split('https://phy.net/')[1].split('?')[0];
  },

  unfavoriteDemo(demo) {

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
            student: this.getDemoId(demo),
            card: demo
          })
        };
        fetch(ENDPOINT, requestObj)
        .then((data) => {
        })
        .catch(err => console.log(err));
      });

  },

  favoriteDemo(demo) {

    AsyncStorage.getItem('currentUser')
      .then(res => JSON.parse(res))
      .then(user => {
        // ENDPOINT
        const ENDPOINT = 'http://104.236.71.66:3000/api/favorites';
        const requestObj = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            employer: user._id,
            student: this.getDemoId(demo),
            card: demo
          })
        };
        fetch(ENDPOINT, requestObj)
        .then((data) => {
        })
        .catch(err => console.log(err));
      });

  },

  favoritePressed(checked, cardData) {

    console.log("checked:", checked);

    // Toggle checkbox
    checked = !checked;

    // Toggle isFavorited
    this.setState({
      isFavorited: checked,
    });

    AsyncStorage.getItem('currentUser')
      .then(res => JSON.parse(res))
      .then(data => {
        // Create favorites if it does not exist
        if (!data.favorites) { data.favorites = [] };
        // Return object if it exists in favorites array
        const obj = data.favorites.filter(obj => {
            return obj.scanUrl === cardData.scanUrl;
        })[0];
        // Add to favorites if not already added, remove if exists
        if (checked && !obj) {
          data.favorites.push(cardData)
          this.favoriteDemo(cardData);
        } else {
          data.favorites = data.favorites.filter(upd => {
            this.unfavoriteDemo(cardData);
            return upd.scanUrl !== obj.scanUrl;
          });
        }
        return AsyncStorage.mergeItem('currentUser', JSON.stringify(data));
      })
      .catch(error => console.log('Error!'));

  },

  goToFavorites() {
    // console.log("Card pressed");
    Linking.openURL("http://timcreasy.com").catch(err => console.error('An error occurred', err));
  },

  getFavoritesForUser() {
    this.setTimeout(() => {
      this.getFavoritesForUser();
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
              let favoritedUsers = data.favorites.map(favorite => favorite.student);
              this.setState({favorites: favoritedUsers});
            })
            .catch(console.error);
        })
        .catch(error => console.log("An error occured", error));
    }, 600);
  },

  scanForBeacons() {
    if (!this.state.refreshing) {
      this.setState({refreshing: true});
      BeaconBridge.stopScanningForBeacons();
      BeaconBridge.startScanningForBeacons();
      setTimeout(() => {
        this.setState({refreshing: false});
        BeaconBridge.stopScanningForBeacons()
        this.setState({demos: this.state.tempDemoArray});
      }, 4000);
    }
  },

  render() {

    return (
        <ParallaxView
          style={styles.container}
          backgroundSource={require('../imgs/groupstandard.jpg')}
          windowHeight={140} 
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.scanForBeacons}
            />
          } >
          <View style={styles.demoContainer}>
            <Text style={styles.mainHeader}>Demos Near Me</Text>
            <Text style={styles.subHeader}>Pull to refresh list</Text>
            {
              this.state.demos.map((demo, index) => {
                const demoId = this.getDemoId(demo);
                let isFavorited = this.state.favorites.includes(demoId);
                console.log("ISFAVORITED:", isFavorited);
                const favicon = demo.faviconUrl;
                return (
                    <Card key={index}
                      style={styles.card}>
                      <CardItem>
                        <Thumbnail source={{uri: favicon}} />
                        <Text>{demo.title}</Text>
                        <CheckBox
                          size={30}
                          checked={isFavorited}
                          onPress={() => this.favoritePressed(isFavorited, demo)}
                          uncheckedIconName="star-border"
                          checkedIconName="star"
                        />
                      </CardItem>
                      <CardItem cardBody button onPress={this.goToFavorites}>
                        <Text>{demo.desc}</Text>
                      </CardItem>
                    </Card>
                );
              })
            }
          </View>
        </ParallaxView>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    paddingTop: 64
  },
  card: {
    marginBottom: 15
  },
  demoContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20
  },
  mainHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#253137',
    paddingBottom: 7
  },
  subHeader: {
    fontSize: 12,
    color: '#a8a8a8',
    paddingBottom: 15
  }
})

module.exports = Home;