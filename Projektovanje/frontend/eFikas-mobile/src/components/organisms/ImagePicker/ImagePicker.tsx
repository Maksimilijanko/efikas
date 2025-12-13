import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Alert, StyleProp, ViewStyle } from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import { BasicButton } from '../../atoms/BasicButton/BasicButton';
import { IconButton } from '../../atoms/IconButton/IconButton';
import { Label } from '../../atoms/Label/Label';
import { useTheme } from '@/src/providers/ThemeProvider';
import { useStyles } from '@/src/hooks/useStyles';
import { getStyles } from './index.styles';

interface ImageItem {
    uri: string;
}

interface ImagePickerProps {
    style?: StyleProp<ViewStyle>;
    selectedImages?: string[];
    onImagesSelected?: (imageUris: string[]) => void;
}

const ImagePicker = ({ style, selectedImages = [], onImagesSelected }: ImagePickerProps) => {
    
    const { Colors } = useTheme();
    const styles = useStyles(getStyles);
    
    const [images, setImages] = useState<ImageItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    useEffect(() => {
        if (selectedImages.length > 0) {
            setImages(selectedImages.map(uri => ({ uri })));
        } else {
            setImages([]);
            setCurrentIndex(0);
        }
    }, [selectedImages]);

    const updateImages = (newImages: ImageItem[]) => {
        setImages(newImages);
        if (onImagesSelected) {
            onImagesSelected(newImages.map(img => img.uri));
        }
    };

    const nextImage = (): void => {
        if (images.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (): void => {
        if (images.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const getVisibleThumbnails = (): ImageItem[] => {
        if (images.length === 0) return [];

        if (images.length < 3) {
            return images;
        }

        const visible: ImageItem[] = [];
        for (let i = -1; i <= 1; i++) {
            const index = (currentIndex + i + images.length) % images.length;
            visible.push(images[index]);
        }
        return visible;
    };

    const pickImage = async (): Promise<void> => {
        const permissionResult = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Dozvola potrebna', 'Morate omogućiti pristup galeriji da biste dodali slike.');
            return;
        }

        const result = await ExpoImagePicker.launchImageLibraryAsync({
            mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            const newImages = result.assets.map((asset) => ({ uri: asset.uri }));
            updateImages([...images, ...newImages]); 
        }
    };

    const confirmDelete = (index: number) => {
        Alert.alert(
            'Obriši sliku',
            'Jeste li sigurni da želite obrisati ovu sliku?',
            [
                { text: 'Otkaži', style: 'cancel' },
                {
                    text: 'Obriši',
                    style: 'destructive',
                    onPress: () => deleteImage(index)
                },
            ]
        );
    };

    const deleteImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);

        if (newImages.length === 0) {
            setCurrentIndex(0);
        } else if (currentIndex >= newImages.length) {
            setCurrentIndex(newImages.length - 1);
        }

        updateImages(newImages); 
    };

    const visibleThumbnails = getVisibleThumbnails();

    if (images.length === 0) {
        return (
            <View style={[style, styles.container]}>
                <View style={styles.labelHolder}>
                    <Label color={Colors.textPrimary} text={"Slike"} size={"md"} />
                </View>
                <View style={styles.emptyState}>
                    <Label
                        color={Colors.textSecondary}
                        text={"Nema dodatih slika"}
                        size={"sm"}
                    />
                </View>
                <View style={styles.buttonWrapper}>
                    <BasicButton
                        title="Dodaj slike"
                        onPress={pickImage}
                        className='w-full h-full'
                        textClassName="text-center"
                    />
                </View>
            </View>
        );
    }

    return (
        <View style={[style, styles.container]}>
            <View style={styles.labelHolder}>
                <Label color={Colors.textPrimary} text={"Slike"} size={"md"} />
            </View>
            <View style={styles.pickerHolder}>
                <TouchableOpacity
                    onLongPress={() => confirmDelete(currentIndex)}
                    style={styles.mainImageTouchable}
                >
                    <Image
                        source={{ uri: images[currentIndex].uri }}
                        style={styles.mainImage}
                    />
                </TouchableOpacity>

                <View style={styles.bottomRow}>
                    <View style={styles.carouselSpace} />

                    <IconButton
                        onPress={prevImage}
                        iconName="ChevronLeft"
                        size={24}
                        color={Colors.primary}
                    />

                    <View style={styles.thumbnailRow}>
                        {visibleThumbnails.map((img, index) => {
                           
                            const realIndex = images.length < 3
                                ? index
                                : (currentIndex - 1 + index + images.length) % images.length;

                            return (
                                <TouchableOpacity
                                    key={`${img.uri}-${index}`}
                                    onPress={() => setCurrentIndex(realIndex)}
                                    onLongPress={() => confirmDelete(realIndex)}
                                    style={styles.touchableThumbnail}
                                >
                                    <Image
                                        source={{ uri: img.uri }}
                                        style={[
                                            styles.thumbnail,
                                            { opacity: realIndex === currentIndex ? 1 : 0.5 }
                                        ]}
                                    />
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <IconButton
                        onPress={nextImage}
                        iconName="ChevronRight"
                        size={24}
                        color={Colors.primary}
                    />

                    <View style={styles.carouselSpace} />
                </View>
            </View>
            <View style={styles.buttonWrapper}>
                <BasicButton
                    title="Dodaj još"
                    onPress={pickImage}
                    className='w-full h-full'
                    textClassName="text-center"
                />
            </View>
        </View>
    );
};

export default ImagePicker;