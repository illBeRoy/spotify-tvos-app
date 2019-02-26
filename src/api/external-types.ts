import { DeviceType } from './spotify';

export interface APIGetPlayerResponse {
  device: {
    name: string;
    type: DeviceType;
  };
  item: {
    name: string;
    album: {
      name: string;
      images: APIAlbumImage[];
    };
    artists: APIArtist[];
  };
  is_playing: boolean;
}

export interface APIAlbumImage {
  width: number;
  height: number;
  url: string;
}

export interface APIArtist {
  name: string;
}
