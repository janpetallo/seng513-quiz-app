class Quiz {
    constructor(){
        this.score = 0;
        this.questionCounter = 1;
        this.difficulty = 'easy';
    };

    quizStart() {


    };
    
    nextQuestion(){
        this.questionCounter++;  
        
    };

    getScore() {
        return this.score;
    };
    
    getQuestionNumber(){
        return "Question Number: " + this.questionCounter.toString() + " / 10";
    };

    setDifficulty(difficulty){
        this.difficulty = difficulty;
    }
}

class Question{
    constructor(text, choices, answer) {
        this.text = text;
        this.choices = choices;
        this.answer = answer;
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

        question_bank = data.results;

    } catch (error) {
        console.error(error);
    }
} fetchData();


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


// Getting difficulty
// Retrieve the radio buttons group difficulty
let radioButtons = document.getElementsByName('difficulty');

// Add event listener to each radio button
radioButtons.forEach(function(radioButton) {
    radioButton.addEventListener('change', function() {
        quiz.setDifficulty(radioButton.value);
    });
});