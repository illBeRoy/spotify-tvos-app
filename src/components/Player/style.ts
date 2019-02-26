import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#121212'
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    opacity: .4
  },
  deviceInformationBar: {
    position: 'absolute',
    flexDirection: 'row',
    left: 30,
    top: 30,
    width: 600,
    height: 62,
    alignItems: 'center'
  },
  deviceNameText: {
    color: '#F1F1F1',
    fontSize: 36,
    fontFamily: 'HelveticaNeue-Thin',
    marginLeft: 20
  },
  mainAreaContainer: {
    position: 'absolute',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    height: '100%',
    width: '100%'
  },
  albumArtCircle: {
    width: 418,
    height: 418,
    borderRadius: 418 / 2
  },
  trackNameText: {
    fontFamily: 'HelveticaNeue-Light',
    fontSize: 48,
    color: 'white',
    marginTop: 30
  },
  trackInfoText: {
    fontFamily: 'HelveticaNeue-Thin',
    fontSize: 36,
    color: '#F1F1F1',
    marginTop: 12
  },
  buttonsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 190,
    marginTop: 48
  },
  playButton: {
    width: 190,
    height: 190,
    marginRight: 50
  },
  rwButton: {
    width: 128,
    height: 128,
    marginRight: 50
  },
  ffButton: {
    width: 128,
    height: 128
  },
  nextSongBar: {
    position: 'absolute',
    flexDirection: 'row',
    width: '100%',
    bottom: 75,
    justifyContent: 'center'
  },
  nextSongIndication: {
    fontFamily: 'HelveticaNeue-Thin',
    fontSize: 36,
    color: '#40F548'
  },
  nextSongName: {
    fontFamily: 'HelveticaNeue-Thin',
    fontSize: 36,
    color: 'white'
  }
});
