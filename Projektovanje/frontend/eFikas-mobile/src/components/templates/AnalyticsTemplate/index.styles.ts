import { Dimensions, StyleSheet } from 'react-native';


const screenHeight = Dimensions.get('window').height;

const createStyles = (Colors: any) => StyleSheet.create({
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
        marginBottom: screenHeight * 0.025,
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
    }
});

export default createStyles;
