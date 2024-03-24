import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PieChart } from "react-native-gifted-charts";
import DocSize from './DocSize';
export default function PieChartComp() {
  const [pieData, setPieData] = useState([]);
  const [legendData, setLegendData] = useState([]);
  const [FreePercentage, setFreePercentage] = useState("0"); 

    useEffect(() => {
 
    const fillPieData = async () => {
      try {
        const data = await AsyncStorage.multiGet([
          'Images', 'Other', 'Videos', 'freeSpace', 'usedSpace', 
        ]);

        const colors = ['#FF5733', '#33FFB9', '#FF33E9', '#F1A9FF', '#33FF42'];
        let images = 0;
        let other = 0;
        let videos = 0;
        let freeSpaceValue = 0;
        let usedSpaceValue = 0;
        const pieChartData = data.map(([key, value], index) => {
          const parsedValue = parseInt(value);
          if (key === 'Images') {
             images = parsedValue;
          } else if (key === 'Other') {
             other = parsedValue;
          } else if (key === 'Videos') {
             videos = parsedValue;
          } else if (key === 'freeSpace') {
             freeSpaceValue = parsedValue;
          } else if (key === 'usedSpace') {
             usedSpaceValue = parsedValue;
          } 
          usedSpaceValue -= images + other + videos;
            const newFreePercentage = ((freeSpaceValue / (freeSpaceValue + usedSpaceValue)) * 100).toFixed(2) + '%';
            
        setFreePercentage(newFreePercentage);
          return {
            name: key,
            value: parsedValue,
            color: colors[index % colors.length]
          };
        });

        setPieData(pieChartData);

        const legendItems = pieChartData.map((dataItem, index) => (
          <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 10, height: 10, backgroundColor: dataItem.color, marginRight: 5 }} />
            <Text style={{ color: 'white' }}>{dataItem.name} ({DocSize(dataItem.value)})</Text>
          </View>
        ));

        // Split legend items into two rows
        const halfLength = Math.ceil(legendItems.length / 2);
        const legendItemsFirstRow = legendItems.slice(0, halfLength);
        const legendItemsSecondRow = legendItems.slice(halfLength);

        setLegendData([legendItemsFirstRow, legendItemsSecondRow]);
      } catch (error) {
        console.log('Error fetching data from AsyncStorage:', error);
      }
    };

    fillPieData();
  }, []);

  return (
      <View style={{ margin: 20, padding: 16, borderRadius: 20,  }}>
        <View style={{ padding: 20, alignItems: 'center' }}>
          <PieChart
            data={pieData}
            donut
            showGradient
            sectionAutoFocus
            radius={90}
            innerRadius={60}
            innerCircleColor={'#232B5D'}
            centerLabelComponent={() => (
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 22, color: 'white', fontWeight: 'bold' }}>
                {FreePercentage} 
                </Text>
                <Text style={{ fontSize: 14, color: 'white' }}>Empty</Text>
              </View>
            )}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between',padding: 16, marginTop: 10,backgroundColor: '#33A3FF',borderRadius:15 }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            {legendData[0]}
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            {legendData[1]}
          </View>
        </View>
      </View>
  );
}
