import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  AsyncStorage
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
      isFavorited: false
    });
  },

  componentDidMount() {
    BeaconBridge.initPhyManagerWithApiKey("51fd9f81-3d04-5c1b-8cd3-d86a3ea04453");
    NativeAppEventEmitter.addListener('BeaconsFound', (demos) => {
      this.setState({tempDemoArray: JSON.parse(demos)});
    });
    BeaconBridge.startScanningForBeacons();
    this.setTimeout(() => {
      BeaconBridge.stopScanningForBeacons()
      this.setState({demos: this.state.tempDemoArray});
      this.scanForDemos();
    }, 4000);

    emitter.addListener('logout', () => {
      BeaconBridge.stopScanningForBeacons();
    });

  },

  componentWillUnmount() {
    BeaconBridge.stopScanningForBeacons();
  },

  scanForDemos() {
    BeaconBridge.stopScanningForBeacons();
    BeaconBridge.startScanningForBeacons();
    this.setTimeout(() => {
      BeaconBridge.stopScanningForBeacons()
      this.setState({demos: this.state.tempDemoArray});
      this.scanForDemos();
    }, 4000);
  },

  favoritePressed(checked, cardData) {

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
        } else {
          data.favorites = data.favorites.filter(upd => {
            return upd.scanUrl !== obj.scanUrl;
          });
        }
        return AsyncStorage.mergeItem('currentUser', JSON.stringify(data));
      })
      .catch(error => console.log('Error!'));

  },

  goToFavorites() {
    console.log("Card pressed");
  },

  render() {

    return (
      <View style={styles.container} >
        <ParallaxView
          backgroundSource={require('../imgs/groupstandard.jpg')}
          windowHeight={140} >
          <View style={styles.demoContainer}>
            <View style={styles.scrollContainer}>
              <Text style={styles.mainHeader}>Demos Near Me</Text>
              {
                this.state.demos.map((demo, index) => {
                  const favicon = demo.faviconUrl;
                  return (
                    <Card key={index}>
                      <CardItem>
                        <Thumbnail source={{uri: favicon}} />
                        <Text>{demo.title}</Text>
                        <CheckBox
                          size={30}
                          checked={this.state.isFavorited}
                          onPress={() => this.favoritePressed(this.state.isFavorited, demo)}
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
  demoContainer: {
    height: 500
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