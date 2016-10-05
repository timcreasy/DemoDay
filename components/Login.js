import React from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';
import {Button, Container, Content, List, ListItem, InputGroup, Icon, Input } from 'native-base';
import { Actions } from 'react-native-router-flux';

const Login = React.createClass({

  getInitialState() {
    return({
      email: "",
      password: ""
    });
  },

  emailChanged(input) {
    this.setState({email: input});
  },

  passwordChanged(input) {
    this.setState({password: input});
  },

  loginPressed() {

    // ENDPOINT
    const ENDPOINT = 'http://10.0.0.44:3000/api/login';

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
      console.log("RES", response);
      return response.json();
    })
    .then((data) => {
      console.log("DA", data);
      console.log(data);
    })
    .catch(err => console.log(err));

    Actions.home({type: "reset"});

  },

  render() {
    return (
      <View style={styles.container} >
        <InputGroup>
          <Icon name='ios-person' />
          <Input placeholder='Email' onChangeText={this.emailChanged} />
        </InputGroup>

        <InputGroup>
          <Icon name='ios-unlock' />
          <Input placeholder='Password' onChangeText={this.passwordChanged} secureTextEntry={true}/>
        </InputGroup>
        <View style={styles.buttonContainer}>
          <Button block success onPress={this.loginPressed}>Login</Button>
        </View>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    paddingTop: 64,
  },

  buttonContainer: {
    padding: 20
  }
})

module.exports = Login;