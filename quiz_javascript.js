class Quiz {
    constructor(){
        this.score = 0;
        this.questionCounter = 1;
        this.prev_question_difficulty = "easy"; // easy initially after fetching,
                                            // then will be updated on checkAnswer function using the logic
        this.easy_index = 0;
        this.medium_index = 0;
        this.hard_index = 0;
        
        this.answered = 0;
    };

    quizStart() {


    };


    nextQuestion(){
        // stop game after 10'th question
        if(quiz.questionCounter >= 10){
            document.getElementById("question").innerHTML = "Quiz Finished!"
        }else{
            this.questionCounter++;
            updateQuestionField(this.prev_question_difficulty);
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
        let inputUsernameField=document.getElementById("input-username");
        if(inputUsernameField.value.length>2) {
            let usernameSubmitB = document.getElementById("submit-username");
            let usernameLabel = document.getElementById("enter-username-label");
            let displayUsername=document.getElementById("username");

            usernameSubmitB.style.display="none";
            inputUsernameField.style.display="none";
            usernameLabel.style.display="none";
            displayUsername.style.display="block";

            displayUsername.innerHTML=inputUsernameField.value;
        }
    }

    
    setAnswered(){
        this.answered = 1;
    }
    
    resetAnswered(){
        this.answered = 0;
    }
    
    getAnsweredStatus(){
        return this.answered;
    }
}

class Question{
    constructor(text, choices, answer, difficulty, category) {
        this.text = text;
        this.choices = choices;
        this.answer = answer;
        this.difficulty = difficulty;
        this.category = category;
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

let question_bank_easy = [];
let question_bank_medium = [];
let question_bank_hard = [];

async function fetchData(){

    try {

        // fetch will return a response object and we need to await the promise from fetch
        // here we grab all our questions
        const response_any = await fetch("https://opentdb.com/api.php?amount=50&type=multiple");

        // once the promise from fetch resolves we need to see if it is okay
        // if we cant locate resource
        if(!response_any.ok){
            throw new Error("Could not fetch resource");
        }

        // we take our response and put it into data (we convert it to json)
        // we wait because response returns a promise
        const data_any = await response_any.json();

        for (let i = 0; i<data_any.results.length; i++) {
            let questionData = data_any.results[i];
            let question = new Question(questionData.question, questionData.incorrect_answers, 
                                        questionData.correct_answer, questionData.difficulty,
                                        questionData.category);
            if(questionData.difficulty === "easy"){
                question_bank_easy.push(question);
            }else if(questionData.difficulty === "medium"){ 
                question_bank_medium.push(question);
            } else {
                question_bank_hard.push(question);
            }
        }

        // update the question field to display the first EASY question
        updateQuestionField(quiz.prev_question_difficulty);
    } catch (error) {
        console.error(error);
    }
} fetchData();

let correctAnswer = ""; // to store the correct answer

function updateQuestionField(difficulty) {

    let question;

    // get the current question from the question bank
    if(difficulty === "easy"){
        question = question_bank_easy[quiz.easy_index];
        quiz.easy_index++;
    } else if(difficulty === "medium"){
        question = question_bank_medium[quiz.medium_index];
        quiz.medium_index++;
    } else {
        question = question_bank_hard[quiz.hard_index];
        quiz.hard_index++;
    }
    
    // display the question based on the question number
    document.getElementById("question").innerHTML = `<span class = "category"> ${question.category} </span> <br> ${question.text} 
                                                        <br> <span class = "difficulty"> ${question.difficulty} </span>`;
    
    // correct answer
    correctAnswer = question.answer;
    // incorrect answers
    let choices = question.choices;
    // randomly shuffle the choices (correct answer is included in the choices array)
    choices.splice(Math.floor(Math.random() * (choices.length + 1)), 0, correctAnswer);

    // display buttons
    A_Button.innerHTML = `A) ${choices[0]}`;
    B_Button.innerHTML = `B) ${choices[1]}`;
    C_Button.innerHTML = `C) ${choices[2]}`;
    D_Button.innerHTML = `D) ${choices[3]}`;

    console.log("");
    console.log(`Question: ${question.text}`);
    console.log(`Button A: ${A_Button.innerHTML}`);
    console.log(`Button B: ${B_Button.innerHTML}`);
    console.log(`Button C: ${C_Button.innerHTML}`);
    console.log(`Button D: ${D_Button.innerHTML}`);
    console.log(`Correct Answer: ${convertedAnswerText(correctAnswer)}`);
}

// Function to check if the user's selected answer is correct
function checkAnswer(selectedAnswer, correctAnswer) {
    // Check if the selected answer is correct
    if (selectedAnswer === correctAnswer) {
        // increase the difficulty of the next question
        if (quiz.prev_question_difficulty === "easy") {
            quiz.prev_question_difficulty = "medium";
        } else if (quiz.prev_question_difficulty === "medium") {
            quiz.prev_question_difficulty = "hard";
        } // if "hard", then it will remain "hard" for the next question
        // Return 1 if the answer is correct
        return 1;
    } else {
        // decrease the difficulty of the next question
        if (quiz.prev_question_difficulty === "hard") {
            quiz.prev_question_difficulty = "medium";
        } else if (quiz.prev_question_difficulty === "medium") {
            quiz.prev_question_difficulty = "easy";
        } // if "easy", then it will remain "easy" for the next question
        // Return 0 if the answer is incorrect
        return 0;
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
let submitUsernameButton, nextQuestionButton, questionNumberField, scoreField, A_Button, B_Button, C_Button, D_Button;


document.addEventListener("DOMContentLoaded", function() {
    // Wait for the DOM content to be fully loaded before instantiating the document components
    submitUsernameButton=document.getElementById("submit-username")
    nextQuestionButton = document.getElementById("next-question");
    questionNumberField = document.getElementById("questionNumField");
    scoreField = document.getElementById("ScoreCounter");
    A_Button = document.getElementById("btn1");
    B_Button = document.getElementById("btn2");
    C_Button = document.getElementById("btn3");
    D_Button = document.getElementById("btn4");


    // Upon webpage startup

    // Update question number field upon page startup
    questionNumberField.textContent = quiz.getQuestionNumber();
    // update the score field upon page start up
    scoreField.textContent = quiz.getScore();
   
 
    
    // Event listeners
    submitUsernameButton.addEventListener("click", function() {
        quiz.setUsername();
    });
    
    // Event listener for Answer A button
    A_Button.addEventListener("click", function() {
        // only work if not answered yet
        if(quiz.getAnsweredStatus() === 0) {
            // set answered status so button can't be used again
            quiz.setAnswered();
            
            // check if the A button currently holds the correct answer
            let result = checkAnswer(A_Button.innerHTML, `A) ${convertedAnswerText(correctAnswer)}`);
            // change button color to red if it is the wrong answer, green if right answer
            if (result === 1) {
                A_Button.classList.add('correct-answer');
                // Increase score if the selected answer is correct
                quiz.increaseScore();
            } else if (result === 0) {
                A_Button.classList.add('incorrect-answer');

                // make the button containing the correct answer green
                let resultB = checkAnswer(B_Button.innerHTML, `B) ${convertedAnswerText(correctAnswer)}`);
                let resultC = checkAnswer(C_Button.innerHTML, `C) ${convertedAnswerText(correctAnswer)}`);
                let resultD = checkAnswer(D_Button.innerHTML, `D) ${convertedAnswerText(correctAnswer)}`);

                if (resultB === 1) {
                    B_Button.classList.add('correct-answer');
                } else if (resultC === 1) {
                    C_Button.classList.add('correct-answer');
                } else if (resultD === 1) {
                    D_Button.classList.add('correct-answer');
                }
            }
        }
    });
    // Event listener for answer B button
    B_Button.addEventListener("click", function() {
        // only work if not answered yet
        if(quiz.getAnsweredStatus() === 0) {
            // set answered status so button can't be used again
            quiz.setAnswered();
            // check if the B button currently holds the correct answer
            let result = checkAnswer(B_Button.innerHTML, `B) ${convertedAnswerText(correctAnswer)}`);
            // change button color to red if it is the wrong answer, green if right answer
            if (result === 1) {
                B_Button.classList.add('correct-answer');
                // Increase score if the selected answer is correct
                quiz.increaseScore();
            } else if (result === 0) {
                B_Button.classList.add('incorrect-answer');

                // make the button containing the correct answer green
                let resultA = checkAnswer(A_Button.innerHTML, `A) ${convertedAnswerText(correctAnswer)}`);
                let resultC = checkAnswer(C_Button.innerHTML, `C) ${convertedAnswerText(correctAnswer)}`);
                let resultD = checkAnswer(D_Button.innerHTML, `D) ${convertedAnswerText(correctAnswer)}`);

                if (resultA === 1) {
                    A_Button.classList.add('correct-answer');
                } else if (resultC === 1) {
                    C_Button.classList.add('correct-answer');
                } else if (resultD === 1) {
                    D_Button.classList.add('correct-answer');
                }
            }
        }
    });
    // Event listener for answer C button
    C_Button.addEventListener("click", function() {
        // only work if not answered yet
        if(quiz.getAnsweredStatus() === 0) {
            // set answered status so button can't be used again
            quiz.setAnswered();
            // check if the C button currently holds the correct answer
            let result = checkAnswer(C_Button.innerHTML, `C) ${convertedAnswerText(correctAnswer)}`);
            // change button color to red if it is the wrong answer, green if right answer
            if (result === 1) {
                C_Button.classList.add('correct-answer');
                // Increase score if the selected answer is correct
                quiz.increaseScore();
            } else if (result === 0) {
                C_Button.classList.add('incorrect-answer');

                // make the button containing the correct answer green
                let resultA = checkAnswer(A_Button.innerHTML, `A) ${convertedAnswerText(correctAnswer)}`);
                let resultB = checkAnswer(B_Button.innerHTML, `B) ${convertedAnswerText(correctAnswer)}`);
                let resultD = checkAnswer(D_Button.innerHTML, `D) ${convertedAnswerText(correctAnswer)}`);

                if (resultA === 1) {
                    A_Button.classList.add('correct-answer');
                } else if (resultB === 1) {
                    C_Button.classList.add('correct-answer');
                } else if (resultD === 1) {
                    D_Button.classList.add('correct-answer');
                }
            }
        }
    });
    // Event listener for answer D button
    D_Button.addEventListener("click", function() {
        // only work if not answered yet
        if(quiz.getAnsweredStatus() === 0) {
            // set answered status so button can't be used again
            quiz.setAnswered();
            // check if the D button currently holds the correct answer
            let result = checkAnswer(D_Button.innerHTML, `D) ${convertedAnswerText(correctAnswer)}`);
            // change button color to red if it is the wrong answer, green if right answer
            if (result === 1) {
                D_Button.classList.add('correct-answer');
                // Increase score if the selected answer is correct
                quiz.increaseScore();
            } else if (result === 0) {
                D_Button.classList.add('incorrect-answer');

                // make the button containing the correct answer green
                let resultA = checkAnswer(A_Button.innerHTML, `A) ${convertedAnswerText(correctAnswer)}`);
                let resultC = checkAnswer(C_Button.innerHTML, `C) ${convertedAnswerText(correctAnswer)}`);
                let resultB = checkAnswer(B_Button.innerHTML, `B) ${convertedAnswerText(correctAnswer)}`);

                if (resultA === 1) {
                    A_Button.classList.add('correct-answer');
                } else if (resultC === 1) {
                    C_Button.classList.add('correct-answer');
                } else if (resultB === 1) {
                    D_Button.classList.add('correct-answer');
                }
            }
        }
    });
    
    // Next button even listener
    nextQuestionButton.addEventListener("click", function() {
        // user must enter an answer before next question can be loaded.
        if(quiz.getAnsweredStatus() === 1) {
            // reset answered status so button can be used again
            quiz.resetAnswered();
            // reset buttons back to default colors
            A_Button.classList.remove('correct-answer', 'incorrect-answer');
            B_Button.classList.remove('correct-answer', 'incorrect-answer');
            C_Button.classList.remove('correct-answer', 'incorrect-answer');
            D_Button.classList.remove('correct-answer', 'incorrect-answer');
            // get next question
            quiz.nextQuestion();
            // update question number
            questionNumberField.textContent = quiz.getQuestionNumber();
            // update the score
            scoreField.textContent = quiz.getScore();
        }
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

