let questions = [];
let wrongSet = new Set();
let correctSet = new Set();
let currentQuestionIndex = 0;
let score = 0;
let timer;
let startTime;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateUniqueQuestions(
  operation,
  numOneStart,
  numOneEnd,
  numTwoStart,
  numTwoEnd
) {
  let generatedQuestions = new Set();
  let questionSize;
  numOneRng = numOneEnd - numOneStart + 1;
  numTwoRng = numTwoEnd - numTwoStart + 1;
  switch (operation) {
    case "addition":
      questionSize = numOneRng * numTwoRng;
      break;
    case "subtraction":
      questionSize = numOneRng * numTwoRng;
      break;
    case "multiplication":
      questionSize = numOneRng * numTwoRng;
      break;
    case "division":
      questionSize = numOneRng * numTwoRng;
      break;
  }
  while (generatedQuestions.size < questionSize) {
    let num1, num2, questionText;

    switch (operation) {
      case "addition":
        num1 = getRandomInt(numOneStart, numOneEnd);
        num2 = getRandomInt(numTwoStart, numTwoEnd);
        questionText = `${num1} + ${num2}`;
        break;
      case "subtraction":
        num1 = getRandomInt(numOneStart, numOneEnd);
        num2 = getRandomInt(numTwoStart, numTwoEnd);
        questionText = `${num1} - ${num2}`;
        break;
      case "multiplication":
        num1 = getRandomInt(numOneStart, numOneEnd);
        num2 = getRandomInt(numTwoStart, numTwoEnd);
        questionText = `${num1} × ${num2}`;
        break;
      case "division":
        quotient = getRandomInt(numOneStart, numOneEnd);
        divisor = getRandomInt(numTwoStart, numTwoEnd);
        dividend = divisor * quotient;
        questionText = `${dividend} ÷ ${divisor}`;
        break;
      default:
        return [];
    }

    generatedQuestions.add(questionText);
  }

  if (operation == "addition" || operation == "multiplication") {
    let filteredQuestions = new Set();
    for (const question of generatedQuestions) {
      const [num1, operator, num2] = question.split(" ");
      questionTuple = [num1, num2].sort();  // Sort to handle commutativity
      questionText = `${questionTuple[0]} ${operator} ${questionTuple[1]}`;
      filteredQuestions.add(questionText);
    }

    return Array.from(filteredQuestions);
  }

  return Array.from(generatedQuestions);
}

function startPractice() {
  const operation = document.getElementById("operation").value;
  const numOneStart = document.getElementById("numOneStart").value;
  const numOneEnd = document.getElementById("numOneEnd").value;
  const numTwoStart = document.getElementById("numTwoStart").value;
  const numTwoEnd = document.getElementById("numTwoEnd").value;
  questions = generateUniqueQuestions(
    operation,
    Number(numOneStart),
    Number(numOneEnd),
    Number(numTwoStart),
    Number(numTwoEnd)
  );

  wrongSet = new Set();
  correctSet = new Set();
  document.getElementById("result").innerText = ``;
  document.getElementById(
    "questionCount"
  ).innerText = `Total Questions: ${questions.length}`;
  document.getElementById("wrongQuestions").innerText = ``;
  document.getElementById("correctQuestions").innerText = ``;
  currentQuestionIndex = 0;
  score = 0;
  document.getElementById("score").innerText = `Score: ${score}`;
  document.getElementById("timer").innerText = "Time: 0s";
  const isTimerEnabled = document.getElementById("timer-checkbox").checked;
  if (isTimerEnabled) {
    startTime = Date.now();
    if (timer) {
      clearInterval(timer);
    }
    timer = setInterval(updateTimer, 1000);
  }
  generateQuestion();
}

function generateQuestion() {
  if (currentQuestionIndex < questions.length) {
    document.getElementById("question-num").innerText = `Q${
      currentQuestionIndex + 1
    }.`;
    document.getElementById("question-text").innerText =
      questions[currentQuestionIndex];
    currentQuestionIndex++;
    document.getElementById("answer").value = "";
    document.getElementById("answer").focus();
  } else {
    endQuiz();
  }
}

function checkAnswer() {
  const questionText = document.getElementById("question-text").innerText;
  const userAnswer = parseFloat(document.getElementById("answer").value);
  let correctAnswer;

  if (!questionText) return;

  const [num1, operator, num2] = questionText.split(" ");

  switch (operator) {
    case "+":
      correctAnswer = parseInt(num1) + parseInt(num2);
      break;
    case "-":
      correctAnswer = parseInt(num1) - parseInt(num2);
      break;
    case "×":
      correctAnswer = parseInt(num1) * parseInt(num2);
      break;
    case "÷":
      correctAnswer = parseInt(num1) / parseInt(num2);
      break;
    default:
      return;
  }

  if (userAnswer === correctAnswer) {
    score++;
    correctSet.add(questionText);
  } else {
    wrongSet.add(questionText);
  }

  const resultText =
    userAnswer === correctAnswer
      ? "Correct!"
      : `Incorrect. The correct answer is ${correctAnswer}.`;

  document.getElementById("result").innerText = resultText;
  document.getElementById("score").innerText = `Score: ${score}`;
  generateQuestion();
}

function updateTimer() {
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById("timer").innerText = `Time: ${elapsedTime}s`;
}

function displayArrayElements(array, label) {
  const container = document.getElementById(label);
  if (label == "wrongQuestions") {
    container.innerHTML = "❌";
  } else {
    container.innerHTML = "✅";
  }

  // Iterate over the array and create HTML elements for each item
  array.forEach((element) => {
    // Create a list item element
    const listItem = document.createElement("li");
    // Set the text content to the array element
    listItem.textContent = element;
    // Append the list item to the container
    container.appendChild(listItem);
  });
}

function endQuiz() {
  if (timer) {
    clearInterval(timer);
    document.getElementById(
      "result"
    ).innerText = `Your final score is ${score} out of ${
      questions.length
    }. Total time: ${document.getElementById("timer").innerText}`;
    timer = 0;
  } else {
    document.getElementById(
      "result"
    ).innerText = `Your final score is ${score} out of ${questions.length}.`;
  }
  document.getElementById("question-num").innerText = ``;
  document.getElementById("score").innerText = ``;
  document.getElementById("questionCount").innerText = ``;
  document.getElementById("question-text").innerText = "Completed!";

  if (Array.from(wrongSet).length != 0) {
    displayArrayElements(Array.from(wrongSet), "wrongQuestions");
  }
  if (Array.from(correctSet).length != 0) {
    displayArrayElements(Array.from(correctSet), "correctQuestions");
  }
}

// Add an event listener to the input field to listen for the Enter key
document.getElementById("answer").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    checkAnswer();
  }
});

// Add an event listener to the operation select to perform an action when changed
document.getElementById("operation").addEventListener("change", function () {
  const selectedOperation = this.value;
  if (selectedOperation === "division") {
    document.getElementById("numOne").innerText =
      "Range for quotient (Dividend will be calulated automatically)";
    document.getElementById("numTwo").innerText = "Range for divisor";
  } else {
    document.getElementById("numOne").innerText = "Range for first number";
    document.getElementById("numTwo").innerText = "Range for second number";
  }
});
