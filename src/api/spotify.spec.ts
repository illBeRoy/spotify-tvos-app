import { Chance } from 'chance';
import { DeviceType, SpotifyAPI } from './spotify';
import { SpotifyAPIDriver } from './spotify.driver';
import { anAPIGetPlayerResponse, anAPIArtist, anAPIAlbumImage } from '../../test/builders/spotify-api-response';

describe('Spotify API client', () => {
  let driver: SpotifyAPIDriver;

  beforeEach(() =>
    driver = new SpotifyAPIDriver());

  afterEach(() =>
    driver.tearDown());

  describe('get player state', () => {
    it('should return the correct player state, using the correct authorization means', async () => {
      const accessToken = Chance().guid();
      const isPlaying = Chance().bool();
      const deviceName = Chance().string();
      const deviceType = Chance().pickone<DeviceType>(['Computer', 'Smartphone', 'CastAudio']);
      const trackName = Chance().string();
      const artistName = Chance().string();
      const albumName = Chance().string();
      const coverImageUrl = Chance().url();

      driver
        .given.accessToken(accessToken)
        .given.getMePlayerResponse(anAPIGetPlayerResponse()
          .withIsPlaying(isPlaying)
          .withDeviceName(deviceName)
          .withDeviceType(deviceType)
          .withItemName(trackName)
          .withArtists([anAPIArtist().withName(artistName).build()])
          .withAlbumName(albumName)
          .withAlbumImages([anAPIAlbumImage().withUrl(coverImageUrl).build()])
          .build());

      const spotifyApi = new SpotifyAPI();
      const playerState = await spotifyApi.getPlayerStateIfExists();

      expect(playerState).toEqual({
        isPlaying,
        playingDevice: {
          type: deviceType,
          name: deviceName
        },
        currentlyPlayingTrack: {
          track: trackName,
          artist: artistName,
          album: albumName,
          coverImageUrl
        }
      });
    });

    it('should contain the url of the largest image, if there are more than one image in the response\'s album images array', async () => {
      const accessToken = Chance().guid();
      const largestImage = anAPIAlbumImage().build();
      const images = new Array(Chance().integer({ min: 1, max: 5 }))
        .fill(null)
        .map(() => anAPIAlbumImage().smallerThan(largestImage.width, largestImage.height).build());

      driver
        .given.accessToken(accessToken)
        .given.getMePlayerResponse(anAPIGetPlayerResponse()
          .withAlbumImages(Chance().shuffle([...images, largestImage]))
          .build());

      const spotifyApi = new SpotifyAPI();
      const playerState = await spotifyApi.getPlayerStateIfExists();

      expect(playerState.currentlyPlayingTrack.coverImageUrl).toEqual(largestImage.url);
    });

    it('should return null if the player API response comes empty (204)', async () => {
      const accessToken = Chance().guid();

      driver
        .given.accessToken(accessToken)
        .given.emptyGetMePlayerResponse();

      const spotifyApi = new SpotifyAPI();
      const playerState = await spotifyApi.getPlayerStateIfExists();

      expect(playerState).toBe(null);
    });
  });

  describe('play', () => {
    it('should send a play request to the correct endpoint with the correct access token', async () => {
      const accessToken = Chance().guid();
      const spotifyPlayRequestReceived = jest.fn();

      driver
        .given.accessToken(accessToken)
        .given.onPlayRequestReceived(spotifyPlayRequestReceived);

      const spotifyApi = new SpotifyAPI();
      await spotifyApi.play();

      expect(spotifyPlayRequestReceived).toHaveBeenCalled();
    });
  });

  describe('pause', () => {
    it('should send a pause request to the correct endpoint with the correct access token', async () => {
      const accessToken = Chance().guid();
      const spotifyPauseRequestReceived = jest.fn();

      driver
        .given.accessToken(accessToken)
        .given.onPauseRequestReceived(spotifyPauseRequestReceived);

      const spotifyApi = new SpotifyAPI();
      await spotifyApi.pause();

      expect(spotifyPauseRequestReceived).toHaveBeenCalled();
    });
  });

  describe('next', () => {
    it('should send a next request to the correct endpoint with the correct access token', async () => {
      const accessToken = Chance().guid();
      const spotifyNextRequestReceived = jest.fn();

      driver
        .given.accessToken(accessToken)
        .given.onNextRequestReceived(spotifyNextRequestReceived);

      const spotifyApi = new SpotifyAPI();
      await spotifyApi.next();

      expect(spotifyNextRequestReceived).toHaveBeenCalled();
    });
  });

  describe('previous', () => {
    it('should send a previous request to the correct endpoint with the correct access token', async () => {
      const accessToken = Chance().guid();
      const spotifyPreviousRequestReceived = jest.fn();

      driver
        .given.accessToken(accessToken)
        .given.onPreviousRequestReceived(spotifyPreviousRequestReceived);

      const spotifyApi = new SpotifyAPI();
      await spotifyApi.previous();

      expect(spotifyPreviousRequestReceived).toHaveBeenCalled();
    });
  });

  describe('when making multiple requests', () => {
    it('should only request an access token once', async () => {
      const accessToken = Chance().guid();
      const refreshAccessTokenRequestReceived = jest.fn();

      driver
        .given.accessToken(accessToken, refreshAccessTokenRequestReceived)
        .given.emptyGetMePlayerResponse()
        .given.onPlayRequestReceived(jest.fn())
        .given.onPauseRequestReceived(jest.fn())
        .given.onNextRequestReceived(jest.fn())
        .given.onPreviousRequestReceived(jest.fn());

      const spotifyApi = new SpotifyAPI();
      await spotifyApi.getPlayerStateIfExists();
      await spotifyApi.play();
      await spotifyApi.pause();
      await spotifyApi.next();
      await spotifyApi.previous();

      expect(refreshAccessTokenRequestReceived).toHaveBeenCalledTimes(1);
    });
  });

  describe('when a request is being rejected with 401 unauthorized', () => {
    it('should request another access token', async () => {
      const firstAccessToken = Chance().guid();
      const onFirstAttempt = jest.fn();
      const secondAccessToken = Chance().guid();
      const onSecondAttempt = jest.fn();

      driver
        .given.accessToken(firstAccessToken)
        .given.onPlayRequestReceived(onFirstAttempt, 401)
        .given.accessToken(secondAccessToken)
        .given.onPlayRequestReceived(onSecondAttempt);

      const spotifyApi = new SpotifyAPI();
      await spotifyApi.play();

      expect(onFirstAttempt).toHaveBeenCalled();
      expect(onSecondAttempt).toHaveBeenCalled();
    });
  });
});
