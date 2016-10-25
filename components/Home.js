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
      favorites: [],
      refreshing: false,
      isDemo: false
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
    AsyncStorage.getItem('currentUser')
      .then(res => JSON.parse(res))
      .then(user => {
        if (user.email === "test@test.com") {
          this.setState({isDemo: true});
        }
      });
  },

  componentWillUnmount() {
    BeaconBridge.stopScanningForBeacons();
  },

  getDemoId(cardData) {
    if (cardData.scanUrl.split('://')[0] === 'https'){
      return cardData.scanUrl.split('https://phy.net/')[1].split('?')[0];
    } else if (cardData.scanUrl.split('://')[0] === 'http') {
      return cardData.scanUrl.split('http://phy.net/')[1].split('?')[0];
    }
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

    checked = !checked;

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
          data.favorites.push(cardData);
          this.favoriteDemo(cardData);
        } else {
          data.favorites = data.favorites.filter(upd => {
            return upd.scanUrl !== obj.scanUrl;
          });
          this.unfavoriteDemo(cardData);
        }
        return AsyncStorage.mergeItem('currentUser', JSON.stringify(data));
      })
      .catch(error => console.log('Error!'));

  },

  goToHomepage(demo) {
    Linking.openURL(demo.destinationUrl).catch(err => console.error('An error occurred', err));
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
      this.setTimeout(() => {
        this.setState({refreshing: false});
        BeaconBridge.stopScanningForBeacons()
        if (this.state.isDemo) {
          this.setState({demos: this.demoData()});
        } else {
          this.setState({demos: this.state.tempDemoArray});
        }
      }, 4000);
    }
  },

  demoData() {
    return [{
      "jsonLd": null,
      "rssi": -62,
      "txPowerLevel": -39,
      "hasMetadata": null,
      "title": "Tyler Daniel",
      "destinationUrl": "https://phy.net/mm/580e70d91434c20100c7c780?utm_source=1155&utm_medium=WMJj…3CA9%26phy_language%3Den-US%26phy_web_range%3D0&utm_campaign=1477363288738",
      "scanUrl": "https://phy.net/WMJjiK?rOW000",
      "desc": "Things I enjoy: sports (I play in a wood bat baseball league and a weekly basketball league), movies/tv (only good tv, though!), technology, food, traveling, video games, power lifting, food, beer, learning things on Youtube, and food.",
      "faviconUrl": "https://url-caster.appspot.com/favicon?url=https%3A%2F%2Fphy-static-1.s3.am…accounts%2F1155%2Fmeta-messages%2F89e07fb0-ae87-4bee-9fa6-4372de5138b5.png"
    }, {
      "jsonLd": null,
      "rssi": -65,
      "txPowerLevel": -39,
      "hasMetadata": null,
      "title": "Jack Mocherman",
      "destinationUrl": "https://phy.net/mm/580e70901434c20100c7c754?utm_source=1155&utm_medium=nuM4…3CA9%26phy_language%3Den-US%26phy_web_range%3D0&utm_campaign=1477363703720",
      "scanUrl": "https://phy.net/nuM44w?v9oEvO",
      "desc": "I am within 5 feet of music, books, code, coffee, or some combination of the four at any given time!",
      "faviconUrl": "https://url-caster.appspot.com/favicon?url=https%3A%2F%2Fphy-static-1.s3.am…accounts%2F1155%2Fmeta-messages%2Fe7d8cf4c-42a0-4e0d-83c0-42587df2922a.png"
    }, {
      "jsonLd": null,
      "rssi": -64,
      "txPowerLevel": -39,
      "hasMetadata": null,
      "title": "Mike Meadowss",
      "destinationUrl": "https://phy.net/mm/580e6f331434c20100c7c6ce?utm_source=1155&utm_medium=tNVN…3CA9%26phy_language%3Den-US%26phy_web_range%3D0&utm_campaign=1477363435748",
      "scanUrl": "https://phy.net/tNVNht?vGeFgM",
      "desc": "Mike is a former scientist looking to convert his passion for logic into programming. Also, he is a big fan of talking about himself in third person.",
      "faviconUrl": "https://url-caster.appspot.com/favicon?url=https%3A%2F%2Fphy-static-1.s3.am…accounts%2F1155%2Fmeta-messages%2Fa0666161-437f-42b5-8b44-5eeefa2787c9.png"
    }, {
      "jsonLd": null,
      "rssi": -71,
      "txPowerLevel": -31,
      "hasMetadata": null,
      "title": "Tim Creasyy",
      "destinationUrl": "https://phy.net/mm/580ec2961434c20100c7ccbf?utm_source=1155&utm_medium=iiv4…3CA9%26phy_language%3Den-US%26phy_web_range%3D2&utm_campaign=1477362326000",
      "scanUrl": "http://phy.net/iiv4N7?kh2gQv",
      "desc": "Tim Creasy, originally from North Carolina, has always had a passion for technology, being self taught in C and Objective-C. Tim is constantly driven by the fact that the only limit to the software he writes is himself.",
      "faviconUrl": "https://url-caster.appspot.com/favicon?url=https%3A%2F%2Fphy-static-1.s3.am…accounts%2F1155%2Fmeta-messages%2Fca5fb1f5-0cb2-4370-9151-55ff2de73038.png"
    }, {
      "jsonLd": null,
      "rssi": -69,
      "txPowerLevel": -31,
      "hasMetadata": null,
      "title": "Dominic Serranoo",
      "destinationUrl": "https://phy.net/mm/580e637f1434c20100c7c5cd?utm_source=1155&utm_medium=n4EL…3CA9%26phy_language%3Den-US%26phy_web_range%3D0&utm_campaign=1477364357176",
      "scanUrl": "https://phy.net/n4ELhz?ndd!SI",
      "desc": "When I am not programming or learning more about my current project, I enjoy playing ping-pong, soccer, and sampling craft beers.",
      "faviconUrl": "https://url-caster.appspot.com/favicon?url=https%3A%2F%2Fphy-static-1.s3.am…accounts%2F1155%2Fmeta-messages%2F3d93a5cc-6648-421a-9729-6dd2bbd15b38.png"
    }, {
      "jsonLd": null,
      "rssi": -64,
      "txPowerLevel": -16,
      "hasMetadata": null,
      "title": "Chris Hill",
      "destinationUrl": "https://phy.net/mm/580ec4111434c20100c7cce9?utm_source=1155&utm_medium=DF4h…3CA9%26phy_language%3Den-US%26phy_web_range%3D0&utm_campaign=1477363184313",
      "scanUrl": "http://phy.net/DF4haB?dNiLP9",
      "desc": "I've been a carpenter, an artist, and an electrician. I am a father and a husband. I love programming, because it allows me to create and learn continuously.",
      "faviconUrl": "https://url-caster.appspot.com/favicon?url=https%3A%2F%2Fphy-static-1.s3.am…accounts%2F1155%2Fmeta-messages%2F59bc4a40-d47b-45e6-8f0c-259937a8c2ae.png"
    }];
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
                // if (demo.rssi > -59) {
                  const demoId = this.getDemoId(demo);
                  let isFavorited = this.state.favorites.includes(demoId);
                  const favicon = demo.faviconUrl;
                  return (
                    <View key={index}>
                      <Card style={styles.card}>
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
                        <CardItem cardBody button onPress={() => this.goToHomepage(demo)}>
                          <Text>{demo.desc}</Text>
                        </CardItem>
                      </Card>
                      </View>
                  );
                // }
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