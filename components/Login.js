import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  AsyncStorage
} from 'react-native';
import {Button, Container, Content, List, ListItem, InputGroup, Icon, Input } from 'native-base';
import { Actions } from 'react-native-router-flux';

const Login = React.createClass({

  getInitialState() {
    return({
      email: "",
      password: "",
      errorMsg: "",
    });
  },

  emailChanged(input) {
    this.setState({email: input});
  },

  passwordChanged(input) {
    this.setState({password: input});
  },

  registerPressed() {
    Actions.register();
  },

  loginPressed() {

    // ENDPOINT
    const ENDPOINT = 'http://104.236.71.66:3000/api/login';

    const requestObj = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    };

    fetch(ENDPOINT, requestObj)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.user) {
        AsyncStorage.setItem('currentUser', JSON.stringify(data.user));
        Actions.home({type: "reset"});
      } else {
        this.setState({errorMsg: data.msg});
      }
    })
    .catch(err => console.log(err));

  },

  render() {
    return (
      <View style={styles.container} >
        <Image
          style={styles.logo}
          source={require('../imgs/logoooo.png')}
        />
        
        <InputGroup>
          <Icon name='ios-person' />
          <Input placeholder='Email' onChangeText={this.emailChanged} keyboardType="email-address" autoCapitalize="none"/>
        </InputGroup>

        <InputGroup>
          <Icon name='ios-unlock' />
          <Input placeholder='Password' onChangeText={this.passwordChanged} secureTextEntry={true}/>
        </InputGroup>
        <View>
          {(() => {
            if (this.state.errorMsg) {
              return (
                <View style={styles.errorContainer}>
                  <Text>{this.state.errorMsg}</Text>
                </View>
              );
            }
          })()}
        </View>
        {(() => {
            if (this.state.errorMsg) {
              <View style={styles.errorContainer}>
                <Text>{this.state.errorMsg}</Text>
              </View>
            }
          }
        )}
        <View style={styles.buttonContainer}>
          <Button block success onPress={this.loginPressed}>Login</Button>
        </View>
        <Text onPress={this.registerPressed}>Don't have an account?</Text>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    paddingLeft: 5,
    paddingRight: 5,
    alignItems: 'center'
  },
  logo: {
    width: 150, 
    height: 150
  },  
  headerContainer: {
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center'
  },
  buttonContainer: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 20,
    paddingLeft: 20
  }
})

module.exports = Login;