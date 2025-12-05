import { StyleSheet } from 'react-native';
import { Colors } from '@/src/styles/style';

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.background,
        borderRadius: 15,
        padding: 12,
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.8,
        elevation: 5,
    },
    image: {
        width: 70, 
        height: 70, 
        borderRadius: 10, 
    },
    mainContentWrapper: {
        flex: 0.9,
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    labelContainer: {
        marginLeft: 10,
    },
    topRow: {
        flexDirection: 'row',
    },
    statusGroup: {},
    statusLine: {
        flexDirection: 'row',
    },
    icon: {
        flex: 0.1,
    },
    contentContainer: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    infoSection: {},
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000000',
    },
    subtitle: {
        fontSize: 14,
        color: '#8E8E93', 
        marginTop: 2,
    },
    statusSection: {
        marginTop: 8,
    },
    statusText: {
        fontSize: 13,
        color: '#333333',
        lineHeight: 18,
    },
});
