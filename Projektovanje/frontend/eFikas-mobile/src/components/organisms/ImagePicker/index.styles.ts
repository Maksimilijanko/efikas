import { StyleSheet } from 'react-native';

export const getStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      aspectRatio: 4 / 5,
      justifyContent: 'space-evenly',
      alignItems: 'center',
      minHeight: 200,
    },
    labelHolder: {
      width: '100%',
    },
    pickerHolder: {
      height: '85%',
      width: '100%',
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
    mainImageTouchable: {
      flex: 0.7,
      width: '100%',
      alignItems: 'center',
    },
    mainImage: {
      flex: 1,
      borderRadius: 10,
      aspectRatio: 1,
    },
    bottomRow: {
      flex: 0.3,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    carouselSpace: {
      width: '2%',
    },
    thumbnailRow: {
      width: '60%',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    touchableThumbnail: {
      flex: 0.3,
    },
    thumbnail: {
      aspectRatio: 1,
      borderRadius: 10,
    },
    buttonWrapper: {
      height: '25%',
      width: '50%',
      alignItems: 'center',
      alignSelf: 'center',
    },
    emptyState: {
      padding: 40,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.secondary,
      borderRadius: 8,
      marginVertical: 10,
    },
  });