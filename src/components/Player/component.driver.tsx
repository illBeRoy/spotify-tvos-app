import * as React from 'react';
import { ImageURISource } from 'react-native';
import { Chance } from 'chance';
import { render, RenderAPI } from 'react-native-testing-library';
import { Player, DeviceType } from './component';

export class PlayerComponentDriver {
  private artUrl = Chance().url();
  private deviceType: DeviceType = Chance().pickone<DeviceType>(['Computer', 'Mobile', 'Speaker']);
  private deviceName = Chance().string();
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
    }
  };

  when = {
    renderingPlayer: () => {
      this.component = render(<Player
        artUrl={this.artUrl}
        playingDeviceType={this.deviceType}
        playingDeviceName={this.deviceName}
      />);
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
    }
  };
}
