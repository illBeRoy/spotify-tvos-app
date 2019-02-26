import { Chance } from 'chance';
import { PlayerComponentDriver } from './component.driver';

describe('PlayerComponent', () => {
  let driver: PlayerComponentDriver;

  beforeEach(() =>
    driver = new PlayerComponentDriver());

  afterEach(() =>
    driver.tearDown());

  describe('background image', () => {
    it('should render the artUrl prop', () => {
      const artUrl = Chance().url();

      driver
        .given.artUrl(artUrl)
        .when.renderingPlayer();

      expect(driver.get.backgroundImage().uri).toEqual(artUrl);
    });
  });

  describe('device information', () => {
    it('should display the device name', () => {
      const deviceName = Chance().string();

      driver
        .given.deviceName(deviceName)
        .when.renderingPlayer();

      expect(driver.get.deviceNameText()).toEqual(deviceName);
    });

    it('should display the computer icon if the device type is "Computer"', () => {
      const deviceType = 'Computer';
      const laptopImage = require('../../assets/laptop.png');

      driver
        .given.deviceType(deviceType)
        .when.renderingPlayer();

      expect(driver.get.deviceImage()).toEqual(laptopImage);
    });

    it('should display the smartphone icon if the device type is "Smartphone"', () => {
      const deviceType = 'Smartphone';
      const smartphoneImage = require('../../assets/smartphone.png');

      driver
        .given.deviceType(deviceType)
        .when.renderingPlayer();

      expect(driver.get.deviceImage()).toEqual(smartphoneImage);
    });

    it('should display the speaker icon if the device type is "Speaker"', () => {
      const deviceType = 'Speaker';
      const smartphoneImage = require('../../assets/speaker.png');

      driver
        .given.deviceType(deviceType)
        .when.renderingPlayer();

      expect(driver.get.deviceImage()).toEqual(smartphoneImage);
    });
  });

  describe('track information', () => {
    it('should display the artUrl inside the track circle image', () => {
      const artUrl = Chance().url();

      driver
        .given.artUrl(artUrl)
        .when.renderingPlayer();

      expect(driver.get.trackCircleImage().uri).toEqual(artUrl);
    });

    it('should display the track name in the track name label', () => {
      const trackName = Chance().string();

      driver
        .given.trackName(trackName)
        .when.renderingPlayer();

      expect(driver.get.trackNameLabelText()).toEqual(trackName);
    });

    it('should display the artist and album name in the track info label', () => {
      const artistName = Chance().string();
      const albumName = Chance().string();

      driver
        .given.artistName(artistName)
        .given.albumName(albumName)
        .when.renderingPlayer();

      expect(driver.get.trackInfoLabelText()).toEqual(`${artistName} - ${albumName}`);
    });
  });

  describe('player controls', () => {
    it('should invoke the onPressPlay handler when the "play" button is pressed', () => {
      const onPressPlay = jest.fn();

      driver
        .given.onPressPlay(onPressPlay)
        .when.renderingPlayer()
        .when.pressingPlayButton();

      expect(onPressPlay).toHaveBeenCalled();
    });

    it('should invoke the onPressRewind handler when the "rewind" button is pressed', () => {
      const onPressRewind = jest.fn();

      driver
        .given.onPressRewind(onPressRewind)
        .when.renderingPlayer()
        .when.pressingRewindButton();

      expect(onPressRewind).toHaveBeenCalled();
    });

    it('should invoke the onPressForward handler when the "forward" button is pressed', () => {
      const onPressForward = jest.fn();

      driver
        .given.onPressForward(onPressForward)
        .when.renderingPlayer()
        .when.pressingForwardButton();

      expect(onPressForward).toHaveBeenCalled();
    });
  });

  describe('up next bar', () => {
    it('should display the next track\'s name', () => {
      const nextTrackName = Chance().string();

      driver
        .given.nextTrackName(nextTrackName)
        .when.renderingPlayer();

      expect(driver.get.nextTrackLabelText()).toEqual(nextTrackName);
    });

    it('should display the "up next" indication', () => {
      const nextTrackName = Chance().string();

      driver
        .given.nextTrackName(nextTrackName)
        .when.renderingPlayer();

      expect(driver.get.nextTrackIndicationIsVisible()).toBe(true);
    });

    it('should not be visible at all if no next song', () => {
      driver
        .given.nextTrackName(null)
        .when.renderingPlayer();

      expect(driver.get.nextTrackBarIsVisible()).toBe(false);
    });
  });
});
