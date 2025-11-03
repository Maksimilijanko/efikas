import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  useWindowDimensions,
  ScrollView,
  KeyboardAvoidingView, // <--- Uvezeno
} from 'react-native';
import { Edit2 } from 'lucide-react-native';
// Pretpostavljamo da su Modal i ModalContent pravilno uvezeni i stilizovani
import { Modal, ModalContent } from '@/components/ui/modal'; 
import { DialogButton } from '@/src/components/atoms/DialogButton/DialogButton';

// --- POMOĆNA FUNKCIJA ZA DATUM (nepromenjena) ---
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

// --- KOMPONENTA ZA DATUM (DatePickerInput - nepromenjena) ---
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
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[dateStyles.input, { borderColor: isValid ? '#E0E0E0' : 'red' }]}
        placeholder="DD.MM.GGGG"
        placeholderTextColor="#B0B0B0"
        keyboardType={Platform.OS === 'android' ? 'numeric' : 'default'}
        maxLength={10}
        onChangeText={handleDateChange}
        value={value}
      />
      {!isValid && value.length === 10 && (
        <Text style={dateStyles.errorText}>Unesite ispravan datum (DD.MM.GGGG)</Text>
      )}
    </View>
  );
};

// --- DIJALOG ZA ŠTETU (DamageDialog - REVIDIRANA VERZIJA) ---
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
  const { height: screenHeight } = useWindowDimensions();

  // Dinamička visina modala (nepromenjeno)
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

  const handleConfirm = () => {
    if (datum && !isDateValid(datum)) {
      alert('Molimo unesite ispravan datum u formatu DD.MM.GGGG.');
      return;
    }
    onConfirm({ steta, datum, trosak, napomena });
    onClose();
  };

  const handleCancel = () => {
    resetFields();
    onClose();
  };

  return (
    <Modal isOpen={visible} onClose={handleCancel}>
      {/* 1. ModalContent mora imati flex: 1 (što već ima u Vašem stilu 'modalContent') */}
      <ModalContent style={styles.modalContent}>
        {/* 2. dialogContainer mora imati flex: 1 ili fiksnu visinu (koristite fiksnu visinu i justifyContent: 'space-between') */}
        <View style={[styles.dialogContainer, { width: dialogWidth, height: modalHeight }]}>

          {/* 3. KeyboardAvoidingView obuhvata samo skrolabilni sadržaj i ima flex: 1 */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoiding} // <--- Dodat stil { flex: 1 }
            // Opcionalno, podesite offset ako se dugmad na dnu preklapaju
            keyboardVerticalOffset={0} 
          >
            {/* 4. ScrollView je unutar KAV-a i sadrži polja za unos */}
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true}
              // Opcionalno, omogućava da tastatura nestane pri prevlačenju
              keyboardShouldPersistTaps="handled" 
            >
              <View style={styles.contentArea}>
                
                {/* ŠTETA */}
                <Text style={styles.label}>Šteta</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setSteta}
                  value={steta}
                  placeholder="Opis štete"
                  placeholderTextColor="#B0B0B0"
                />

                {/* DATUM */}
                <DatePickerInput value={datum} onChange={setDatum} label="Datum" />

                {/* TROŠAK */}
                <Text style={styles.label}>Trošak</Text>
                <View style={styles.currencyContainer}>
                  <TextInput
                    style={styles.currencyInput}
                    keyboardType="numeric"
                    onChangeText={setTrosak}
                    value={trosak}
                    placeholder="Iznos"
                    placeholderTextColor="#B0B0B0"
                  />
                  <Text style={styles.currencyText}>BAM</Text>
                </View>

                {/* NAPOMENA */}
                <Text style={styles.label}>Napomena</Text>
                <View style={styles.textAreaContainer}>
                  <TextInput
                    style={styles.textArea}
                    multiline
                    numberOfLines={4}
                    onChangeText={setNapomena}
                    value={napomena}
                    placeholder="Unesite dodatne detalje..."
                    placeholderTextColor="#B0B0B0"
                  />
                  <Edit2 size={16} color="#7F7F7F" style={styles.editIcon} />
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>

          {/* 5. DUGMAD - Ostavljena van KAV-a i ScrollView-a da bi ostala fiksirana */}
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

// --- STILOVI (dodat novi stil i revizija postojećih) ---
const dateStyles = StyleSheet.create({
  container: { marginBottom: 10 },
  input: {
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 15,
  },
});

const styles = StyleSheet.create({
  modalContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, // <--- KLJUČNO
    padding: 0,
    margin: 0,
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    elevation: 0,
    borderWidth: 0,
  },
  dialogContainer: {
    maxWidth: 600,
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    // Dodano:
    justifyContent: 'space-between', 
  },
  // NOVI STIL: KLJUČAN za KAV da zauzme sav raspoloživ prostor
  keyboardAvoiding: {
    flex: 1, 
  },
  // contentContainerStyle za ScrollView: KLJUČNO: flexGrow: 1 da bi ScrollView popunio prostor
  scrollContent: { 
    flexGrow: 1, 
    paddingBottom: 20 
  },
  contentArea: { paddingHorizontal: 25, paddingTop: 30 },
  label: { fontSize: 16, color: '#333', fontWeight: '600', marginBottom: 8, marginTop: 15 },
  input: {
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  currencyInput: { flex: 1, paddingHorizontal: 15, fontSize: 16, height: '100%', paddingRight: 50 },
  currencyText: {
    position: 'absolute',
    right: 15,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  textAreaContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    minHeight: 120,
    position: 'relative',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textArea: { padding: 0, textAlignVertical: 'top', fontSize: 16, flex: 1 },
  editIcon: { position: 'absolute', top: 15, right: 15, zIndex: 10 },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    backgroundColor: '#FFFFFF',
  },
  buttonWrapper: { flex: 1, marginHorizontal: 8 },
})