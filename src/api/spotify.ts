import axios from 'axios';
import config from './spotify.config'; // config has private spotify secrets. create your own config file for this to work
import { APIGetPlayerResponse } from './external-types';

export type DeviceType = 'Computer' | 'Smartphone' | 'Speaker';

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

  @refreshAccessTokenIfFailed
  async getPlayerStateIfExists(): Promise<SpotifyPlayerState> {
    await this.assertAccessTokenExists();
    const { status, data } = await this.axios().get<APIGetPlayerResponse>('/v1/me/player');

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

  @refreshAccessTokenIfFailed
  async play(): Promise<void> {
    await this.assertAccessTokenExists();
    await this.axios().put('/v1/me/player/play');
  }

  @refreshAccessTokenIfFailed
  async pause(): Promise<void> {
    await this.assertAccessTokenExists();
    await this.axios().put('/v1/me/player/pause');
  }

  @refreshAccessTokenIfFailed
  async next(): Promise<void> {
    await this.assertAccessTokenExists();
    await this.axios().post('/v1/me/player/next');
  }

  @refreshAccessTokenIfFailed
  async previous(): Promise<void> {
    await this.assertAccessTokenExists();
    await this.axios().post('/v1/me/player/previous');
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

function refreshAccessTokenIfFailed(target: SpotifyAPI, key: keyof SpotifyAPI, descriptor: PropertyDescriptor) {
  if (descriptor === undefined) {
    descriptor = Object.getOwnPropertyDescriptor(target, key);
  }
  const method = descriptor.value;

  descriptor.value = async function(...args) {
    while (true) {
      try {
        return await method.apply(this, args);
      } catch (err) {
        if (err && err.response && err.response.status === 401) {
          await this['refreshAccessToken'](this, []);
        } else {
          throw err;
        }
      }
    }
  };

  return descriptor;
};

export const spotifyApi = new SpotifyAPI();

// const spotifyAxios = (token = config.TOKEN): AxiosInstance => {
//   return axios.create({
//     headers: {
//       Authorization: `Bearer ${token}`,
//       Accept: 'application/json',
//       'Content-Type': 'application/json'
//     },
//     baseURL: 'https://api.spotify.com/v1'
//   });
// };

// const param = encodeURIComponent;

// export const searchSongUriByName = (songName: string): Promise<string> => {
//   return spotifyAxios()
//     .get(`/search?q=${param(songName)}&type=track&limit=1`)
//     .then(res => res.data.tracks.items[0].uri)
//     .catch(err => alert(JSON.stringify(err.response.data)));
// };

// export const playSongByUri = async (songUri: string): Promise<void> => {
//   await spotifyAxios().put('/me/player/play', { uris: [songUri] }).catch(err => alert(JSON.stringify(err.response.data)));
// };
