 import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import LottieView from 'lottie-react-native';

class App extends React.Component {  
  constructor(props) {
    super(props)

    this.state = {
      currentQuestion: 0,
      myAnswer: null,
      options: [],
      score: 0,
      disabled: true,
      isEnd: false,
      getQuestions: [],
      questions: [],
      answer: [],
      nextButtonCounter: 0,
      isDataReady: false,
      isAnswerCorrect: false
    };
  };

  static get options() {
    return {
      topBar: {
        visible: false
      }
    };
  }

  componentDidMount = async () => {
    await this.loadQuizData()
  }

  componentDidUpdate(prevProps, prevState) {
    const randomNum = Math.floor(Math.random() * 4);
    const { getQuestions, currentQuestion } = this.state;
    if (currentQuestion !== prevState.currentQuestion) {
      this.setState({
        disabled: true,
        questions: getQuestions[currentQuestion].question,
        options: getQuestions[currentQuestion].incorrect_answers.concat(getQuestions[currentQuestion].incorrect_answers.splice(randomNum, 0, getQuestions[currentQuestion].correct_answer)),
        answer: getQuestions[currentQuestion].correct_answer,
      })
    }
  }

  prepareData = () => {
    const { getQuestions, currentQuestion } = this.state;
    const randomNum = Math.floor(Math.random() * 4);
    this.setState({
      questions: getQuestions[currentQuestion].question,
      options: getQuestions[currentQuestion].incorrect_answers.concat(getQuestions[currentQuestion].incorrect_answers.splice(randomNum, 0, getQuestions[currentQuestion].correct_answer)),
      answer: getQuestions[currentQuestion].correct_answer
    });
  };

  loadQuizData = () => {
    const fetchLink = `https://opentdb.com/api.php?amount=10`
    fetch(
      fetchLink
    ).then(res => {
      return res.json();
    }).then(loadedQuestions => {
      this.setState({ getQuestions: loadedQuestions.results, isDataReady: true })
      this.prepareData()
    })
      .catch(err => {
        console.error(err);
      });
  }

  nextQuestionHandler = () => {
    const { myAnswer, answer, score, nextButtonCounter, currentQuestion } = this.state;

    if (myAnswer === answer && nextButtonCounter % 2 === 0) {
      this.setState({
        score: score + 100,
        isAnswerCorrect: true,
        currentQuestion: currentQuestion + 1,
      });
    }
    else if ((myAnswer !== answer && nextButtonCounter % 2 === 0)) {
      this.setState({
        isAnswerCorrect: false,
        currentQuestion: currentQuestion + 1,
      });
    }
    this.setState({
      nextButtonCounter: nextButtonCounter + 1,
    })
  };

  checkAnswer = answer => {
    this.setState({ myAnswer: answer, disabled: false })
  };

  nextQuestionHandler = () => {
    const { myAnswer, answer, score, nextButtonCounter, currentQuestion } = this.state;

    if (myAnswer === answer && nextButtonCounter % 2 === 0) {
      this.setState({
        score: score + 100,
        isAnswerCorrect: true,
        currentQuestion: currentQuestion + 1,
      });
    }
    else if ((myAnswer !== answer && nextButtonCounter % 2 === 0)) {
      this.setState({
        isAnswerCorrect: false,
        currentQuestion: currentQuestion + 1,
      });
    }
    this.setState({
      nextButtonCounter: nextButtonCounter + 1,
    })
  };

  quesStatus = () => {
    const { isAnswerCorrect, score } = this.state;
    const lottiePath = isAnswerCorrect ? require('./lottieJson/funkyChicken.json') : require('./lottieJson/somethingWentWrong.json');
    
    return (
      <View style={{ flex: 1,justifyContent:'center' }}>
        <View style={{
            justifyContent:'center',
            alignItems:'center'
            }}>
        <LottieView
          source={lottiePath}
          autoPlay
          loop
          style={{
            width: 200,
            height: 200
          }}
        />
        </View>
        <View style={{justifyContent:'center', alignItems:'center', marginTop: 10}}>
          {isAnswerCorrect ? <Text style={{alignItems:'center'}}>Great Work</Text> : <Text>Whoops wrong answer</Text>}
          {isAnswerCorrect && <Text>You have earned 100 points</Text>}
          <Text>Total: {score} points</Text>
          <View style={{marginTop:20}}>
            <Button
              onPress={() => this.nextQuestionHandler()}
              title='Next'
            />
          </View>
        </View>
      </View>
    )
  }

  getScreen = () => {
    const { nextButtonCounter } = this.state;
    return (
      <View style={{flex:1}}>
        {nextButtonCounter % 2 === 0 ? this.getGeneralView() : this.quesStatus()}
      </View>
    )
  }

  finishHandler = () => {
    const { myAnswer, answer, score, currentQuestion, getQuestions } = this.state;

    if (myAnswer === answer) {
      this.setState({
        score: score + 100
      });
    }
    if (currentQuestion === getQuestions.length - 1) {
      this.setState({
        isEnd: true
      });
    }
  };

  theEndView = () => {
    const { score, getQuestions } = this.state;
    return (
      <View style={styles.finishContainer}>
        <Text style={styles.finishText}>Game Over your Final score is {score} points </Text>
        <Text style={styles.finishText}> The correct answer's for the questions was</Text>
        {getQuestions.map((item, index) => (
          <Text key={index} style={styles.finishCorrectText}>{item.correct_answer}</Text>
        ))}
      </View>
    );
  }

getGeneralView = () => {
  const { options, myAnswer, currentQuestion, isEnd, questions, getQuestions, disabled } = this.state;
  if (isEnd) {
    return (
      <View style ={{flex:1}}>
        {this.theEndView()}
      </View>
    );
  }
  else {
    return(
      <View style={{ flex: 2 }}>
        {this.getHeader()}
        <View style={styles.questionsContainer}>
          <Text style={styles.questionsText}>
            {questions}
          </Text>
        </View>
        <View style={{ flex: 2}}>
          {options.map(option => (
            <TouchableOpacity
              style={{ borderWidth: 1, marginBottom: 20, marginHorizontal: 15, backgroundColor: myAnswer === option ? 'green' : 'white' }}
              key={option.id}
              onPress={() => this.checkAnswer(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
            {currentQuestion < getQuestions.length - 1 && (
              <Button
                disabled={disabled}
                onPress={() => this.nextQuestionHandler()}
                title='Next'
              />
            )}
            {currentQuestion === this.state.getQuestions.length - 1 && (
              <Button
                onPress={() => this.finishHandler()}
                title='Finish'
              >
              </Button>
            )}
          </View>
      </View>
    )
  }
}

  dataWaiting = () => {
    return (
      <View style={{flex:1}}>
        <LottieView
          source={require('./lottieJson/loading.json')}
          autoPlay
          loop
          style={{
            flex:1
          }}
        />
      </View>
    )
  }

  getHeader = () => {
    const { currentQuestion, getQuestions, score, nextButtonCounter } = this.state;
    return (
      <View style={styles.headerContainer}>
        <View style={{ flex: 1, justifyContent: 'center'}}>
          {nextButtonCounter % 2 === 0 && <Text style={{color:'white', marginLeft:10 }}>{`Questions ${currentQuestion + 1}/${getQuestions.length}`}</Text>}
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
          <Text style={{color:'white'}}> Total</Text>
          <Text style={{color:'white'}}>{score} points</Text>
        </View>
      </View>
    )
  }

  render () {
    return (
      <>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{justifyContent: 'space-around',flex:1}}>
              <StatusBar hidden />
              {this.state.isDataReady ? this.getScreen() : this.dataWaiting()}
          </ScrollView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  questionsContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  questionsText: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  optionText: { 
    textAlign: 'center', 
    paddingVertical: 10 
  },
  headerContainer: {
    backgroundColor: '#0075C3',
    height:50, 
    flexDirection:'row',
    justifyContent:'space-around'
  },
  finishText: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '400',
  },
  finishCorrectText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '600',
  },
  finishContainer: { 
    flex: 1,
    backgroundColor:'#3778db', 
    justifyContent:'center', 
    alignItems:'center' 
  }
});
export default App;