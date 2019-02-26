import * as React from 'react';
import { ImageURISource } from 'react-native';
import { Chance } from 'chance';
import { render, RenderAPI, fireEvent } from 'react-native-testing-library';
import { until } from '../test/utils/until';
import { exists } from '../test/utils/exists';
import { SpotifyAPIDriver } from './api/spotify.driver';
import { APIGetPlayerResponse } from './api/external-types';
import { Logo } from './components/Logo/component';
import { EmptyState } from './components/EmptyState/component';
import { Player } from './components/Player/component';
import App from './App';

export class AppDriver {
  private spotifyApiDriver = new SpotifyAPIDriver();
  private app: RenderAPI;

  tearDown() {
    this.spotifyApiDriver.tearDown();
    this.app.unmount();
  }

  given = {
    authorizedToUseApi: () => {
      this.spotifyApiDriver.given.accessToken(Chance().guid());
      return this;
    },
    remotePlayerState: (apiGetPlayerResponse: APIGetPlayerResponse) => {
      this.spotifyApiDriver.given.getMePlayerResponse(apiGetPlayerResponse);
      return this;
    },
    emptyRemotePlayerState: () => {
      this.spotifyApiDriver.given.emptyGetMePlayerResponse();
      return this;
    },
    onPlayApiRequestReceived: (onPlayApiRequestReceived: jest.Mock) => {
      this.spotifyApiDriver.given.onPlayRequestReceived(onPlayApiRequestReceived);
      return this;
    },
    onPauseApiRequestReceived: (onPauseApiRequestReceived: jest.Mock) => {
      this.spotifyApiDriver.given.onPauseRequestReceived(onPauseApiRequestReceived);
      return this;
    },
    onForwardApiRequestReceived: (onForwardApiRequestReceived: jest.Mock) => {
      this.spotifyApiDriver.given.onNextRequestReceived(onForwardApiRequestReceived);
      return this;
    },
    onPreviousApiRequestReceived: (onPreviousApiRequestReceived: jest.Mock) => {
      this.spotifyApiDriver.given.onPreviousRequestReceived(onPreviousApiRequestReceived);
      return this;
    },
  };

  when = {
    startingApp: () => {
      this.app = render(<App />);
      return this;
    },
    playerIsShowing: async () => {
      await until(() =>
        exists(this.app.queryByType(Player)));
    },
    pressingPlayButton: () => {
      fireEvent.press(this.app.getByTestId('player-play-button'));
      return this;
    },
    pressingFFButton: () => {
      fireEvent.press(this.app.getByTestId('player-ff-button'));
      return this;
    },
    pressingRewindButton: () => {
      fireEvent.press(this.app.getByTestId('player-rw-button'));
      return this;
    },
  };

  get = {
    backgroundImage: (): ImageURISource => {
      return this.app.getByTestId('player-background-image').props.source;
    },
    deviceImage: (): ImageURISource => {
      return this.app.getByTestId('player-device-image').props.source;
    },
    deviceNameText: (): string => {
      return this.app.getByTestId('player-device-name').props.children;
    },
    trackCircleImage: (): ImageURISource => {
      return this.app.getByTestId('player-track-circle-image').props.source;
    },
    trackNameLabelText: (): string => {
      return this.app.getByTestId('player-track-name').props.children;
    },
    trackInfoLabelText: (): string => {
      return this.app.getByTestId('player-track-info').props.children.join('');
    },
    nextTrackLabelText: (): string => {
      return this.app.getByTestId('player-next-track-bar').findByProps({ testID: 'player-next-track-name' }).props.children;
    },
    nextTrackIndicationIsVisible: (): boolean => {
      return exists(this.app.getByTestId('player-next-track-bar').findByProps({ testID: 'player-next-track-indication' }));
    },
    nextTrackBarIsVisible: (): boolean => {
      return exists(this.app.queryByProps({ testID: 'player-next-track-bar' }));
    },
    displayingLogoView: (): boolean => {
      return exists(this.app.queryByType(Logo));
    },
    displayingEmptyStateView: (): boolean => {
      return exists(this.app.queryByType(EmptyState));
    }
  };
}
