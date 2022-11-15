import React from 'react';
import { Image, View } from 'react-native';

const faces = [
	require('../assets/dice1.png'),
	require('../assets/dice2.png'),
	require('../assets/dice3.png'),
	require('../assets/dice4.png'),
	require('../assets/dice5.png'),
	require('../assets/dice6.png'),
]

export default function DiceResult(props) {
	return (
		<View style={{ backgroundColor: props.backgroundColor, borderRadius: 10, alignSelf: 'baseline' }}>
			<Image
				style={{ width: props.width, height: props.height, tintColor: props.tintColor }}
				source={faces[(Math.abs(props.faceNumber - 1)) % 6]}
			/>
		</View>
	);
}