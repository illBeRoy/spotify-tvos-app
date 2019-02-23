import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black'
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
    color: 'white',
    fontSize: 36,
    fontFamily: 'HelveticaNeue-Thin',
    marginLeft: 20
  }
});
