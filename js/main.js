function init()
{
  var myPrivateScope = new MyPrivateScope();
  myPrivateScope.generateQuestions();
}

var MyPrivateScope = function(){
var counter = 0;
var totalQuestions = 0;
var answersArray=[];
//Create public function to be access from outside
this.generateQuestions = function (){init();}

function init()
{
//defaultQuestions is JSON Object defined at bottom and initialized with some sample questions
  totalQuestions = defaultQuestions.length;
  addEventListeners();
  generateNextQuestions();
}

//Add Eventlisteners for all buttons 
function addEventListeners()
{
  previousButton.addEventListener("click",previousButtonClick_handler);
  nextButton.addEventListener("click",nextButtonClick_handler);
  submitButton.addEventListener("click",submitButtonClick_handler);
  firstAnswer.addEventListener("input", setNavigationButtonsVisibility);
  secondAnswer.addEventListener("input", setNavigationButtonsVisibility);
  //Disable all form initially
  disableForm();
}

//Disable all buttons and hide both question fields
function disableForm()
{
	diableAllButtons();
	FirstQuestion.innerText = "";
    firstAnswer.style.visibility = "hidden";
	SecondQuestion.innerText = "";
    secondAnswer.style.visibility = "hidden";  
}

function diableAllButtons()
{
	nextButton.disabled = true;
	previousButton.disabled = true;
	submitButton.disabled = true;
}

/*This function is responsible for enabling next or submit button.
*Next button will ne enabled when both questions are answered and there are more questions.
*Submit button will be enabled when all questions are answered and we are at last question.
*/
function setNavigationButtonsVisibility()
{
  diableAllButtons();
  //Enable submit or next button only when input is not hidden and it has some input value
  if((firstAnswer.style.visibility == "hidden" || firstAnswer.value != "") && (secondAnswer.style.visibility == "hidden" || secondAnswer.value != ""))
  {
    //Enable Submit button on last questions.
	if(counter >= totalQuestions-2)
    {
      submitButton.disabled = false;
    }
	else
	{
		nextButton.disabled = false;
	}
  }
	//Disable previous button for first questions
	if(counter > 1 )
    {
      previousButton.disabled = false;
    }
}

function updateProgressBar()
{
  var currentPercentage = Math.floor((counter/totalQuestions)*100);
  progressBar.style.width = currentPercentage + '%';
  progressBar.innerText = currentPercentage +'%';
}

function nextButtonClick_handler()
{
//Store current answers before moving to next questions
    saveCurrentAnswers();
    if(counter < totalQuestions)
     {
        counter += 2;
        generateNextQuestions();
		//Fill answers. If questions have been answered already.
		//It's useful when previous button has been used
       if(answersArray[counter] && answersArray[counter].answer)
       {
			firstAnswer.value = answersArray[counter].answer;
       }
       if(answersArray[counter+1] && answersArray[counter+1].answer)
       {
			secondAnswer.value = answersArray[counter+1].answer;
       }
      }
	//Set All navigation buttons visibilities
    setNavigationButtonsVisibility();
	updateProgressBar();
}

function previousButtonClick_handler()
{
  saveCurrentAnswers();
  if(counter > 1)
     {
      counter -= 2;
      generateNextQuestions();
     }
     firstAnswer.value = answersArray[counter].answer;
     secondAnswer.value = answersArray[counter+1].answer;
     setNavigationButtonsVisibility();
	 updateProgressBar();
}

function submitButtonClick_handler()
{
  counter = totalQuestions;
  updateProgressBar();
  title.innerText = "Thanks! Your info is being sent to our server now";
  disableForm();
  var params = generateQueryString();
  //Some Dummy URL to send data over
  var URL="sampleURL";
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      title.innerText = "Data Saved. Server Response = "+xhttp.responseText;
    }
  };
  /**************************************************************************/
  //Following Two lines will work only with a valid service hosted on a server
  xhttp.open("POST", URL, true);
  xhttp.send(params);
}

//Create parameters from saved answers to send to server
function generateQueryString()
{
	var queryString = "";
	for(var i=0;i<answersArray.length;i++)
	{
		queryString += answersArray[i].questionId+"="+answersArray[i].answer+"&";
	}
	return queryString;
}

//This function will store all answers and corresponding questionId locally.
//Answers will be used while submitting
function saveCurrentAnswers()
{
  if(defaultQuestions[counter])
  {
	answersArray[counter] = {questionId:defaultQuestions[counter].questionId,answer:firstAnswer.value};
  }
  if(defaultQuestions[counter+1])
  {
	answersArray[counter+1] = {questionId:defaultQuestions[counter+1].questionId,answer:secondAnswer.value};
  }
}

//This function display next question from the actual JSON object.
//It will hide question and input if there is no data for current counter or next counter.
function generateNextQuestions()
{
  if(defaultQuestions[counter])
    {
		FirstQuestion.innerText = (counter+1) +". "+ defaultQuestions[counter].QuestionText; 
		firstAnswer.style.visibility = "visible";
    }
  else
    {
      FirstQuestion.innerText = "";
      firstAnswer.style.visibility = "hidden";
    }
  if(defaultQuestions[counter+1])
    {
		SecondQuestion.innerText = (counter+2) +". "+ defaultQuestions[counter+1].QuestionText;
		secondAnswer.style.visibility = "visible";
    }
  else
    {
      SecondQuestion.innerText = "";
      secondAnswer.style.visibility = "hidden";
    }
    firstAnswer.value = "";  
    secondAnswer.value = "";
  
 }

//This function is util function for converting input type at runtime(TODO)
function changeInputType(id,inputType)
{
  $(id).prop('type', inputType);
}
//default JSON object containing dummy data
var defaultQuestions= [{
        "questionId": "Q101",
        "QuestionText": "What's your full name:",
    },
    {
        "questionId": "Q102",
        "QuestionText": "What's Your Date Of Birth:",
    },
    {
        "questionId": "Q103",
        "QuestionText": "What's your Gender:",
    },
     {
        "questionId": "Q104",
        "QuestionText": "What's your Education:",
    },
    {
        "questionId": "Q105",
        "QuestionText": "What's Your Address:",
    },
    {
        "questionId": "Q106",
        "QuestionText": "What's Your City:",
    },
                       {
        "questionId": "Q107",
        "QuestionText": "What's your email:",
    },
    {
        "questionId": "Q108",
        "QuestionText": "What's your phone:",
    },
                       {
        "questionId": "Q109",
        "QuestionText": "What's your Mobile:",
    },
];

};
