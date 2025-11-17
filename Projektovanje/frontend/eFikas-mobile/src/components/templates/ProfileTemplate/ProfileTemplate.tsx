import React, { ReactNode } from 'react';
import { View } from 'react-native';
import styles from './styles';

interface Props {
  content: ReactNode;
}

export default function ProfileTemplate({ content }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>{content}</View>
    </View>
  );
}


//PRIMJER POZIVA
/**
   <ProfileTemplate
       content={
    <>
      <LabeledTextField label="Ime"/>
      <LabeledTextField label="Prezime"/>
      ...
    </>
  }
     />
 */

