import { Chance } from 'chance';
import { APIGetPlayerResponse, APIAlbumImage, APIArtist } from '../../src/api/external-types';
import { DeviceType } from '../../src/api/spotify';

export class APIGetPlayerResponseBuilder {
  private deviceType: DeviceType = Chance().pickone<DeviceType>(['Computer', 'Smartphone', 'CastAudio']);
  private deviceName: string = Chance().string();
  private itemName: string = Chance().string();
  private albumName: string = Chance().string();
  private albumImages: APIAlbumImage[] = [anAPIAlbumImage().build()];
  private artists: APIArtist[] = [anAPIArtist().build()];
  private isPlaying: boolean = Chance().bool();

  withDeviceType(deviceType: DeviceType) {
    this.deviceType = deviceType;
    return this;
  }

  withDeviceName(deviceName: string) {
    this.deviceName = deviceName;
    return this;
  }

  withItemName(itemName: string) {
    this.itemName = itemName;
    return this;
  }

  withAlbumName(albumName: string) {
    this.albumName = albumName;
    return this;
  }

  withAlbumImages(albumImages: APIAlbumImage[]) {
    this.albumImages = albumImages;
    return this;
  }

  withArtists(artists: APIArtist[]) {
    this.artists = artists;
    return this;
  }

  withIsPlaying(isPlaying: boolean) {
    this.isPlaying = isPlaying;
    return this;
  }

  build(): APIGetPlayerResponse {
    return {
      device: {
        type: this.deviceType,
        name: this.deviceName
      },
      item: {
        name: this.itemName,
        album: {
          name: this.albumName,
          images: this.albumImages
        },
        artists: this.artists
      },
      is_playing: this.isPlaying
    };
  }
}

export class APIAlbumImageBuilder {
  private width: number = Chance().integer({ min: 32 });
  private height: number = Chance().integer({ min: 32 });
  private url: string = Chance().url();

  withWidth(width: number) {
    this.width = width;
    return this;
  }

  withHeight(height: number) {
    this.height = height;
    return this;
  }

  smallerThan(width: number, height: number) {
    this.width = Chance().integer({ min: 32, max: width });
    this.height = Chance().integer({ min: 32, max: height });
    return this;
  }

  withUrl(url: string) {
    this.url = url;
    return this;
  }

  build(): APIAlbumImage {
    return {
      width: this.width,
      height: this.height,
      url: this.url
    };
  }
}

export class APIArtistBuilder {
  private name: string = Chance().name();

  withName(name: string) {
    this.name = name;
    return this;
  }

  build(): APIArtist {
    return {
      name: this.name
    };
  }
}

export const anAPIGetPlayerResponse = () => new APIGetPlayerResponseBuilder();
export const anAPIAlbumImage = () => new APIAlbumImageBuilder();
export const anAPIArtist = () => new APIArtistBuilder();
