import React, { Component } from 'react';
import { Animated, Pressable } from 'react-native';
import DiceResult from './DiceResult';

export default class Dice extends Component {
	state = {
		faceNumber: 1,
	}

	UNSAFE_componentWillMount() {
		if(this.props.childRef) {
			this.props.childRef.current = { rollDice: this.rollDice }
		}

		this.value = 0;
		this.animatedValue = new Animated.Value(0);
		this.rollAnimation = null;
		this.isSpinning = false;

		this.animatedValue.addListener( ({ value }) => {

			if(this.value % 180 < 90 && value % 180 >= 90)
				this.setState(state => ({ faceNumber: Math.floor(Math.random() * 6) + 1 }))

			this.value = value;
		})

		this.frontInterpolate = this.animatedValue.interpolate({
			inputRange: [0, 180],
			outputRange: ['0deg', '180deg'],
		})
	}

	rollDice() {
		if(this.isSpinning)
			this.rollAnimation.stop();
		
		this.isSpinning = true;
		
		this.rollAnimation = Animated.decay(this.animatedValue, {
			velocity: this.props.spinForce / 5,
			deceleration: this.props.deceleration,
			useNativeDriver: true
		});

		this.rollAnimation.start(({ finished }) => {
			if(finished) {
				Animated.timing(this.animatedValue, {
					toValue: Math.floor((this.value / 180) + (this.value % 180 >= 90 ? 1 : 0)) * 180,
					duration: 200,
					delay: 200,
					useNativeDriver: true
				}).start(() => {
					this.isSpinning = false;
				});

				this.props.onStopSpin(this.state.faceNumber);
			}
		});
	}

	render() {
		const frontAnimatedStyle = {
			transform: [ { rotateY: this.frontInterpolate } ]
		}

		return (
			<Pressable onPress={() => {this.rollDice()}}>
				<Animated.View style={frontAnimatedStyle}>
					<DiceResult faceNumber={this.state.faceNumber} width={100} height={100} backgroundColor={'#232323'} tintColor={'#0e8c3b'}/>
				</Animated.View>
			</Pressable>
		);
	}
}