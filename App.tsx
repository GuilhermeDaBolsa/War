import React, {useRef, useState} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, Dimensions, Pressable, Text } from 'react-native';
import Dice from './components/Dice';
import DiceCompare from './components/DiceCompare';

export default function App() {

	const attackerColor = '#c41b4b';
	const defensorColor = '#1b8cc4';
	const resultLabels = ['maiores', 'médios', 'menores'];

	const attackerDices = Array.from(Array(3).keys()).map(e => {
		const [spinForce, setSpinForce] = useState(generateRandomDiceSpinForce());
		const [faceOnTop, setFaceOnTop] = useState(0);
		return { key: e, childRef: useRef(null), spinForce, setSpinForce, faceOnTop, setFaceOnTop }
	})

	const defensorDices = Array.from(Array(3).keys()).map(e => {
		const [spinForce, setSpinForce] = useState(generateRandomDiceSpinForce());
		const [faceOnTop, setFaceOnTop] = useState(0);
		return { key: e + 3, childRef: useRef(null), spinForce, setSpinForce, faceOnTop, setFaceOnTop }
	})

	const diceBattleResults = Array.from(Array(3).keys()).map(e => {
		const [attakerResult, setAttakerResult] = useState(0);
		const [defensorResult, setDefensorResult] = useState(0);
		return { key: e + 6, label: resultLabels[e], attakerResult, setAttakerResult, defensorResult, setDefensorResult }
	})

	const [isBattleling, setIsBattleling] = useState(0);
	const [disableBattle, setDisableBattle] = useState(false);

	

	function battle() {
		if(!isBattleling) {
			setDisableBattle(true);
			setIsBattleling(attackerDices.length + defensorDices.length);

			attackerDices.forEach((e, i) => setTimeout(() => battleRoll(e), i * 500) )
			defensorDices.forEach((e, i) => setTimeout(() => battleRoll(e), i * 500) )
		}
	}

	function battleRoll(dice: any) {
		dice.childRef.current.rollDice();
		dice.setSpinForce(generateRandomDiceSpinForce())
	}

	function stoppedDice(dice: any, faceOnTop: number) {
		dice.setFaceOnTop(faceOnTop);

		if(isBattleling > 0) {
			if(isBattleling == 1) {
				console.log("END BATTLE");
				setDisableBattle(false); //TODO MAKE TIMEOUT HERE
				
				attackerDices.forEach(e => console.log(e.faceOnTop) )
			}
			setIsBattleling(isBattleling - 1);
		}
	}

	function generateRandomDiceSpinForce() {
		return Math.floor(Math.random() * 14) + 4;
	}

	return (
		<SafeAreaView style={styles.root}>
			<View style={styles.container}>

				<View style={styles.diceContainer}>
					{attackerDices.map(e => 
						<Dice
							key={e.key}
							ref={e.childRef}
							spinForce={e.spinForce}
							onStopSpin={(face: number) => { stoppedDice(e, face) }}
						/>
					)}
				</View>

				<View style={{marginVertical: 48, justifyContent: 'center', alignItems: 'center'}}>
					<Pressable style={{ padding: 12, backgroundColor: '#e3e3e3', borderRadius: 24}} onPress={battle}>
						<Text style={{textAlign: 'center', fontSize: 18, marginHorizontal: 12}}>! DUELO !</Text>
					</Pressable>
				</View>

				<View style={styles.diceContainer}>
					{defensorDices.map(e => 
						<Dice
							key={e.key}
							ref={e.childRef}
							spinForce={e.spinForce}
							onStopSpin={(face: number) => { stoppedDice(e, face) }}
						/>
					)}
				</View>

				<View style={{marginTop: 48, flex: 1}}>
					{
						diceBattleResults.filter(result => result.attakerResult && result.defensorResult).length > 0 ?
						<>
							<Text style={{color: 'white', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 48}}>
								DESFECHO DA BATALHA
							</Text>

							<View style={styles.diceContainer}>
								{diceBattleResults.map(result => 
									<DiceCompare 
										key={result.key}
										title={result.label}
										dice1={result.attakerResult}
										dice2={result.defensorResult}
										color1={attackerColor}
										color2={defensorColor}
									/>
								)}
							</View> 
						</>
						: ''
					}
					
				</View>

			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: '#232323'
	},
	container: {
		paddingTop: Dimensions.get('window').height / 10,
		maxWidth: 600,
		width: "100%",
		height: "100%",
		alignSelf: 'center'
	},
	diceContainer: {
		width: "100%",
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	}
});