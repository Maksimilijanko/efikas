import { Edit2 } from 'lucide-react-native'
import React, { useEffect, useRef, useState } from 'react'
import {
    Keyboard,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native'

import { DialogButton } from '@/src/components/atoms/DialogButton/DialogButton'
import { Dropdown } from '@/src/components/atoms/Dropdown/Dropdown'
import { Label } from '@/src/components/atoms/Label/Label'
import TextField from '@/src/components/atoms/TextField/TextField'
import { Modal, ModalContent } from '@/src/components/ui/modal'
import { Colors } from '@/src/styles/style'

type TSelectedItem = any

const EXPENSE_CATEGORIES: TSelectedItem[] = [
  { id: 'Režije', name: 'Režije' },    // ID mora imati kvačicu ako je ima u bazi
  { id: 'Čišćenje', name: 'Čišćenje' }, // ID mora imati kvačicu!
  { id: 'Namirnice', name: 'Namirnice' },
]

const CurrencyInput: React.FC<any> = ({ value, onChangeText, placeholder }) => (
  <View>
    <Label text="Iznos" color={Colors.textPrimary} size="md" className="mb-2 mt-4" />
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
)

interface ExpensesDialogProps {
  visible: boolean
  onConfirm: (data: {
    kategorija: string
    trosak: string
    iznos: string
    napomena: string
  }) => void
  onClose: () => void
}

export const ExpensesDialog: React.FC<ExpensesDialogProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const scrollViewRef = useRef<ScrollView | null>(null) 
  
  const [kategorijaItems, setKategorijaItems] = useState<TSelectedItem[]>([]) 
  const [trosak, setTrosak] = useState('')
  const [iznos, setIznos] = useState('')
  const [napomena, setNapomena] = useState('')

  const [keyboardOffset, setKeyboardOffset] = useState(0)
  const { height: screenHeight } = useWindowDimensions()

  const modalHeight = screenHeight * 0.75
  const dialogWidth = '100%'

  const resetFields = () => {
    setKategorijaItems([])
    setTrosak('')
    setIznos('')
    setNapomena('')
    scrollViewRef.current?.scrollTo({ y: 0, animated: false }) 
  }

  useEffect(() => {
    if (visible) {
      resetFields()
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: false })
      }, 100)
    }
  }, [visible])

  useEffect(() => {
    if (!visible) {
      setKeyboardOffset(0)
      return
    }

    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardOffset(-e.endCoordinates.height * 0.5)
      },
    )
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardOffset(0)
      },
    )

    return () => {
      keyboardDidHideListener.remove()
      keyboardDidShowListener.remove()
    }
  }, [visible])

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true })
    }
  }
  
  const handleInputFocus = () => {
    scrollToBottom()
  }
  
  const handleConfirm = () => {
    const kategorijaId = kategorijaItems.length > 0 ? kategorijaItems[0].id : ''

    onConfirm({ kategorija: kategorijaId, trosak, iznos, napomena })
    onClose()
  }

  const handleCancel = () => {
    resetFields()
    onClose()
  }

  const handleIconPress = () => {
    console.log('Kliknuta ikona olovke u napomeni!')
  }
  
  const handleCategoryChange = (selectedItems: TSelectedItem | TSelectedItem[]) => {
    const itemsArray = Array.isArray(selectedItems) ? selectedItems : [selectedItems]
    setKategorijaItems(itemsArray.slice(0, 1))
  }
  
  const currentSelectedValue = kategorijaItems

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
          
          <View style={styles.contentArea}>
            <Label
              text="Kategorija troška"
              color={Colors.textPrimary}
              size="md"
              className="mb-2 mt-4"
            />
            <Dropdown
              label={''}
              placeholder="Izaberite kategoriju..."
              options={EXPENSE_CATEGORIES}
              optionLabel="name"
              optionValue="id"
              selectedValue={currentSelectedValue}
              setSelectedValue={handleCategoryChange}
            />
          </View>
          
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.contentArea}>
              
              <Label text="Trošak" color={Colors.textPrimary} size="md" className="mb-2 mt-4" />
              <TextField
                placeholder="Opis troška"
                variant="outline"
                size="md"
                style={styles.inputStyle}
                inputProps={{
                  onChangeText: setTrosak,
                  value: trosak,
                  placeholderTextColor: Colors.tertiary,
                }}
              />

              <CurrencyInput
                value={iznos}
                onChangeText={setIznos}
                placeholder="0.00"
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
                    maxLength: 150, 
                    style: { 
                      paddingRight: 35, 
                      paddingLeft: 10, 
                      flex: 1, 
                      minHeight: 180, 
                      textAlign: 'left', 
                      writingDirection: 'ltr',
                    }, 
                    onFocus: handleInputFocus,
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
                  {napomena.length}/150
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
  ) 
}

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

  categoryDropdownWrapper: {
    marginTop: 0, 
    marginBottom: 10,
  },

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
    minHeight: 180, 
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
})
