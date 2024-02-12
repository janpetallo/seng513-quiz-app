
class Quiz {
    constructor(questions, username) {
        this.questions = questions;
        this.username = username;
        this.score = 0;
        this.questionCounter = 0; // array of questions initially at 0
    };

    static async create(username) {
        const questions = await fetchData();
        return new Quiz(questions, username);
    }

    quizStart() {
        displayQuestion(this.questions[this.questionCounter]);
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
    
}

class Question{
    constructor(text, choices, answer) {
        this.text = text;
        this.incorrectAnswers = choices;
        this.correctAnswer = answer;
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



async function fetchData(){
    try {
        // fetch will return a response object and we need to await the promise from fetch
        // here we grab all our questions
        const response = await fetch("https://opentdb.com/api.php?amount=25&category=9&type=multiple");

        // once the promise from fetch resolves we need to see if it is okay
        // if we cant locate resource
        if (!response.ok) {
            throw new Error("Could not fetch resource");
        }

        // we take our response and put it into data (we convert it to json)
        // we wait because response returns a promise
        const data = await response.json();
        let question_bank = []; // Initialize the question_bank array
        question_bank = data.results.map((question) => new Question(question.question, question.incorrect_answers, question.correct_answer)); // Assign the new Question objects to the question_bank array
        console.log(question_bank); 

        return question_bank; 


    } catch (error) {
        console.error(error);
    }
}

// function to display question and options
function displayQuestion(question) {
    console.log(question);
    let correctAnswer = question.correctAnswer;
    let incorrectAnswers = question.incorrectAnswers;
    let choices = incorrectAnswers;
    console.log(choices);
    // randomly shuffle the choices (correct answer is included in the choices array)
    choices.splice(Math.floor(Math.random() * (incorrectAnswers.length + 1)), 0, correctAnswer);
    console.log(choices);

    // display question
    let _question = document.getElementById("question").innerHTML = question.text;

    // display options
    let option1 = document.getElementById("btn1").textContent = choices[0];
    let option2 = document.getElementById("btn2").textContent = choices[1];
    let option3 = document.getElementById("btn3").textContent = choices[2];
    let option4 = document.getElementById("btn4").textContent = choices[3];
}

// Initialize user
let user = new User;

//first option
// Initialize a quiz asynchrounosly so that we can fetch the questions from the API first
// Then we can create a new quiz object and start the quiz
// can delete later if not needed
// Quiz.create("USERNAME").then(quiz => {
//     quiz.quizStart();
// });

// document.addEventListener("DOMContentLoaded", function() {
//     // Wait for the DOM content to be fully loaded before instantiating the document variables
//     nextQuestionButton = document.getElementById("next-question");
//     questionNumberField = document.getElementById("questionNumField");
    
//     // Upon webpage startup
//     // Update question number field upon page startup
//     console.log("quiz.getQuestionNumber()");
//     questionNumberField.textContent = Quiz.getQuestionNumber();
    
//     // Event listeners
//     nextQuestionButton.addEventListener("click", function() {
//         // get next question
//         Quiz.nextQuestion();
        
//         // update question number
//         questionNumberField.textContent = Quiz.getQuestionNumber();
//     });
// });

// second option
async function main() {
    let quiz = new Quiz(await fetchData(), "USERNAME")
    quiz.quizStart();

    // Declaring the html document variables
    let nextQuestionButton, questionNumberField;

    document.addEventListener("DOMContentLoaded", function() {
        // Wait for the DOM content to be fully loaded before instantiating the document variables
        nextQuestionButton = document.getElementById("next-question");
        questionNumberField = document.getElementById("questionNumField");
        
        // Upon webpage startup
        // Update question number field upon page startup
        console.log("quiz.getQuestionNumber()");
        questionNumberField.textContent = quiz.getQuestionNumber();
        
        // Event listeners
        nextQuestionButton.addEventListener("click", function() {
            // get next question
            quiz.nextQuestion();
            
            // update question number
            questionNumberField.textContent = quiz.getQuestionNumber();
        });
    });
}

main();






