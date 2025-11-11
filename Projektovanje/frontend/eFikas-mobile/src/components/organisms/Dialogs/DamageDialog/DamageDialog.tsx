import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Platform,
  useWindowDimensions,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Edit2 } from 'lucide-react-native'; 

import { Modal, ModalContent } from '@/components/ui/modal';
import { DialogButton } from '@/src/components/atoms/DialogButton/DialogButton';
import { Label } from '@/src/components/atoms/Label/Label';
import TextField from '@/src/components/atoms/TextField/TextField';
import { Colors } from '@/src/styles/style';

const MAX_CHAR_LIMIT = 150;
const TEXT_AREA_HEIGHT = 180; 

const isDateValid = (dateString: string): boolean => {
  if (!dateString || dateString.length !== 10) return false;
  const parts = dateString.split('.');
  if (parts.length !== 3) return false;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  if (year < 1000 || year > 9999 || month === 0 || month > 12) return false;

  const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
    monthLength[1] = 29;
  }

  return day > 0 && day <= monthLength[month - 1];
};

const DatePickerInput: React.FC<{
  value: string;
  onChange: (text: string) => void;
  label: string;
}> = ({ value, onChange, label }) => {
  const isValid = isDateValid(value) || value.length === 0;

  const handleDateChange = (text: string) => {
    let formattedText = text.replace(/[^0-9]/g, '');

    if (formattedText.length > 2 && formattedText.charAt(2) !== '.') {
      formattedText = formattedText.slice(0, 2) + '.' + formattedText.slice(2);
    }
    if (formattedText.length > 5 && formattedText.charAt(5) !== '.') {
      formattedText = formattedText.slice(0, 5) + '.' + formattedText.slice(5);
    }
    if (formattedText.length > 10) formattedText = formattedText.slice(0, 10);

    onChange(formattedText);
  };

  return (
    <View style={dateStyles.container}>
      <Label text={label} color={Colors.textPrimary} size="md" className="mb-2 mt-4" />
      <TextInput
        style={[
          dateStyles.input,
          { borderColor: isValid ? Colors.secondary : Colors.accent },
        ]}
        placeholder="DD.MM.GGGG"
        placeholderTextColor={Colors.tertiary}
        keyboardType={Platform.OS === 'android' ? 'numeric' : 'default'}
        maxLength={10}
        onChangeText={handleDateChange}
        value={value}
      />
      {!isValid && value.length === 10 && (
        <Label
          text="Unesite ispravan datum (DD.MM.GGGG)"
          color={Colors.accent}
          size="xs"
          className="mt-1 ml-4"
        />
      )}
    </View>
  );
};

const CurrencyInput: React.FC<any> = ({ value, onChangeText, placeholder }) => (
  <View>
    <Label text="Trošak" color={Colors.textPrimary} size="md" className="mb-2 mt-4" />
    <View style={styles.currencyContainer}>
      <TextField
        variant="outline"
        size="md"
        style={styles.currencyTextFieldWrapper}
        inputProps={{
          style: styles.currencyInputField,
          keyboardType: 'numeric',
          onChangeText: onChangeText,
          value: value,
          placeholder: placeholder,
          placeholderTextColor: Colors.tertiary,
        }}
      />
      <View style={styles.currencyTextWrapper}>
        <Label text="BAM" color={Colors.textSecondary} size="md" className="font-semibold" />
      </View>
    </View>
  </View>
);

interface DamageDialogProps {
  visible: boolean;
  onConfirm: (data: {
    steta: string;
    datum: string;
    trosak: string;
    napomena: string;
  }) => void;
  onClose: () => void;
}

export const DamageDialog: React.FC<DamageDialogProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const [steta, setSteta] = useState('');
  const [datum, setDatum] = useState('');
  const [trosak, setTrosak] = useState('');
  const [napomena, setNapomena] = useState('');
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const { height: screenHeight } = useWindowDimensions();

  const modalHeight = screenHeight * 0.75;
  const dialogWidth = '100%';

  const resetFields = () => {
    setSteta('');
    setDatum('');
    setTrosak('');
    setNapomena('');
  };

  useEffect(() => {
    if (visible) resetFields();
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      setKeyboardOffset(0);
      return;
    }

    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardOffset(-e.endCoordinates.height * 0.5);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardOffset(0);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [visible]);

  const handleConfirm = () => {
    if (datum && !isDateValid(datum)) {
      console.error('Neispravan datum unesen.');
      return;
    }
    onConfirm({ steta, datum, trosak, napomena });
    onClose();
  };

  const handleCancel = () => {
    resetFields();
    onClose();
  };

  const handleIconPress = () => {
    console.log('Kliknuta ikona olovke u napomeni!');
  };

  return (
    <Modal isOpen={visible} onClose={handleCancel}>
      <ModalContent style={styles.modalContent}>
        <View
          style={[
            styles.dialogContainer,
            {
              width: dialogWidth,
              height: modalHeight,
              transform: [{ translateY: keyboardOffset }],
            },
          ]}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.contentArea}>
              <Label text="Šteta" color={Colors.textPrimary} size="md" className="mb-2 mt-4" />
              <TextField
                placeholder="Opis štete"
                variant="outline"
                size="md"
                style={styles.inputStyle}
                inputProps={{
                  onChangeText: setSteta,
                  value: steta,
                  placeholderTextColor: Colors.tertiary,
                }}
              />

              <DatePickerInput value={datum} onChange={setDatum} label="Datum" />

              <CurrencyInput
                value={trosak}
                onChangeText={setTrosak}
                placeholder="Iznos"
              />

              <Label text="Napomena" color={Colors.textPrimary} size="md" className="mb-2 mt-4" />
              <View style={styles.textAreaWrapper}>
                <TextField
                  placeholder="Unesite dodatne detalje..."
                  variant="outline"
                  size="md"
                  style={styles.textAreaFieldStyle}
                  inputProps={{
                    multiline: true,
                    onChangeText: setNapomena,
                    value: napomena,
                    placeholderTextColor: Colors.tertiary,
                    textAlignVertical: 'top',
                    maxLength: MAX_CHAR_LIMIT,
                    style: {
                      paddingRight: 35,
                      paddingLeft: 10,
                      flex: 1,
                      minHeight: TEXT_AREA_HEIGHT,
                      textAlign: 'left',
                      writingDirection: 'ltr',
                    },
                  }}
                />
                <TouchableOpacity
                  onPress={handleIconPress}
                  style={styles.textAreaIconStyleFixed}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Edit2 size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.charCounterContainer}>
                <Text style={styles.charCounterText}>
                  {napomena.length}/{MAX_CHAR_LIMIT}
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <DialogButton title="Potvrdi" onPress={handleConfirm} />
            </View>
            <View style={styles.buttonWrapper}>
              <DialogButton title="Odustani" onPress={handleCancel} />
            </View>
          </View>
        </View>
      </ModalContent>
    </Modal>
  );
};

const dateStyles = StyleSheet.create({
  container: { marginBottom: 10 },
  input: {
    height: 40,
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.secondary,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  errorText: {
    color: Colors.accent,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 15,
  },
});

const styles = StyleSheet.create({
  modalContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 0,
    margin: 0,
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    elevation: 0,
    borderWidth: 0,
  },
  dialogContainer: {
    maxWidth: 600,
    backgroundColor: Colors.background,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    justifyContent: 'space-between',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 15,
  },
  contentArea: { paddingHorizontal: 25, paddingTop: 15 },

  inputStyle: {
    height: 40,
    marginBottom: 10,
    backgroundColor: Colors.background,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.secondary,
    marginBottom: 10,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  currencyTextFieldWrapper: {
    flex: 1,
    borderWidth: 0,
    shadowOpacity: 0,
    height: '100%',
    paddingRight: 50,
  },
  currencyInputField: {
    flex: 1,
    fontSize: 16,
    height: '100%',
    paddingHorizontal: 15,
    paddingRight: 0,
    borderWidth: 0,
  },
  currencyTextWrapper: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 15,
    zIndex: 1,
  },

  textAreaWrapper: {
    position: 'relative',
    marginBottom: 0,
    minHeight: TEXT_AREA_HEIGHT,
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.secondary,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    overflow: 'hidden',
  },

  textAreaFieldStyle: {
    borderWidth: 0,
    shadowOpacity: 0,
    paddingTop: 10,
    paddingLeft: 2,
    minHeight: '100%',
  },

  textAreaIconStyleFixed: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    zIndex: 10,
    padding: 5,
  },

  charCounterContainer: {
    alignItems: 'flex-end',
    width: '100%',
    paddingRight: 5,
    paddingTop: 4,
    marginBottom: 10,
  },
  charCounterText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.secondary,
    backgroundColor: Colors.background,
  },
  buttonWrapper: { flex: 1, marginHorizontal: 8 },
});
