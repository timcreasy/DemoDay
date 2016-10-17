import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  AsyncStorage
} from 'react-native';
import ParallaxView from 'react-native-parallax-view';
import { NativeModules } from 'react-native';
import { NativeAppEventEmitter } from 'react-native';
import {Card, CardItem, Thumbnail } from 'native-base';
import CheckBox from 'react-native-icon-checkbox';
import { Actions } from 'react-native-router-flux';

const BeaconBridge = NativeModules.BeaconBridge;

const Home = React.createClass({

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
    setTimeout(() => {
      BeaconBridge.stopScanningForBeacons()
      this.setState({demos: this.state.tempDemoArray});
      this.scanForDemos();
    }, 4000);

  },

  componentWillUnmount() {
    BeaconBridge.stopScanningForBeacons();
  },

  scanForDemos() {
      BeaconBridge.stopScanningForBeacons();
      BeaconBridge.startScanningForBeacons();
      setTimeout(() => {
        BeaconBridge.stopScanningForBeacons()
        this.setState({demos: this.state.tempDemoArray});
        this.scanForDemos();
      }, 4000);
  },

  favoritePressed(checked, cardData) {

    // Toggle isFavorited
    this.setState({
      isFavorited: !checked,
    });

    if (checked) {
      AsyncStorage.getItem('currentUser')
        .then(res => JSON.parse(res))
        .then(data => {
          if (!data.favorites) { data.favorites = [] };
          data.favorites.push(cardData);
          return AsyncStorage.mergeItem('currentUser', JSON.stringify(data));
        })
        .catch(error => console.log('Error!'));
    }

  },

  goToFavorites() {
    Actions.favorites();
  },

  render() {
    return (
      <View style={styles.container} >
        <ParallaxView
          backgroundSource={require('../imgs/groupstandard.jpg')}
          windowHeight={140} >
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