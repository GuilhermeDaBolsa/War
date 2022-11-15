import React from 'react';
import { View, Text } from 'react-native';
import DiceResult from './DiceResult';

export default function DiceCompare(props) {
	return (
		<View style={{justifyContent: 'center'}}>
			<Text style={{marginHorizontal: 8, color: 'white', textAlign: 'center', marginBottom: 6}}>{props.title}</Text>

			<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
				<DiceResult faceNumber={props.diceAtk} width={26} height={26} backgroundColor={'#232323'} tintColor={props.atkColor}/>
				<Text style={{marginHorizontal: 8, color: 'white'}}>X</Text>
				<DiceResult faceNumber={props.diceDef} width={26} height={26} backgroundColor={'#232323'} tintColor={props.defColor}/>
			</View>
			
			<Text style={{marginHorizontal: 8, color: props.diceAtk <= props.diceDef ? props.atkColor : props.defColor, textAlign: 'center', marginBottom: 6, fontSize: 32}}>
				-1
			</Text>
		</View>
	);
}