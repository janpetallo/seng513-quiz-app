class Quiz {
    constructor(){
        this.score = 0;
        this.questionCounter = 1;
    };

    quizStart() {


    };

    nextQuestion(){
        // stop game after 10'th question
        if(quiz.questionCounter >= 10){
            document.getElementById("question").innerHTML = "Quiz Finished!"
        }else{
            this.questionCounter++;
            updateQuestionField();
        }
    };

    getScore() {
        return this.score;
    };

    getQuestionNumber(){
        return "Question Number: " + this.questionCounter.toString() + " / 10";
    };

}

class Question{
    constructor(text, choices, answer) {
        this.text = text;
        this.choices = choices;
        this.answer = answer;
    }

    getQuestion(){
        return this.text;
    }
}

class User {
    constructor (username) {
        this.username = username;
        this.scoreHistory = [];
    }

    // function to add score

    // function to display

}

let question_bank = [];

async function fetchData(){

    try {

        // fetch will return a response object and we need to await the promise from fetch
        // here we grab all our questions
        const response = await fetch("https://opentdb.com/api.php?amount=25&category=15&type=multiple");

        // once the promise from fetch resolves we need to see if it is okay
        // if we cant locate resource
        if(!response.ok){
            throw new Error("Could not fetch resource");
        }

        // we take our response and put it into data (we convert it to json)
        // we wait because response returns a promise
        const data = await response.json();

        for (let i = 0; i<data.results.length; i++) {
            const questionData = data.results[i];
            const question = new Question(questionData.question, questionData.incorrect_answers, questionData.correct_answer);
            question_bank.push(question);
        }

        updateQuestionField();
    } catch (error) {
        console.error(error);
    }
} fetchData();


function updateQuestionField() {
    // get the current question from the question bank
    let question = question_bank[quiz.questionCounter - 1];
    
    // display the question based on the question number
    document.getElementById("question").innerHTML = question.text;
    
    // correct answer
    let correctAnswer = question.answer;
    // incorrect answers
    let choices = question.choices;
    // randomly shuffle the choices (correct answer is included in the choices array)
    choices.splice(Math.floor(Math.random() * (choices.length + 1)), 0, correctAnswer);

    // display options
    let option1 = document.getElementById("btn1").textContent = choices[0];
    let option2 = document.getElementById("btn2").textContent = choices[1];
    let option3 = document.getElementById("btn3").textContent = choices[2];
    let option4 = document.getElementById("btn4").textContent = choices[3];
}





// Initialize user
let user = new User;
// Initialize a quiz
let quiz = new Quiz;


// Declaring the html document variables
let nextQuestionButton, questionNumberField;


document.addEventListener("DOMContentLoaded", function() {
    // Wait for the DOM content to be fully loaded before instantiating the document variables
    nextQuestionButton = document.getElementById("next-question");
    questionNumberField = document.getElementById("questionNumField");



    // Upon webpage startup

    // Update question number field upon page startup
    questionNumberField.textContent = quiz.getQuestionNumber();
   
 



    // Event listeners
    nextQuestionButton.addEventListener("click", function() {
        // get next question
        quiz.nextQuestion();
        // update question number
        questionNumberField.textContent = quiz.getQuestionNumber();
    });
});



