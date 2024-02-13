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
        return this.score.toString() + " / 10";
    };

    increaseScore(){
        this.score++;
        // update the score field
        scoreField.textContent = this.getScore();
    }
    
    getQuestionNumber(){
        return "Question Number: " + this.questionCounter.toString() + " / 10";
    };


    setDifficulty(difficulty){
        this.difficulty = difficulty;
    }
    setUsername(){
        let usernameInput=document.getElementById("input-username")
        let displayUsername=document.getElementById("username");
        let usernameLabel= document.getElementById("enter-username-label");
        let usernameSubmitB= document.getElementById("submit-username");
        if(usernameInput.value.length>4) {
            displayUsername.innerHTML = usernameInput.value;
            displayUsername.style.visibility = "visible";
            usernameInput.style.display = "none";
            usernameLabel.style.display = "none"
            usernameSubmitB.style.display = "none";
        }
    }
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

    // display buttons
    A_button.innerHTML = `A) ${choices[0]}`;
    B_button.innerHTML = `B) ${choices[1]}`;
    C_Button.innerHTML = `C) ${choices[2]}`;
    D_Button.innerHTML = `D) ${choices[3]}`;
}

// Function to check if the user's selected answer is correct
function checkAnswer(selectedAnswer, correctAnswer) {
    if (selectedAnswer === correctAnswer) {
        // Increase score if the selected answer is correct
        quiz.increaseScore();
    }
}

// Function to extract answer text from HTML string, incase some answers have those weird html tags
function convertedAnswerText(answerHTML) {
    // Create a temporary element to hold the HTML string
    let tempElement = document.createElement("div");
    // user inner html to remove weird symbols
    tempElement.innerHTML = answerHTML;
    // Return the text content of the temporary element, there is an or here incase some browsers can't get text content
    return tempElement.textContent || tempElement.innerText;
}




// Initialize user
let user = new User;
// Initialize a quiz
let quiz = new Quiz;


// Declaring the html document variables
let usernameSubmitButton, nextQuestionButton, questionNumberField, scoreField, A_button, B_button, C_Button, D_Button;


document.addEventListener("DOMContentLoaded", function() {
    // Wait for the DOM content to be fully loaded before instantiating the document components
    usernameSubmitButton = document.getElementById("submit-username");
    nextQuestionButton = document.getElementById("next-question");
    questionNumberField = document.getElementById("questionNumField");
    scoreField = document.getElementById("ScoreCounter");
    A_button = document.getElementById("btn1");
    B_button = document.getElementById("btn2");
    C_Button = document.getElementById("btn3");
    D_Button = document.getElementById("btn4");


    // Upon webpage startup

    // Update question number field upon page startup
    questionNumberField.textContent = quiz.getQuestionNumber();
    // update the score field upon page start up
    scoreField.textContent = quiz.getScore();
   
 
    
    // Event listeners
    usernameSubmitButton.addEventListener("click", function() {
        quiz.setUsername();
    });

    // Event listener for answer A button
    A_button.addEventListener("click", function() {
        // check if the A button currently holds the correct answer
        checkAnswer(A_button.innerHTML, `A) ${convertedAnswerText(question_bank[quiz.questionCounter - 1].answer)}`);
    });
    // Event listener for answer B button
    B_button.addEventListener("click", function() {
        // check if the B button currently holds the correct answer
        checkAnswer(B_button.innerHTML, `B) ${convertedAnswerText(question_bank[quiz.questionCounter - 1].answer)}`);
    });
    // Event listener for answer C button
    C_Button.addEventListener("click", function() {
        // check if the C button currently holds the correct answer
        checkAnswer(C_Button.innerHTML, `C) ${convertedAnswerText(question_bank[quiz.questionCounter - 1].answer)}`);
    });
    // Event listener for answer D button
    D_Button.addEventListener("click", function() {
        // check if the D button currently holds the correct answer
        checkAnswer(D_Button.innerHTML, `D) ${convertedAnswerText(question_bank[quiz.questionCounter - 1].answer)}`);
    });
    
    // Next button even listener
    nextQuestionButton.addEventListener("click", function() {
        // get next question
        quiz.nextQuestion();
        
        // update question number
        questionNumberField.textContent = quiz.getQuestionNumber();
        // update the score
        scoreField.textContent = quiz.getScore();
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