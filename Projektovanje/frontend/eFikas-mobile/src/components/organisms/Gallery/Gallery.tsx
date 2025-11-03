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
  {/* cuvam indeks (broj) kliknute slike  */}
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
  const arrowHeight = 30; // Visina strelice
  {/* napomena za inace:(visina ekrana - visina slike) / 2 = gornji neiskorišteni prostor.*/}
  {/* gornji neiskorišteni prostor je (screenHeight - imageDisplayHeight) / 2 = 0.1 * screenHeight.*/}
  const arrowVerticalOffset = (screenHeight - imageDisplayHeight) / 2 + (imageDisplayHeight / 2) - (arrowHeight / 2);
  

  return (
    <View style={style}>
      <Text style={styles.title}>Galerija</Text>
      <View style={styles.imageRow}>
        {/* Prikaz thumbnaila */}
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

     {/*galerija modal*/}
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

          {/*close button*/}
          <Pressable style={styles.modalCloseButton} onPress={closeGallery}>
            <X color="white" size={20} strokeWidth={2.5} />
          </Pressable>

          {/* Strelice za navigaciju - ovdje npm install lucide-react-native*/}
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
                  <ChevronLeft color="white" size={24} strokeWidth={2.5} />
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
                  <ChevronRight color="white" size={24} strokeWidth={2.5} />
                </Pressable>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </View>
  );
};

{/* stil */}
const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111827',
  },
  imageRow: {
    flexDirection: 'row',
    gap: 12,
  },
  pressable: {
    flex: 1,
  },
  imageContainer: {
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: 'white',
    fontSize: 26,
    fontWeight: '600',
  },

  
  modalContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', 
  },
  modalImage: {
    width: '100%',
  },
  
  
  modalCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 18,
    width: 36, 
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },


  arrowButton: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  arrowLeft: {
    left: 15,
  },
  arrowRight: {
    right: 15,
  },
});