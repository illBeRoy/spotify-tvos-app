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
import { SpotifyPlayerState, SpotifyAPI } from './api/spotify';
import { EmptyState } from './components/EmptyState/component';
import { Logo } from './components/Logo/component';

export interface AppState {
  ready: boolean;
  playerState: SpotifyPlayerState;
}

export default class App extends React.Component<{}, AppState> {
  readonly state: AppState = { playerState: null, ready: false };
  private spotifyApi = new SpotifyAPI();
  private syncPollingInterval;

  async componentDidMount() {
    this.sync();
    this.syncPollingInterval = setInterval(this.sync, 1000);
  }

  async componentWillUnmount() {
    clearInterval(this.syncPollingInterval);
  }

  sync = async () => {
    this.setState({
      playerState: await this.spotifyApi.getPlayerStateIfExists(),
      ready: true
    });
  }

  onPressPlay = () => {
    const { playerState } = this.state;
    if (playerState.isPlaying) {
      this.spotifyApi.pause();
    } else {
      this.spotifyApi.play();
    }
  }

  onPressForward = () => {
    this.spotifyApi.next();
  }

  onPressPrevious = () => {
    this.spotifyApi.previous();
  }

  renderLogo() {
    return <Logo/>;
  }

  renderEmptyState() {
    return <EmptyState/>;
  }

  renderPlayer() {
    const { playerState } = this.state;
    const playerProps: PlayerProps = {
      artUrl: playerState.currentlyPlayingTrack.coverImageUrl,
      playingDeviceType: playerState.playingDevice.type,
      playingDeviceName: playerState.playingDevice.name,
      trackName: playerState.currentlyPlayingTrack.track,
      artistName: playerState.currentlyPlayingTrack.artist,
      albumName: playerState.currentlyPlayingTrack.album,
      onPressPlay: this.onPressPlay,
      onPressForward: this.onPressForward,
      onPressRewind: this.onPressPrevious
    };

    return <Player {...playerProps} />;
  }

  render() {
    const { ready, playerState } = this.state;

    return (
      <View style={style.container}>
        { ready ?
          (playerState ? this.renderPlayer() : this.renderEmptyState()) :
          this.renderLogo()
        }
      </View>
    );
  }
}
