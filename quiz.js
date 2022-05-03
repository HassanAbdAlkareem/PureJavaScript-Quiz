// select varibles

let countspan = document.querySelector(".quiz-app .count span");
let bulletcontainer = document.querySelector(".bullets .spans");
let quizarea = document.querySelector(".quiz-area");
let answerarea = document.querySelector(".answer-area");
let submitbutton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let mainresult = document.querySelector(".result");
let maincountdown = document.querySelector(".countdown");

// set option
let currentindex = 0;
let rightanswercount = 0;
let countdowninterval;

function getqusetion() {
  let myrequest = new XMLHttpRequest();

  myrequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionobject = JSON.parse(this.responseText);
      let qusetioncount = questionobject.length;

      // function Add question data
      addquestiondata(questionobject[currentindex], qusetioncount);

      // function create bullte + set question count
      createbullet(qusetioncount);

      // function start count down
      countdown(45, qusetioncount);

      // Function Click Submit
      submitbutton.onclick = function () {
        // Get Right Answer
        let rightanswer = questionobject[currentindex].right_answer;

        // after click to question fetch next question
        currentindex++;

        // Check if This Answer right
        checkanswer(rightanswer, qusetioncount);

        // Remove old Question
        quizarea.innerHTML = "";
        answerarea.innerHTML = "";

        // function Add question data
        addquestiondata(questionobject[currentindex], qusetioncount);

        // function handel class active on spans
        handelclasson();

        // function start count down
        clearInterval(countdowninterval);
        countdown(45, qusetioncount);

        // Function Show result
        showresult(qusetioncount);
      };
    }
  };

  myrequest.open("GET", "quiz.json", true);
  myrequest.send();
}

getqusetion();

function createbullet(numberqusetion) {
  countspan.innerHTML = numberqusetion;

  // create spans
  for (let i = 0; i < numberqusetion; i++) {
    //create spans
    let mybullet = document.createElement("span");

    if (i == 0) {
      mybullet.className = "on";
    }

    // Append mybullet to bulletcontainer
    bulletcontainer.appendChild(mybullet);
  }
}

function addquestiondata(obj, count) {
  if (currentindex < count) {
    // create h2 qusetion title
    let questiontitle = document.createElement("h2");
    let qustiontitletext = document.createTextNode(obj["title"]);

    // Append text to haeding h2
    questiontitle.appendChild(qustiontitletext);

    quizarea.appendChild(questiontitle);

    // Create The Answers
    for (let i = 1; i <= 4; i++) {
      let maindiv = document.createElement("div");
      maindiv.className = "answer";

      // Create Raido input
      let inputradio = document.createElement("input");
      inputradio.name = "question";
      inputradio.type = "radio";
      inputradio.id = "answer_" + i;
      inputradio.dataset.answer = obj["answer_" + i];

      // add checked for one radio
      if (i === 1) {
        inputradio.checked = true;
      }

      // Create label
      let label = document.createElement("label");
      label.htmlFor = "answer_" + i;
      let labeltext = document.createTextNode(obj["answer_" + i]);
      label.appendChild(labeltext);

      // Add input + label To Main div
      maindiv.appendChild(inputradio);
      maindiv.appendChild(label);

      // Append main div to answer area
      answerarea.appendChild(maindiv);
    }
  }
}

function checkanswer(ranswer, count) {
  let answers = document.getElementsByName("question");
  let choosenanswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      choosenanswer = answers[i].dataset.answer;
    }
  }

  if (choosenanswer === ranswer) {
    rightanswercount++;
  }
}

function handelclasson() {
  let bulletspans = document.querySelectorAll(".bullets .spans span");
  let arrayofspans = Array.from(bulletspans);

  arrayofspans.forEach((span, index) => {
    if (currentindex === index) {
      span.classList.toggle("on");
    }
  });
}

function showresult(count) {
  let result;

  if (currentindex === count) {
    quizarea.remove();
    answerarea.remove();
    submitbutton.remove();
    bullets.remove();

    if (rightanswercount > count / 2 && rightanswercount < count) {
      result =
        "<span class='good'> Good </span>:" +
        rightanswercount +
        " from " +
        count +
        " is good answers .";
    } else if (rightanswercount == count) {
      result =
        "<span class='perfect'> perfect </span>:" +
        rightanswercount +
        " from " +
        count +
        " is perfect answers .";
    } else {
      result =
        "<span class='bad'> Bad </span>:" +
        rightanswercount +
        " from " +
        count +
        " is bad answers .";
    }

    mainresult.innerHTML = result;
    mainresult.style.padding = "10px";
    mainresult.style.backgroundColor = "white";
    mainresult.style.marginTop = "10px";
  }
}

function countdown(duration, count) {
  if (currentindex < count) {
    let minutes, seconds;
    countdowninterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      maincountdown.innerHTML = minutes + ":" + seconds;

      if (--duration < 0) {
        clearInterval(countdowninterval);
        submitbutton.click();
      }
    }, 1000);
  }
}
