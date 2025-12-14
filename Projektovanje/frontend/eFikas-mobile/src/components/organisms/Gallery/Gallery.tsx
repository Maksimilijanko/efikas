import React, { useState } from 'react';
import {
  View,
  Image,
  Pressable,
  Text,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import {
  Modal as BaseModal,
  ModalContent,
  ModalBackdrop,
} from '../../../../components/ui/modal';

import { Label } from '../../atoms/Label/Label';
import { useTheme } from '@/src/providers/ThemeProvider';
import { useStyles } from '@/src/hooks/useStyles';
import { getStyles } from './index.styles';

const Modal = ({
  visible,
  ...props
}: { visible: boolean } & React.ComponentProps<typeof BaseModal>) => {
  return <BaseModal isOpen={visible} {...props} />;
};

interface GalleryProps {
  images: string[];
  style?: object;
}

export const Gallery: React.FC<GalleryProps> = ({ images, style }) => {

  const { Colors } = useTheme();
  const styles = useStyles(getStyles);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();

  const firstFour = images.slice(0, 4);
  const extra = images.length - 4;

  const openGallery = (index: number) => {
    setSelectedIndex(index);
  };

  const closeGallery = () => {
    setSelectedIndex(null);
  };

  const goToNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prevIndex) =>
      Math.min(prevIndex! + 1, images.length - 1)
    );
  };

  const goToPrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prevIndex) => Math.max(prevIndex! - 1, 0));
  };

  const imageDisplayHeight = screenHeight * 0.8;
  const arrowHeight = 30;

  return (
    <View style={style}>
      <Label
        text="Galerija"
        color={Colors.textPrimary}
        size="xl"
        className="font-bold mb-4"
      />

      <View style={styles.imageRow}>
        {firstFour.map((img, index) => {
          const isLast = index === 3 && extra > 0;
          return (
            <Pressable
              key={index}
              onPress={() => openGallery(index)}
              style={styles.pressable}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: img }}
                  style={styles.image}
                  resizeMode="cover"
                />
                {isLast && (
                  <View style={styles.overlay}>
                    <Text style={styles.overlayText}>+{extra}</Text>
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>

      <Modal visible={selectedIndex !== null} onClose={closeGallery}>
        <ModalBackdrop />
        <ModalContent style={styles.modalContent}>
          {selectedIndex !== null && (
            <Image
              source={{ uri: images[selectedIndex] }}
              resizeMode="contain"
              style={[styles.modalImage, { height: imageDisplayHeight }]}
            />
          )}

          <Pressable style={styles.modalCloseButton} onPress={closeGallery}>
            <X color={Colors.textLight} size={20} strokeWidth={2.5} />
          </Pressable>

          {selectedIndex !== null && (
            <>
              {selectedIndex > 0 && (
                <Pressable
                  style={[
                    styles.arrowButton,
                    styles.arrowLeft,
                    {
                      top: '50%',
                      marginTop: -(arrowHeight / 2)
                    }
                  ]}
                  onPress={goToPrev}
                >
                  <ChevronLeft color={Colors.textLight} size={24} strokeWidth={2.5} />
                </Pressable>
              )}

              {selectedIndex < images.length - 1 && (
                <Pressable
                  style={[
                    styles.arrowButton,
                    styles.arrowRight,
                    {
                      top: '50%',
                      marginTop: -(arrowHeight / 2)
                    }
                  ]}
                  onPress={goToNext}
                >
                  <ChevronRight color={Colors.textLight} size={24} strokeWidth={2.5} />
                </Pressable>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </View>
  );
};
