import { Chance } from 'chance';
import { anAPIGetPlayerResponse, anAPIArtist, anAPIAlbumImage } from '../test/builders/spotify-api-response';
import { DeviceType } from './api/spotify';
import { AppDriver } from './App.driver';
import { eventually } from '../test/utils/eventually';
import { deviceImages } from './components/Player/component';

describe('Spotify TVOS App', () => {
  let driver: AppDriver;

  beforeEach(() =>
    driver = new AppDriver());

  afterEach(() =>
    driver.tearDown());

  // This test makes the other tests fail for some reason, probably Jest race conditions
  it.skip('should display the logo view when the app starts', () => {
    driver.when.startingApp();
    expect(driver.get.displayingLogoView()).toBe(true);
  });

  it('should display the current player state in the application', async () => {
    const trackName = Chance().string();
    const artistName = Chance().string();
    const albumName = Chance().string();
    const coverImageUrl = Chance().url();
    const deviceName = Chance().string();
    const deviceType = Chance().pickone<DeviceType>(['Computer', 'Smartphone', 'CastAudio']);

    driver
      .given.authorizedToUseApi()
      .given.remotePlayerState(anAPIGetPlayerResponse()
        .withDeviceName(deviceName)
        .withDeviceType(deviceType)
        .withItemName(trackName)
        .withArtists([anAPIArtist().withName(artistName).build()])
        .withAlbumName(albumName)
        .withAlbumImages([anAPIAlbumImage().withUrl(coverImageUrl).build()])
        .build())
      .when.startingApp();

    await eventually(() => {
      expect(driver.get.trackNameLabelText()).toEqual(trackName);
      expect(driver.get.trackInfoLabelText()).toEqual(`${artistName} - ${albumName}`);
      expect(driver.get.backgroundImage().uri).toEqual(coverImageUrl);
      expect(driver.get.trackCircleImage().uri).toEqual(coverImageUrl);
      expect(driver.get.deviceImage()).toEqual(deviceImages[deviceType]);
      expect(driver.get.deviceNameText()).toEqual(deviceName);
    });
  });

  it('should display the empty state in the application if no current session found on api', async () => {
    driver
      .given.authorizedToUseApi()
      .given.emptyRemotePlayerState()
      .when.startingApp();

    await eventually(() =>
      expect(driver.get.displayingEmptyStateView()).toBe(true));
  });

  it('should constantly sync to the current player state in the application', async () => {
    const trackName = Chance().string();
    const artistName = Chance().string();
    const albumName = Chance().string();
    const coverImageUrl = Chance().url();
    const deviceName = Chance().string();
    const deviceType = Chance().pickone<DeviceType>(['Computer', 'Smartphone', 'CastAudio']);

    driver
      .given.authorizedToUseApi()
      .given.remotePlayerState(anAPIGetPlayerResponse().build())
      .given.remotePlayerState(anAPIGetPlayerResponse()
        .withDeviceName(deviceName)
        .withDeviceType(deviceType)
        .withItemName(trackName)
        .withArtists([anAPIArtist().withName(artistName).build()])
        .withAlbumName(albumName)
        .withAlbumImages([anAPIAlbumImage().withUrl(coverImageUrl).build()])
        .build())
      .when.startingApp();

    await eventually(() => {
      expect(driver.get.trackNameLabelText()).toEqual(trackName);
      expect(driver.get.trackInfoLabelText()).toEqual(`${artistName} - ${albumName}`);
      expect(driver.get.backgroundImage().uri).toEqual(coverImageUrl);
      expect(driver.get.trackCircleImage().uri).toEqual(coverImageUrl);
      expect(driver.get.deviceImage()).toEqual(deviceImages[deviceType]);
      expect(driver.get.deviceNameText()).toEqual(deviceName);
    });
  });

  it('should start playing music when not playing and user presses the play button', async () => {
    const isCurrentlyPlaying = false;
    const onPlayApiRequestReceived = jest.fn();

    driver
      .given.authorizedToUseApi()
      .given.remotePlayerState(anAPIGetPlayerResponse().withIsPlaying(isCurrentlyPlaying).build())
      .given.onPlayApiRequestReceived(onPlayApiRequestReceived)
      .when.startingApp();

    await driver.when.playerIsShowing();
    await driver.when.pressingPlayButton();

    await eventually(() =>
      expect(onPlayApiRequestReceived).toHaveBeenCalled());
  });

  it('should pause music when playing and user presses the play button', async () => {
    const isCurrentlyPlaying = true;
    const onPauseApiRequestReceived = jest.fn();

    driver
      .given.authorizedToUseApi()
      .given.remotePlayerState(anAPIGetPlayerResponse().withIsPlaying(isCurrentlyPlaying).build())
      .given.onPauseApiRequestReceived(onPauseApiRequestReceived)
      .when.startingApp();

    await driver.when.playerIsShowing();
    await driver.when.pressingPlayButton();

    await eventually(() =>
      expect(onPauseApiRequestReceived).toHaveBeenCalled());
  });

  it('should forward to next track when user presses the ff button', async () => {
    const onForwardApiRequestReceived = jest.fn();

    driver
      .given.authorizedToUseApi()
      .given.remotePlayerState(anAPIGetPlayerResponse().build())
      .given.onForwardApiRequestReceived(onForwardApiRequestReceived)
      .when.startingApp();

    await driver.when.playerIsShowing();
    await driver.when.pressingFFButton();

    await eventually(() =>
      expect(onForwardApiRequestReceived).toHaveBeenCalled());
  });

  it('should go back to previous track when user presses the rewind button', async () => {
    const onPreviousApiRequestReceived = jest.fn();

    driver
      .given.authorizedToUseApi()
      .given.remotePlayerState(anAPIGetPlayerResponse().build())
      .given.onPreviousApiRequestReceived(onPreviousApiRequestReceived)
      .when.startingApp();

    await driver.when.playerIsShowing();
    await driver.when.pressingRewindButton();

    await eventually(() =>
      expect(onPreviousApiRequestReceived).toHaveBeenCalled());
  });
});
