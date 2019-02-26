import * as nock from 'nock';
import config from './spotify.config';
import { APIGetPlayerResponse } from './external-types';

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com';
const SPOTIFY_API_URL = 'https://api.spotify.com';

export class SpotifyAPIDriver {
  private accessToken: string;

  tearDown() {
    nock.cleanAll();
  }

  given = {
    accessToken: (accessToken: string, onAccessTokenRequest?: jest.Mock) => {
      this.accessToken = accessToken;
      nock(SPOTIFY_AUTH_URL)
        .post('/api/token', '', { reqheaders: { authorization: `Basic ${config.CLIENT_AUTH}`, 'content-type': 'application/x-www-form-urlencoded' } })
        .query({ grant_type: 'refresh_token', refresh_token: config.REFRESH_TOKEN })
        .reply(200, () => {
          if (onAccessTokenRequest) {
            onAccessTokenRequest();
          }
          return { access_token: accessToken };
        });

      return this;
    },
    getMePlayerResponse: (response: APIGetPlayerResponse) => {
      nock(SPOTIFY_API_URL)
        .get('/v1/me/player', '', { reqheaders: { authorization: `Bearer ${this.accessToken}` } })
        .reply(200, response);

      return this;
    },
    emptyGetMePlayerResponse: () => {
      nock(SPOTIFY_API_URL)
        .get('/v1/me/player', '', { reqheaders: { authorization: `Bearer ${this.accessToken}` } })
        .reply(204);

      return this;
    },
    onPlayRequestReceived: (spotifyPlayRequestReceived: jest.Mock, status = 204) => {
      nock(SPOTIFY_API_URL)
        .put('/v1/me/player/play', '', { reqheaders: status === 204 ? { authorization: `Bearer ${this.accessToken}` } : {} })
        .reply(status, spotifyPlayRequestReceived);

      return this;
    },
    onPauseRequestReceived: (spotifyPauseRequestReceived: jest.Mock) => {
      nock(SPOTIFY_API_URL)
        .put('/v1/me/player/pause', '', { reqheaders: { authorization: `Bearer ${this.accessToken}` } })
        .reply(204, spotifyPauseRequestReceived);

      return this;
    },
    onNextRequestReceived: (spotifyNextRequestReceived: jest.Mock) => {
      nock(SPOTIFY_API_URL)
        .post('/v1/me/player/next', '', { reqheaders: { authorization: `Bearer ${this.accessToken}` } })
        .reply(204, spotifyNextRequestReceived);

      return this;
    },
    onPreviousRequestReceived: (spotifyPreviousRequestReceived: jest.Mock) => {
      nock(SPOTIFY_API_URL)
        .post('/v1/me/player/previous', '', { reqheaders: { authorization: `Bearer ${this.accessToken}` } })
        .reply(204, spotifyPreviousRequestReceived);

      return this;
    }
  };
}
