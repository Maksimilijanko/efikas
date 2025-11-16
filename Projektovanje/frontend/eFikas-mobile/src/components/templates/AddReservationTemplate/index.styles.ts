import { Colors } from '@/src/styles/style';
import { StyleSheet, Dimensions } from 'react-native';

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
        paddingBottom: screenHeight * 0.04
    },
    inner: {
        width: '92%',
        alignItems: 'center'
    },
    apartmentCardWrapper: {
        width: '100%',
        height: screenHeight * 0.20,
        borderRadius: 18,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        marginBottom: screenHeight * 0.03,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3
    },
    formRow: {
        width: '100%',
        marginBottom: screenHeight * 0.02,
        justifyContent: 'center'
    },
    submitWrapper: {
        width: '100%',
        marginTop: screenHeight * 0.02,
        alignItems: 'center'
    }
});

export default styles;
