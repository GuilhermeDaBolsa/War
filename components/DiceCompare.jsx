import React from 'react';
import { View, Text } from 'react-native';
import DiceResult from './DiceResult';

export default function DiceCompare(props) {
	return (
		<View style={{justifyContent: 'center'}}>
			<Text style={{marginHorizontal: 8, color: 'white', textAlign: 'center', marginBottom: 6}}>{props.title}</Text>

			<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
				<DiceResult faceNumber={props.dice1} width={26} height={26} backgroundColor={'#232323'} tintColor={props.color1}/>
				<Text style={{marginHorizontal: 8, color: 'white'}}>X</Text>
				<DiceResult faceNumber={props.dice2} width={26} height={26} backgroundColor={'#232323'} tintColor={props.color2}/>
			</View>
			
			<Text style={{marginHorizontal: 8, color: props.dice1 < props.dice2 ? props.color1 : props.color2, textAlign: 'center', marginBottom: 6, fontSize: 32}}>
				-1
			</Text>
		</View>
	);
}