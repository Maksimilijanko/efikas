import { StyleSheet, Dimensions, Platform } from 'react-native';
import { Colors } from '@/src/styles/style';

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.background
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        paddingTop: screenHeight * 0.02,
        paddingBottom: screenHeight * 0.14
    },
    inner: {
        width: '92%',
        alignItems: 'center'
    },
    apartmentCardWrapper: {
        width: '100%',
        borderRadius: 18,
        overflow: 'hidden',
        backgroundColor: Colors.background,
        marginBottom: screenHeight * 0.025,
        shadowColor: Colors.shadowColor,
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3
    },
    analyticsSection: {
        width: '100%',
        marginBottom: screenHeight * 0.02
    },
    analyticsHeaderWrapper: {
        marginBottom: screenHeight * 0.012
    },
    analyticsContentWrapper: {
        width: '100%'
    },
    summaryItem: {
        width: '100%',
        marginBottom: screenHeight * 0.015
    },
    detailsWrapper: {
        width: '100%'
    },
    periodSelectorWrapper: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: '4%',
        paddingBottom: 12,
        alignItems: 'center'
    }
});

export default styles;
