import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image
} from 'react-native';
import {Button, Container, Content, List, ListItem, InputGroup, Icon, Input } from 'native-base';
import { Actions } from 'react-native-router-flux';

const Register = React.createClass({

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

  loginPressed() {
    Actions.pop();
  },

  registerPressed() {

    // ENDPOINT
    const ENDPOINT = 'http://10.0.0.44:3000/api/users';

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
        console.log(data);
        Actions.login({type: ""});
      } else {
        this.setState({errorMsg: data});
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
          <Button block success onPress={this.registerPressed}>Register</Button>
        </View>
        <Text onPress={this.loginPressed}>Have an account? Log in</Text>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    alignItems: 'center'
  },
  logo: {
    width: 150, 
    height: 150
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

module.exports = Register;