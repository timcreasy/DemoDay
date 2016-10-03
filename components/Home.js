import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  RefreshControl
} from 'react-native';
import ParallaxView from 'react-native-parallax-view';
import { NativeModules } from 'react-native';
import { NativeAppEventEmitter } from 'react-native';
import {Card, CardItem, Thumbnail } from 'native-base';

const BeaconBridge = NativeModules.BeaconBridge;

const Home = React.createClass({

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
      <View style={styles.container} >
        <ParallaxView
          backgroundSource={require('../imgs/main.jpg')}
          windowHeight={140} 
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.scanForDemos}
            />
          } >
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
                    </CardItem>
                    <CardItem cardBody>
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