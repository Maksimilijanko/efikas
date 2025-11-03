import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Button, Alert, StyleProp } from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import styles from './index.styles';
import { Colors } from '@/src/styles/style';
import { BasicButton } from '../../atoms/BasicButton/BasicButton';
import { IconButton } from '../../atoms/IconButton/IconButton';
import { PropsFilter } from 'react-native-reanimated/lib/typescript/createAnimatedComponent/PropsFilter';
import { ViewStyle } from '@expo/html-elements/build/primitives/View';
import { Label } from '../../atoms/Label/Label';

interface ImageItem {
    uri: string;
}

interface ImagePickerProps {
    style?: StyleProp<ViewStyle>;
}

const ImagePicker = ({ style }: ImagePickerProps) => {

    //dummy data images for demonstration
    const defaultImages: ImageItem[] = [
        { uri: 'https://picsum.photos/400/300?1' },
        { uri: 'https://picsum.photos/400/300?2' },
        { uri: 'https://picsum.photos/400/300?3' },
    ];

    const [images, setImages] = useState<ImageItem[]>(defaultImages);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

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
            setImages((prev) => [...prev, ...newImages]);
            setCurrentIndex(prev => prev); // Ostaje na trenutnoj slici
        }
    };

    const confirmDelete = (index: number) => {
        Alert.alert(
            'Obriši sliku',
            'Jeste li sigurni da želite obrisati ovu sliku?',
            [
                { text: 'Otkaži', style: 'cancel' },
                { text: 'Obriši', style: 'destructive', onPress: () => deleteImage(index) },
            ]
        );
    };

    const deleteImage = (index: number) => {
        setImages((prev) => {
            const newImages = prev.filter((_, i) => i !== index);
            if (newImages.length === 0) {
                setCurrentIndex(0);
            } else if (currentIndex >= newImages.length) {
                setCurrentIndex(newImages.length - 1);
            }
            return newImages;
        });
    };

    const visibleThumbnails = getVisibleThumbnails();

    if (images.length === 0) {
        return (
            <View style={styles.container}>
                <Button title="Dodaj slike" onPress={pickImage} />
            </View>
        );
    }

    return (
        <View style={[style, styles.container]}>
            <View style={styles.labelHolder}>
                <Label text={"Slike"} size={"lg"} />
            </View>
            <View style={styles.pickerHolder} >
                <TouchableOpacity onLongPress={() => confirmDelete(currentIndex)} style={styles.mainImageTouchable} >
                    <Image source={{ uri: images[currentIndex].uri }} style={styles.mainImage} />
                </TouchableOpacity>

                <View style={styles.bottomRow}>
                    <View style={styles.carouselSpace} />
                    <IconButton onPress={nextImage} iconName="ChevronLeft" size={24} color={Colors.primary} />


                    <View style={styles.thumbnailRow}>
                        {visibleThumbnails.map((img, index) => {
                            const realIndex = (currentIndex - 1 + index + images.length) % images.length;
                            return (
                                <TouchableOpacity
                                    key={realIndex}
                                    onPress={() => setCurrentIndex(realIndex)}
                                    onLongPress={() => confirmDelete(realIndex)}
                                    style={styles.touchableThumbnail}
                                >
                                    <Image
                                        source={{ uri: img.uri }}
                                        style={[styles.thumbnail, { opacity: realIndex === currentIndex ? 1 : 0.5 }]}
                                    />
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <IconButton onPress={nextImage} iconName="ChevronRight" size={24} color={Colors.primary} />

                    <View style={styles.carouselSpace} />
                </View>
            </View>
            <View style={styles.buttonWrapper}>
                <BasicButton title="Dodaj" onPress={pickImage} />
            </View>
        </View>
    );
};

export default ImagePicker;
