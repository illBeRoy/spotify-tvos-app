import * as React from 'react';
import { View, Image } from 'react-native';
import style from './style';

export class Logo extends React.PureComponent {
  render() {
    return (
      <View style={style.container}>
        <Image source={require('../../assets/spotify.png')}/>
      </View>
    );
  }
}
