import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'
import cn from 'clsx'
   
interface CustomInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'number-pad' | 'phone-pad' | 'email-address' | 'url';

}

const CustomInput = ({placeholder='Enter text', value, onChangeText, secureTextEntry=false, keyboardType='default'}: CustomInputProps) => {

const [isFocused,setIsFocused] = useState(false);

  return (
    <View>
      <TextInput
        onFocus={()=>setIsFocused(true)}
        onBlur={()=>setIsFocused(false)}
        placeholderTextColor={isFocused? 'transparent' : 'gray'}
        autoCorrect={false}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize='none'
        keyboardType={keyboardType}


        className={cn( 'h-[50px]  rounded-xl px-4 mb-4 text-base bg-[#f3f3f3] paragraph-semibold',isFocused?'border-primary':'border-gray-300')}

      />
    </View>
  )
}

export default CustomInput