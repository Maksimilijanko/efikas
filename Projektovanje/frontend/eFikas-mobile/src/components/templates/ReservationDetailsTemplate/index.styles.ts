import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/src/styles/style';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.background
    },
    scrollContent: {
        width: '100%',
        alignItems: 'center',
        paddingTop: height * 0.02,
        paddingBottom: height * 0.06
    },
    section: {
        width: '92%',
        marginBottom: height * 0.025
    },
    headerCardWrapper: {
        width: '100%'
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    infoItem: {
        width: '48%',
        marginBottom: height * 0.015
    },
    noteHeaderWrapper: {
        width: '100%',
        marginBottom: height * 0.008
    },
    noteBodyWrapper: {
        width: '100%'
    },
    primaryActionWrapper: {
        width: '100%',
        alignItems: 'center'
    }
});

export default styles;
