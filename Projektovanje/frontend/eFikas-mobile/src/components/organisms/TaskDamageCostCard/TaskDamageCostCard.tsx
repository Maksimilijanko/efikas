import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';


interface TaskDamageCostCardProps {
 apartmant: string;
 description: string;
id: string;   
 isFinished: boolean; 
 onFinish: (id: string) => void; 
}

const FinishButton = ({ onPress, text }) => (
 <RectButton style={styles.rightAction} onPress={onPress}>
 <Text style={styles.actionText}>{text}</Text>
 </RectButton>
);


export default class TaskDamageCostCard extends Component<TaskDamageCostCardProps> {


 swipeableRow: Swipeable | null = null;
 
 updateRef = (ref: Swipeable | null) => {
 this.swipeableRow = ref;
 };

 close = () => {
 if (this.swipeableRow) {
 this.swipeableRow.close();
 }
 };

 handleFinish = () => {
this.props.onFinish(this.props.id); 
 this.close(); 
 }

 renderRightActions = () => (
<View style={styles.rightActionContainer}>
 <FinishButton 
 onPress={this.handleFinish} 
 text="Završi" 
 />
</View>
 );

 render() {

 const { isFinished } = this.props; 

 const { apartmant, description } = this.props; 


 const barColor = isFinished ? '#4CAF50' : 'red'; 

const ContentView = () => (
 <View style={styles.contentContainer}>
 <View style={[styles.redBar, { backgroundColor: barColor }]} />
 <View style={styles.textContainer}>
<Text style={styles.primaryText}>{apartmant}</Text>
 <Text style={styles.secondaryText}>{description}</Text>
 </View>
 </View>
 );

 return (
<Swipeable 
ref={this.updateRef}
 friction={2} 
 leftThreshold={40}
rightThreshold={40}

 renderRightActions={!isFinished ? this.renderRightActions : null} 
 >
 <ContentView />
 </Swipeable>
 );
 }
}


const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: 'white',
    paddingVertical: 0, 
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 8, 
    minHeight: 80,
    paddingLeft: 21, 
  },
  textContainer: {
    marginLeft: 0, 
    paddingVertical: 20, 
  },
  primaryText: {
    fontSize: 16,
    fontWeight: 'bold',
        marginBottom: 4,
  },
  secondaryText: {
    fontSize: 14,
    color: 'gray',
  },
  redBar: {
    width: 6,
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  rightActionContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 100, 
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  rightAction: {
    backgroundColor: '#4CAF50', 
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  actionText: {
    color: 'white',
    fontWeight: '600',
    padding: 10,
  },
});