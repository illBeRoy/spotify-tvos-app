import * as React from 'react';
import { View, Image, ImageURISource, Text } from 'react-native';
import style from './style';

export type DeviceType = 'Computer' | 'Mobile' | 'Speaker';

export interface PlayerProps {
  artUrl: string;
  playingDeviceType: DeviceType;
  playingDeviceName: string;
}

const deviceImages: { [dt in DeviceType]: ImageURISource } = {
  Computer: require('../../assets/laptop.png'),
  Mobile: require('../../assets/smartphone.png'),
  Speaker: require('../../assets/speaker.png')
};

export class Player extends React.PureComponent<PlayerProps> {
  render() {
    const { artUrl, playingDeviceType, playingDeviceName } = this.props;

    return (
      <View style={style.container} >
        <Image testID='player-background-image' style={style.backgroundImage} blurRadius={30} source={{ uri: artUrl }} />
        <View style={style.deviceInformationBar}>
          <Image testID='player-device-image' source={deviceImages[playingDeviceType]} />
          <Text testID='player-device-name' style={style.deviceNameText}>{playingDeviceName}</Text>
        </View>
      </View>
    );
  }
}
