import React from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';
import { NativeModules } from 'react-native';
import { NativeAppEventEmitter } from 'react-native';
import {Card, CardItem, Thumbnail } from 'native-base';

 const BeaconBridge = NativeModules.BeaconBridge;

const DemoList = React.createClass({

  getInitialState() {
    return({
      demos: [],
      tempDemoArray: [],
      refreshing: false
    });
  },

  componentDidMount() {
    BeaconBridge.initPhyManagerWithApiKey("51fd9f81-3d04-5c1b-8cd3-d86a3ea04453");
    NativeAppEventEmitter.addListener('BeaconsFound', (demos) => {
      this.setState({tempDemoArray: JSON.parse(demos)});
    });
    BeaconBridge.startScanningForBeacons();
    this.setState({refreshing: true});
    setTimeout(() => {
      BeaconBridge.stopScanningForBeacons()
      this.setState({refreshing: false});
      this.setState({demos: this.state.tempDemoArray});
    }, 4000);
  },

  componentWillUnmount() {
    BeaconBridge.stopScanningForBeacons();
  },

  scanForDemos() {
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
      {
        this.state.demos.map((demo, index) => {
          const favicon = beacon.faviconUrl;
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
    );
  }
});

module.exports = DemoList;