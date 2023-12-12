import { View, Text } from 'react-native'
import React, {useState} from 'react'
import RadioButtonRN from 'radio-buttons-react-native';
export default function QuestionWithRadioButton({
  question,
  options,
  selectedIndex,
  selectedOption,
  handleSelectedOption,
}) {
  return (
    <View>
      <Text style={{ fontSize: 12, fontWeight: '700', textAlign: 'left', position: 'relative', bottom: 3, right: 25 }}>
        {question}
      </Text>
      <View>
        <RadioButtonRN
          data={options}
          box={false}
          selectedBtn={(selected) => handleSelectedOption(selected, selectedIndex)}
          style={{ flexDirection: 'row', alignSelf: 'flex-end', columnGap: 30, position: 'relative', bottom: 40, left: 35 }}
        />
      </View>
    </View>
  );
}