import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import { Colors } from "@/src/styles/style";

export type TaskDamageCostTemplateProps = {
  dropdown: React.ReactNode;
  list: React.ReactNode;
  floatingButton: React.ReactNode;
};

const screenHeight = Dimensions.get("window").height;

const TaskDamageCostTemplate: React.FC<TaskDamageCostTemplateProps> = ({
  dropdown,
  list,
  floatingButton,
}) => {
  return (
    <View style={styles.root}>
      <View style={styles.dropdownSection}>{dropdown}</View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
      
        <View style={styles.listSection}>{list}</View>
      </ScrollView>

      
      <View style={styles.floatingBtnWrapper}>{floatingButton}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  scrollContent: {
    paddingTop: 15,
    paddingBottom: 120, 
    alignItems: "center",
  },

 
  dropdownSection: {
    width: "92%",
    marginBottom: 10,
    marginTop:10,
    marginHorizontal:15,
  },

  listSection: {
    width: "92%",
    marginBottom: screenHeight * 0.05,
  },

  floatingBtnWrapper: {
    position: "absolute",
    bottom: 25,
    right: 25,
  },
});

export default TaskDamageCostTemplate;