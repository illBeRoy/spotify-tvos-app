import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';
import config from './spotify.config'; // config has private spotify secrets. create your own config file for this to work

const spotifyAxios = (token = config.TOKEN): AxiosInstance => {
  return axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    baseURL: 'https://api.spotify.com/v1'
  });
};

const param = encodeURIComponent;

export const searchSongUriByName = (songName: string): Promise<string> => {
  return spotifyAxios()
    .get(`/search?q=${param(songName)}&type=track&limit=1`)
    .then(res => res.data.tracks.items[0].uri)
    .catch(err => alert(JSON.stringify(err.response.data)));
};

export const playSongByUri = async (songUri: string): Promise<void> => {
  await spotifyAxios().put('/me/player/play', { uris: [songUri] }).catch(err => alert(JSON.stringify(err.response.data)));
};
