import * as React from 'react';
import { ImageURISource } from 'react-native';
import { Chance } from 'chance';
import { render, RenderAPI, fireEvent } from 'react-native-testing-library';
import { DeviceType } from '../../api/spotify';
import { Player } from './component';

export class PlayerComponentDriver {
  private deviceType: DeviceType = Chance().pickone<DeviceType>(['Computer', 'Smartphone', 'Speaker']);
  private deviceName = Chance().string();
  private artUrl = Chance().url();
  private trackName = Chance().string();
  private artistName = Chance().string();
  private albumName = Chance().string();
  private nextTrackName = Chance().pickone([Chance().string(), null]);
  private onPressPlay = jest.fn();
  private onPressRewind = jest.fn();
  private onPressForward = jest.fn();
  private component: RenderAPI;

  tearDown() {
    if (this.component) {
      this.component.unmount();
    }
  }

  given = {
    artUrl: (artUrl: string) => {
      this.artUrl = artUrl;
      return this;
    },
    deviceType: (deviceType: DeviceType) => {
      this.deviceType = deviceType;
      return this;
    },
    deviceName: (deviceName: string) => {
      this.deviceName = deviceName;
      return this;
    },
    trackName: (trackName: string) => {
      this.trackName = trackName;
      return this;
    },
    artistName: (artistName: string) => {
      this.artistName = artistName;
      return this;
    },
    albumName: (albumName: string) => {
      this.albumName = albumName;
      return this;
    },
    nextTrackName: (nextTrackName: string) => {
      this.nextTrackName = nextTrackName;
      return this;
    },
    onPressPlay: (onPressPlay: jest.Mock) => {
      this.onPressPlay = onPressPlay;
      return this;
    },
    onPressRewind: (onPressRewind: jest.Mock) => {
      this.onPressRewind = onPressRewind;
      return this;
    },
    onPressForward: (onPressForward: jest.Mock) => {
      this.onPressForward = onPressForward;
      return this;
    }
  };

  when = {
    renderingPlayer: () => {
      this.component = render(<Player
        playingDeviceType={this.deviceType}
        playingDeviceName={this.deviceName}
        artUrl={this.artUrl}
        trackName={this.trackName}
        artistName={this.artistName}
        albumName={this.albumName}
        nextTrackName={this.nextTrackName}
        onPressPlay={this.onPressPlay}
        onPressRewind={this.onPressRewind}
        onPressForward={this.onPressForward}
      />);
      return this;
    },
    pressingPlayButton: () => {
      fireEvent.press(this.component.getByTestId('player-play-button'));
      return this;
    },
    pressingRewindButton: () => {
      fireEvent.press(this.component.getByTestId('player-rw-button'));
      return this;
    },
    pressingForwardButton: () => {
      fireEvent.press(this.component.getByTestId('player-ff-button'));
      return this;
    }
  };

  get = {
    backgroundImage: (): ImageURISource => {
      return this.component.getByTestId('player-background-image').props.source;
    },
    deviceImage: (): ImageURISource => {
      return this.component.getByTestId('player-device-image').props.source;
    },
    deviceNameText: (): string => {
      return this.component.getByTestId('player-device-name').props.children;
    },
    trackCircleImage: (): ImageURISource => {
      return this.component.getByTestId('player-track-circle-image').props.source;
    },
    trackNameLabelText: (): string => {
      return this.component.getByTestId('player-track-name').props.children;
    },
    trackInfoLabelText: (): string => {
      return this.component.getByTestId('player-track-info').props.children.join('');
    },
    nextTrackLabelText: (): string => {
      return this.component.getByTestId('player-next-track-bar').findByProps({ testID: 'player-next-track-name' }).props.children;
    },
    nextTrackIndicationIsVisible: (): boolean => {
      return !!(this.component.getByTestId('player-next-track-bar').findByProps({ testID: 'player-next-track-indication' }));
    },
    nextTrackBarIsVisible: (): boolean => {
      return !!(this.component.queryByProps({ testID: 'player-next-track-bar' }));
    }
  };
}
