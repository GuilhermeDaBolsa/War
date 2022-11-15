import React, {useRef, useState, useEffect} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, Image, Pressable, Text, ScrollView } from 'react-native';
import Dice from './components/Dice';
import DiceCompare from './components/DiceCompare';

const swordImage = require('./assets/sword.png')
const shieldImage = require('./assets/shield.png')

export default function App() {

	const attackerColor = '#c41b4b';
	const defensorColor = '#1b8cc4';
	const resultLabels = ['maiores', 'médios', 'menores'];

	const [isBattleling, setIsBattleling] = useState(0);

	const [disableBattle, setDisableBattle] = useState(false);

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

	

	function battle() {
		if(!isBattleling && !disableBattle) {
			setDisableBattle(true);
			setIsBattleling(6);

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

		if(isBattleling > 0)
			setIsBattleling(isBattleling - 1);
	}

	function generateRandomDiceSpinForce() {
		return Math.floor(Math.random() * 14) + 4;
	}


	useEffect(() => {
		if(isBattleling == 0) {
			const sortedAttackerDices = [...attackerDices].sort((a,b) => b.faceOnTop - a.faceOnTop);
			const sortedDefensorDices = [...defensorDices].sort((a,b) => b.faceOnTop - a.faceOnTop);

			diceBattleResults.forEach((result, i) => {
				result.setAttakerResult(sortedAttackerDices[i].faceOnTop);
				result.setDefensorResult(sortedDefensorDices[i].faceOnTop);
			})

			setTimeout(() => setDisableBattle(false), 800);
		}
	 }, [isBattleling])

	return (
		<SafeAreaView style={styles.root}>
			<ScrollView style={styles.container}>

				<View style={{justifyContent: 'center', alignItems: 'center', padding: 18}}>
					<Image style={{ width: 48, height: 48, tintColor: attackerColor }} source={swordImage} resizeMode={'contain'}/>
				</View>

				<View style={styles.diceContainer}>
					{attackerDices.map(e => 
						<Dice
							key={e.key}
							ref={e.childRef}
							spinForce={e.spinForce}
							onStopSpin={(face: number) => { stoppedDice(e, face) }}
							backgroundColor={'#232323'}
							tintColor={attackerColor}
							disableTouchSpinn={disableBattle}
						/>
					)}
				</View>

				<View style={{marginVertical: 48, justifyContent: 'center', alignItems: 'center'}}>
					<Pressable style={[styles.battleBtn, disableBattle ? styles.battleBtnDisabled : styles.battleBtnEnabled]} onPress={battle}>
						<Text style={[styles.battleText, disableBattle ? styles.battleTextDisabled : styles.battleTextEnabled]}>! DUELO !</Text>
					</Pressable>
				</View>

				<View style={styles.diceContainer}>
					{defensorDices.map(e => 
						<Dice
							key={e.key}
							ref={e.childRef}
							spinForce={e.spinForce}
							onStopSpin={(face: number) => { stoppedDice(e, face) }}
							backgroundColor={'#232323'}
							tintColor={defensorColor}
							disableTouchSpinn={disableBattle}
						/>
					)}
				</View>

				<View style={{justifyContent: 'center', alignItems: 'center', padding: 18}}>
					<Image style={{ width: 48, height: 48, tintColor: defensorColor }} source={shieldImage} resizeMode={'contain'}/>
				</View>

				<View style={{marginTop: 28, flex: 1}}>
					{
						isBattleling ? <Text style={{color: 'white'}}>Battleling...</Text> :
							diceBattleResults.filter(result => result.attakerResult && result.defensorResult).length > 0 ?
							<>
								<Text style={{color: 'white', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 28}}>
									DESFECHO DA BATALHA
								</Text>

								<View style={styles.diceContainer}>
									{diceBattleResults.map(result => 
										<DiceCompare 
											key={result.key}
											title={result.label}
											diceAtk={result.attakerResult}
											diceDef={result.defensorResult}
											atkColor={attackerColor}
											defColor={defensorColor}
										/>
									)}
								</View> 

								<View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 22}}>
									<View style={{justifyContent: 'center', flexDirection: 'row', marginRight: 38}}>
										<Image style={{ width: 36, height: 36, tintColor: attackerColor, marginRight: 6 }} source={swordImage} resizeMode={'contain'}/>
										<Text style={{color: 'white', fontSize: 28}}>
											-{diceBattleResults.filter(r => r.attakerResult <= r.defensorResult).length}
										</Text>
									</View>

									<View style={{justifyContent: 'center', flexDirection: 'row'}}>
										<Image style={{ width: 36, height: 36, tintColor: defensorColor, marginRight: 6 }} source={shieldImage} resizeMode={'contain'}/>
										<Text style={{color: 'white', fontSize: 28}}>
											-{diceBattleResults.filter(r => r.attakerResult > r.defensorResult).length}
										</Text>
									</View>
								</View>
							</>
							: ''
					}
				</View>

			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: '#232323'
	},
	container: {
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
	},
	battleBtn: {
		padding: 12,
		borderRadius: 26,
		borderWidth: 1,
	},
	battleBtnEnabled: {
		backgroundColor: '#e3e3e3',
		borderColor: '#e3e3e3',
	},
	battleBtnDisabled: {
		backgroundColor: '#333333',
		borderColor: '#484848',
	},
	battleText: {
		textAlign: 'center',
		fontSize: 18,
		marginHorizontal: 12
	},
	battleTextEnabled: {
		color: 'black'
	},
	battleTextDisabled: {
		color: '#484848'
	}
});