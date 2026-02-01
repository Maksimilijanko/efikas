import { StyleSheet } from 'react-native';
import { Colors } from '@/src/styles/style';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        overflow: 'visible'
    },

    topRight: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 10
    },

    mainContent: {
        flex: 1,
    },

    floatingButton: {
        position: 'absolute',
        bottom: '12%',
        right: 20,
        zIndex: 20,
    },

    bottomToggle: {
        position: 'absolute',
        bottom: 10,
        left: 20,
        width: '90%',
        height: 60,
        justifyContent: 'center',
        zIndex: 15
    },
});
