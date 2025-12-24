import { Edit2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Keyboard,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';

import { DialogButton } from '@/src/components/atoms/DialogButton/DialogButton';
import { Label } from '@/src/components/atoms/Label/Label';
import TextField from '@/src/components/atoms/TextField/TextField';
import { Modal, ModalContent } from '@/src/components/ui/modal';
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

const TimeField: React.FC<{
  label: string;
  onTimeChange: (time: { hours: string; minutes: string }) => void;
}> = ({ label, onTimeChange }) => {
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');

  useEffect(() => {
    onTimeChange({ hours, minutes });
  }, [hours, minutes, onTimeChange]);

  const handleHoursChange = (value: string) => {
    const formatted = value.replace(/[^0-9]/g, '').slice(0, 2);
    if (Number(formatted) <= 23 || formatted === '') setHours(formatted);
  };

  const handleMinutesChange = (value: string) => {
    const formatted = value.replace(/[^0-9]/g, '').slice(0, 2);
    if (Number(formatted) <= 59 || formatted === '') setMinutes(formatted);
  };

  return (
    <View style={timeStyles.container}>
      <Label text={label} color={Colors.textPrimary} size="md" className="mb-2 mt-4" />
      <View style={timeStyles.hstack}>
        <TextField
          placeholder="HH"
          variant="outline"
          size="md"
          style={timeStyles.textField}
          inputProps={{
            keyboardType: 'numeric',
            value: hours,
            onChangeText: handleHoursChange,
            maxLength: 2,
            placeholderTextColor: Colors.tertiary,
            textAlign: 'center',
          }}
        />
        <Label text=":" size="xl" color={Colors.textPrimary} className="mx-2" />
        <TextField
          placeholder="MM"
          variant="outline"
          size="md"
          style={timeStyles.textField}
          inputProps={{
            keyboardType: 'numeric',
            value: minutes,
            onChangeText: handleMinutesChange,
            maxLength: 2,
            placeholderTextColor: Colors.tertiary,
            textAlign: 'center',
          }}
        />
      </View>
    </View>
  );
};

interface TasksDialogProps {
  visible: boolean;
  onConfirm: (data: {
    zadatak: string;
    datum: string;
    vrijeme: string;
    napomena: string;
  }) => void;
  onClose: () => void;
}

export const TasksDialog: React.FC<TasksDialogProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const [zadatak, setZadatak] = useState('');
  const [datum, setDatum] = useState('');
  const [time, setTime] = useState({ hours: '', minutes: '' });
  const [napomena, setNapomena] = useState('');

  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const { height: screenHeight } = useWindowDimensions();

  const modalHeight = screenHeight * 0.75;
  const dialogWidth = '100%';

  const resetFields = () => {
    setZadatak('');
    setDatum('');
    setTime({ hours: '', minutes: '' });
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

    let vrijeme = '';
    const h = time.hours.padStart(2, '0');
    const m = time.minutes.padStart(2, '0');

    if (time.hours || time.minutes) {
      vrijeme = `${h}:${m}`;
    }

    onConfirm({ zadatak, datum, vrijeme, napomena });
    onClose();
  };

  const handleCancel = () => {
    resetFields();
    onClose();
  };
  
  const handleIconPress = () => {
    console.log('Kliknuta ikona olovke u napomeni za zadatke!');
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
              <Label text="Zadatak" color={Colors.textPrimary} size="md" className="mb-2 mt-4" />
              <TextField
                placeholder="Unesite naziv zadatka"
                variant="outline"
                size="md"
                style={styles.inputStyle}
                inputProps={{
                  onChangeText: setZadatak,
                  value: zadatak,
                  placeholderTextColor: Colors.tertiary,
                }}
              />

              <DatePickerInput value={datum} onChange={setDatum} label="Datum" />

              <TimeField
                label="Vrijeme"
                onTimeChange={setTime}
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

const timeStyles = StyleSheet.create({
  container: { marginBottom: 10 },
  hstack: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 40,
  },
  textField: {
    width: 60,
    height: '100%',
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 8,
    backgroundColor: Colors.background,
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
