async function getQuestion() {
    const response = await fetch("https://opentdb.com/api.php?amount=25&category=15&type=multiple");
    const questions = await response.json();
    console.log(questions);
}getQuestion();

