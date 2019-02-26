import axios from 'axios';
import config from './spotify.config'; // config has private spotify secrets. create your own config file for this to work
import { APIGetPlayerResponse } from './external-types';

export type DeviceType = 'Computer' | 'Smartphone' | 'CastAudio';

export interface SpotifyPlayerState {
  isPlaying: boolean;
  playingDevice: {
    type: DeviceType;
    name: string;
  };
  currentlyPlayingTrack: {
    track: string;
    artist: string;
    album: string;
    coverImageUrl: string;
  };
}

export class SpotifyAPI {
  private accessToken: string;

  async getPlayerStateIfExists(): Promise<SpotifyPlayerState> {
    await this.assertAccessTokenExists();

    const { status, data } = await this.axios().get<APIGetPlayerResponse>('/v1/me/player')
      .catch(() => this.refreshAccessToken().then(() => this.axios().get<APIGetPlayerResponse>('/v1/me/player')));

    if (status === 200) {
      const largestImage = data.item.album.images.reduce((largestImage, image) => image.width * image.height > largestImage.width * largestImage.height ? image : largestImage, data.item.album.images[0]);

      return {
        isPlaying: data.is_playing,
        playingDevice: {
          type: data.device.type,
          name: data.device.name
        },
        currentlyPlayingTrack: {
          track: data.item.name,
          artist: data.item.artists[0].name,
          album: data.item.album.name,
          coverImageUrl: largestImage.url
        }
      };
    }

    return null;
  }

  async play(): Promise<void> {
    await this.assertAccessTokenExists();
    await this.axios().put('/v1/me/player/play')
      .catch(() => this.refreshAccessToken().then(() => this.axios().put('/v1/me/player/play')));
  }

  async pause(): Promise<void> {
    await this.assertAccessTokenExists();
    await this.axios().put('/v1/me/player/pause')
      .catch(() => this.refreshAccessToken().then(() => this.axios().put('/v1/me/player/pause')));
  }

  async next(): Promise<void> {
    await this.assertAccessTokenExists();
    await this.axios().post('/v1/me/player/next')
      .catch(() => this.refreshAccessToken().then(() => this.axios().post('/v1/me/player/next')));
  }

  async previous(): Promise<void> {
    await this.assertAccessTokenExists();
    await this.axios().post('/v1/me/player/previous')
      .catch(() => this.refreshAccessToken().then(() => this.axios().post('/v1/me/player/previous')));
  }

  private async assertAccessTokenExists() {
    if (!this.accessToken) {
      await this.refreshAccessToken();
    }
  }

  private async refreshAccessToken(): Promise<void> {
    const res = await axios.post(
      `https://accounts.spotify.com/api/token?grant_type=refresh_token&refresh_token=${config.REFRESH_TOKEN}`,
      '',
      {
        headers: {
          Authorization: `Basic ${config.CLIENT_AUTH}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    this.accessToken = res.data.access_token;
  }

  private axios() {
    return axios.create({
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      baseURL: 'https://api.spotify.com'
    });
  }
}
