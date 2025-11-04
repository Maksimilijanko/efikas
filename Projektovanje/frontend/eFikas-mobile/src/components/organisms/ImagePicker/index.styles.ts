import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        aspectRatio: 4 / 5,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        minHeight: 250
    },
    labelHolder: {
        width: '90%'
    },
    pickerHolder: {
        height: '85%',
        width: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    mainImageTouchable: {
        flex: 0.7,
        width: '100%',
        alignItems: 'center'
    },
    mainImage: {
        flex: 1,
        borderRadius: 10,
        aspectRatio: 1
    },
    bottomRow: {
        flex: 0.3,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    carouselSpace: {
        width: '10%'
    },
    thumbnailRow: {
        width: '60%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    touchableThumbnail: {
        flex: 0.3
    },
    thumbnail: {
        aspectRatio: 1,
        borderRadius: 10,
    },
    buttonWrapper: {
        height: '15%',
        width: '50%',
        alignItems: 'center'
    }
});

export default styles;
