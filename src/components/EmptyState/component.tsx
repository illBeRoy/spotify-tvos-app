import * as React from 'react';
import { View, Text } from 'react-native';
import style from './style';

export class EmptyState extends React.PureComponent {
  render() {
    return (
      <View style={style.container}>
        <Text style={style.alert}>Seems like there’s no active Spotify session</Text>
        <Text style={style.description}>Start listening. We’ll catch up.</Text>
      </View>
    );
  }
}
