import React from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';
import ParallaxView from 'react-native-parallax-view';
import { NativeModules } from 'react-native';
import { NativeAppEventEmitter } from 'react-native';
import {Card, CardItem, Thumbnail } from 'native-base';
import CheckBox from 'react-native-icon-checkbox';
import { Actions } from 'react-native-router-flux';

window.navigator.userAgent = 'react-native';
import io from 'socket.io-client/socket.io';

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

    const socket = io('localhost:3000', {jsonp: false});
    socket.on('connect', () => {
      console.log("Connected: ", socket.id);
    });

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
    // }
  },

  favoritePressed(checked) {
    this.setState({
      isFavorited: checked,
    });
  },

  goToFavorites() {
    Actions.favorites();
  },

  render() {
    return (
      <View style={styles.container} >
        <ParallaxView
          backgroundSource={require('../imgs/main.jpg')}
          windowHeight={140} >
          <View style={styles.scrollContainer}>
            <Text style={styles.mainHeader}>Demos Near Me</Text>
            {
              this.state.demos.map((demo, index) => {
                const favicon = demo.faviconUrl;
                return (
                  <Card key={index}>
                    <CardItem button onPress={this.goToFavorites}>
                      <Thumbnail source={{uri: favicon}} />
                      <Text>{demo.title}</Text>
                      <CheckBox
                        size={30}
                        checked={this.state.isFavorited}
                        onPress={this.favoritePressed}
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