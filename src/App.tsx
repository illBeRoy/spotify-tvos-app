/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/emin93/react-native-template-typescript
 *
 * @format
 */

import * as React from 'react';
import { View } from 'react-native';
import { Player, PlayerProps } from './components/Player/component';
import style from './App.style';

const mockProps: PlayerProps = {
  artUrl: 'https://i.scdn.co/image/03d97de27e99fd8099506ea172531cea0da59654',
  playingDeviceType: 'Speaker',
  playingDeviceName: 'Living Room Speaker',
  trackName: 'Chandelier',
  artistName: 'Sia',
  albumName: '1000 forms of fear',
  nextTrackName: 'Dancing in the Moonlight',
  onPressPlay: () => alert('pressed play man'),
  onPressForward: () => alert('pressed ff man'),
  onPressRewind: () => alert('pressed rw man')
};

export default class App extends React.Component {
  render() {
    return (
      <View style={style.container}>
        <Player {...mockProps} />
      </View>
    );
  }
}
