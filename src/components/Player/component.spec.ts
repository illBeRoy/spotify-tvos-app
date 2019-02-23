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

    it('should display the smartphone icon if the device type is "Mobile"', () => {
      const deviceType = 'Mobile';
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
  })
});
