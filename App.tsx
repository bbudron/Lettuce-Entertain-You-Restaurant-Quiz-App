/*
 * Quiz by Brandon Budron for Lettuce Entertain You
 * This component displays the quiz questions and allows the user to select their answers.
 * This component also includes logic for handling user input, updating progress, and displays result.
 */

import React, { useState } from "react";
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Alert } from 'react-native';

import Colors from './assets/constants/Colors';
import questions from './assets/data/questions';
const backgroundImage = require('./assets/img/pattern.jpg')

function App(): JSX.Element {
  // index represents the current index of the question that is being displayed in the quiz.
  const [index, setIndex] = useState(0);

  // score represents the score that is accumulated by the user as they answer each question.
  const [score, setScore] = useState(0);

  // selected represents whether an answer has been selected or not.
  const [selected, setSelected] = useState(false)

  // answers is an array of four objects, each representing an answer option for the current question.
  const [answers, setAnswers] = useState([
    { id: 0, value: questions[index].answers[0].value, name: questions[index].answers[0].label, selected: false },
    { id: 1, value: questions[index].answers[1].value, name: questions[index].answers[1].label, selected: false },
    { id: 2, value: questions[index].answers[2].value, name: questions[index].answers[2].label, selected: false },
    { id: 3, value: questions[index].answers[3].value, name: questions[index].answers[3].label, selected: false }
  ]);

  // This component renders a touchable radio button with a selected or unselected state and receives three props:
  // onPress: a function to handle when the radio button is pressed
  // selected: a boolean indicating whether the radio button is currently selected
  // children: the label text to display alongside the radio button
  const RadioButton = ({ onPress, selected, children }: { onPress: () => void; selected: boolean; children: string }) => {
    return (
      <View style={styles.radioButtonContainer}>
        <TouchableOpacity onPress={onPress} style={styles.radioButton}>
          {selected ? <View style={styles.radioButtonSelected} /> : null}
        </TouchableOpacity>
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.radioButtonText}>{children}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  // This function updates the state of the quiz answers, it receives an 'id' parameter that's used to identify the selected answer.
  // The 'setSelected' and 'setAnswers' hooks are then used to update the state with the new answer data.
  const onPressRadioButton = (id: number) => {
    let updatedState = answers.map(answer => {
      return answer.id === id ? { ...answer, selected: true } : { ...answer, selected: false }
    });

    setSelected(true)
    setAnswers(updatedState);
  }

  // This function handles when the 'Next Question' button is pressed and updates the state of the quiz progress and score.
  const onPressNextQuestion = () => {
    // If a radio button is selected, the function updates the 'score' state with the value of the selected answer,
    // The 'index', 'selected', and 'answers' are updated with states that includes the data for the next question.
    if (selected) {
      // If the current question is the last question, the function calculates the final score and recommends a restaurant based on the score.
      if (index <= answers.length) {
        const newIndex = index + 1

        let updatedAnswers = answers.map(answer => {
          if (answer.selected) {
            setScore(score + answer.value)
          }
          return { ...answer, value: questions[newIndex].answers[answer.id].value, name: questions[newIndex].answers[answer.id].label, selected: false }
        });

        setSelected(false)
        setIndex(newIndex)
        setAnswers(updatedAnswers);
      } else {
        // Calculate the score and determine the related restaurant
        let restaurant = ""
        answers.forEach(answer => {
          if (answer.selected) {
            const finalScore = score + answer.value

            if (finalScore >= 6 && finalScore <= 10) {
              restaurant = "Tallboy"
            } else if (finalScore >= 11 && finalScore <= 16) {
              restaurant = "Beatrix"
            } else if (finalScore >= 17 && finalScore <= 21) {
              restaurant = "Hub 51"
            } else {
              restaurant = "RPM Seafood"
            }
          }
        });

        // An alert is displayed with the recommendation and an option to retake the quiz.
        Alert.alert('You should go to ' + restaurant, '', [
          {
            text: 'Retake Quiz', 
            onPress: () => {
              // Data is reset to allow for user to retake the quiz
              let updatedAnswers = answers.map(answer => {
                return { ...answer, value: questions[0].answers[answer.id].value, name: questions[0].answers[answer.id].label, selected: false }
              });

              setIndex(0)
              setScore(0)
              setSelected(false)
              setAnswers(updatedAnswers);
            }
          }
        ])
      }
    } else {
      // If no option is selected for the current question, an alert is displayed to prompt the user to select an option.
      Alert.alert('No option selected', 'Please try again', [{ text: 'Ok' }])
    }
  }

  // This screen displays the quiz question, options, and a 'Next' button for progressing to the next question.
  return (
    <View style={styles.app}>
      <ImageBackground source={backgroundImage} style={styles.image}>
        <Text style={styles.title}>QUIZ</Text>
        <Text style={styles.subtitle}>Take our restaurant quiz to find out what restaurant you should have.</Text>

        <View style={styles.container}>
          <View style={styles.questionContainer}>
            <Text style={styles.question}>{questions[index].questionText}</Text>
          </View>

          <View style={styles.divider}></View>

          {// Maps through the 'answers' array and generates a 'RadioButton' component for each answer option.
            answers.map(item => (
              <RadioButton
                onPress={() => onPressRadioButton(item.id)}
                selected={item.selected}
                key={item.id}
              >
                {item.name}
              </RadioButton>
            ))
          }

          <TouchableOpacity
            style={styles.button}
            onPress={() => onPressNextQuestion()}
          >
            <Text style={styles.buttonText}>NEXT QUESTION</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover'
  },
  title: {
    color: Colors.black,
    fontSize: 75,
    letterSpacing: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.black,
    fontSize: 24,
    textAlign: 'center',
    width: 270,
    marginTop: 20,
    lineHeight: 30
  },
  container: {
    height: 400,
    width: 350,
    marginTop: 50,
    backgroundColor: Colors.white,
    borderColor: Colors.blue,
    borderWidth: 7.5,
  },
  questionContainer: {
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
    paddingHorizontal: 30,
  },
  question: {
    fontSize: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 4,
    fontWeight: 'bold',
  },
  divider: {
    borderBottomColor: Colors.blue,
    borderBottomWidth: 4,
    marginLeft: 40,
    marginRight: 40,
    marginBottom: 30
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginLeft: 65
  },
  radioButton: {
    height: 30,
    width: 30,
    backgroundColor: Colors.white,
    borderRadius: 15,
    borderWidth: 4,
    borderColor: Colors.blue,
    alignItems: "center",
    justifyContent: "center"
  },
  radioButtonSelected: {
    height: 14,
    width: 14,
    borderRadius: 7,
    backgroundColor: Colors.blue
  },
  radioButtonText: {
    fontSize: 20,
    marginLeft: 16,
    textTransform: 'lowercase',
    letterSpacing: 1,
  },
  button: {
    backgroundColor: Colors.blue,
    width: 250,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: -30,
    justifyContent: 'center'
  },
  buttonText: {
    fontWeight: 'bold',
    letterSpacing: 2,
    fontSize: 16,
  },
});

export default App;