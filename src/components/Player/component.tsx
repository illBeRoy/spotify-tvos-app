import * as React from 'react';
import { View, Image, ImageURISource, Text, TouchableOpacity as TO } from 'react-native';
import style from './style';

const TouchableOpacity: any = TO;

export type DeviceType = 'Computer' | 'Mobile' | 'Speaker';

export interface PlayerProps {
  playingDeviceType: DeviceType;
  playingDeviceName: string;
  artUrl: string;
  trackName: string;
  artistName: string;
  albumName: string;
  nextTrackName?: string;
  onPressPlay(): void;
  onPressRewind(): void;
  onPressForward(): void;
}

const deviceImages: { [dt in DeviceType]: ImageURISource } = {
  Computer: require('../../assets/laptop.png'),
  Mobile: require('../../assets/smartphone.png'),
  Speaker: require('../../assets/speaker.png')
};

export class Player extends React.PureComponent<PlayerProps> {
  render() {
    const { artUrl, playingDeviceType, playingDeviceName, trackName, artistName, albumName, onPressPlay, onPressRewind, onPressForward, nextTrackName } = this.props;

    return (
      <View style={style.container} >
        <Image testID='player-background-image' style={style.backgroundImage} blurRadius={30} source={{ uri: artUrl }} />
        <View style={style.deviceInformationBar}>
          <Image testID='player-device-image' source={deviceImages[playingDeviceType]} />
          <Text testID='player-device-name' style={style.deviceNameText}>{playingDeviceName}</Text>
        </View>

        <View style={style.mainAreaContainer} >
          <Image testID='player-track-circle-image' style={style.albumArtCircle} source={{ uri: artUrl }} />
          <Text testID='player-track-name' style={style.trackNameText}>{trackName}</Text>
          <Text testID='player-track-info' style={style.trackInfoText}>{artistName} - {albumName}</Text>
          <View style={style.buttonsStrip}>
            <TouchableOpacity testID='player-rw-button' style={style.rwButton} onPress={onPressRewind} tvParallaxProperties={{ magnification: 1.05 }}>
              <Image source={require('../../assets/rw-in-circle.png')} />
            </TouchableOpacity>
            <TouchableOpacity testID='player-play-button' style={style.playButton} onPress={onPressPlay} hasTVPreferredFocus tvParallaxProperties={{ magnification: 1.1 }}>
              <Image source={require('../../assets/play-in-circle.png')} />
            </TouchableOpacity>
            <TouchableOpacity testID='player-ff-button' style={style.ffButton} onPress={onPressForward} tvParallaxProperties={{ magnification: 1.05 }}>
              <Image source={require('../../assets/ff-in-circle.png')} />
            </TouchableOpacity>
          </View>
        </View>

        { nextTrackName &&
          <View testID='player-next-track-bar' style={style.nextSongBar}>
            <Text testID='player-next-track-indication' style={style.nextSongIndication}>Up Next </Text>
            <Text testID='player-next-track-name' style={style.nextSongName}>{nextTrackName}</Text>
          </View>
        }
      </View>
    );
  }
}
