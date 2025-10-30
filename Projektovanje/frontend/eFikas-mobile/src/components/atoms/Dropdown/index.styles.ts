import { Colors } from '@/src/styles/style';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    dropdownContainer: {
        marginBottom: 0,
        borderRadius: 10,
        borderColor: Colors.tertiary,
        borderWidth: 1.2
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        minHeight: 48,
        backgroundColor: 'white',
    },
    placeholder: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'left',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: Colors.primary,
        textAlign: 'left',
    },
    dropdownIcon: {
        top: 12,
        right: 12,
    },
    modalContainer: {
        padding: 16,
        backgroundColor: 'white',
    },
});