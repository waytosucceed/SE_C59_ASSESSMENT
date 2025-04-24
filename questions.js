var questions = [];
var count = 0;
var score = 0;
var Ansgiven = []; // Store answers given by the user
var topicName = ''; // Variable to store the topic name
const submitSound = document.getElementById("submit-sound");
let timeLeft = 45 * 60; // 45 minutes in seconds
let timerId = null;

const uniqueKey = "THINIKING SKILL MOCK TEST 1";

// Helper functions for localStorage
function saveToLocalStorage(key, value) {
  let storageData = JSON.parse(localStorage.getItem(uniqueKey)) || {};
  storageData[key] = value;
  localStorage.setItem(uniqueKey, JSON.stringify(storageData));
}

function getFromLocalStorage(key) {
  let storageData = JSON.parse(localStorage.getItem(uniqueKey)) || {};
  return storageData[key];
}

// function startTimer() {
//   const timerDiv = document.createElement('div');
//   timerDiv.id = 'timer';
//   timerDiv.style.position = 'fixed';
//   timerDiv.style.top = '20px';
//   timerDiv.style.right = '20px';
//   timerDiv.style.padding = '10px 20px';
//   timerDiv.style.backgroundColor = '#fff';
//   timerDiv.style.border = '2px solid #D6B65B';
//   timerDiv.style.borderRadius = '5px';
//   timerDiv.style.fontSize = '20px';
//   timerDiv.style.fontWeight = 'bold';
//   timerDiv.style.zIndex = '1000';
//   document.body.appendChild(timerDiv);

//   timerId = setInterval(() => {
//     timeLeft--;
//     const minutes = Math.floor(timeLeft / 60);
//     const seconds = timeLeft % 60;
    
//     // Update timer display
//     timerDiv.textContent = `Time Left: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    
//     // Warning when 5 minutes are left
//     if (timeLeft === 300) { // 5 minutes
//       timerDiv.style.backgroundColor = '#ffecb3';
//       timerDiv.style.color = '#d32f2f';
//       const warningSound = new Audio('./assests/sounds/submit.mp3');
//       warningSound.play();
//       showWarningModal();
//     }
    
//     // Time's up
//     if (timeLeft <= 0) {
//       clearInterval(timerId);
//       // submitAllAnswers();
//     }
//   }, 1000);
// }

// function showWarningModal() {
//   const modalHtml = `
//     <div class="modal fade" id="warningModal" tabindex="-1" role="dialog">
//       <div class="modal-dialog" role="document">
//         <div class="modal-content">
//           <div class="modal-header">
//             <button type="button" class="close" data-dismiss="modal">&times;</button>
//             <h4 class="modal-title">⚠️ Time Warning</h4>
//           </div>
//           <div class="modal-body">
//             <p>Only 5 minutes remaining!</p>
//           </div>
//           <div class="modal-footer">
//             <button type="button" class="btn btn-primary" data-dismiss="modal">Continue</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   `;
  
//   const modalContainer = document.createElement('div');
//   modalContainer.innerHTML = modalHtml;
//   document.body.appendChild(modalContainer);
  
//   $('#warningModal').modal('show');
  
//   $('#warningModal').on('hidden.bs.modal', function () {
//     $(this).remove();
//   });
// }

function startTimer() {
  

  const timerDiv = document.createElement('div');
  timerDiv.id = 'timer';
  timerDiv.style.position = 'fixed';
  timerDiv.style.top = '20px';
  timerDiv.style.right = '20px';
  timerDiv.style.padding = '10px 20px';
  timerDiv.style.backgroundColor = '#fff';
  timerDiv.style.border = '2px solid #D6B65B';
  timerDiv.style.borderRadius = '5px';
  timerDiv.style.fontSize = '20px';
  timerDiv.style.fontWeight = 'bold';
  timerDiv.style.zIndex = '1000';
  document.body.appendChild(timerDiv);

  const timerId = setInterval(() => {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    // Update timer display
    timerDiv.textContent = `Time Left: ${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Warning when 5 minutes are left
    if (timeLeft === 300) { // 5 minutes
      timerDiv.style.backgroundColor = '#ffecb3';
      timerDiv.style.color = '#d32f2f';
      const warningSound = new Audio('./assets/sounds/submit.mp3');
      warningSound.play();
      showWarningModal();
    }

    // Time's up
    if (timeLeft <= 0) {
      clearInterval(timerId);
      timerDiv.textContent = "⏳ Time Over!";
      timerDiv.style.backgroundColor = '#ffcccc';
      timerDiv.style.color = '#d32f2f';
      showWarningModal(true);
    }
  }, 1000);
}

function showWarningModal(isTimeOver = false) {
  const modalHtml = `
    <div class="modal fade" id="warningModal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">${isTimeOver ? "⏳ Time Over!" : "⚠️ Time Warning"}</h4>
          </div>
          <div class="modal-body">
            <p>${isTimeOver ? "Time is up! Your session has ended." : "Only 5 minutes remaining!"}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal">OK</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = modalHtml;
  document.body.appendChild(modalContainer);

  $('#warningModal').modal('show');

  $('#warningModal').on('hidden.bs.modal', function () {
    $(this).remove();
  });
}


// Fetch the questions from the JSON file
fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    const urlParams = new URLSearchParams(window.location.search);
    topicName = urlParams.get('topic');
    const selectedTopic = data.topics.find(t => t.heading === topicName);

    if (selectedTopic) {
      questions = selectedTopic.questions;
      count = questions.length;
      
      saveToLocalStorage(topicName + '_totalQuestions', count);
      document.getElementById('heading').innerText = topicName || 'PS';
      
      // Load all questions at once
      loadAllQuestions();
      
      // Start the timer
      startTimer();

      // Store topics in local storage
      const topics = JSON.parse(localStorage.getItem('topics')) || [];
      if (!topics.find(t => t.heading === topicName)) {
        topics.push(selectedTopic);
        saveToLocalStorage('topics', topics);
      }
    } else {
      document.getElementById('heading').innerText = 'Topic not found';
      document.getElementById('questiondiv').innerHTML = 'No questions available for this topic.';
    }
  });

  function loadAllQuestions() {
    const questionDiv = document.getElementById('questiondiv');
    questionDiv.innerHTML = '';
    
    const allQuestionsContainer = document.createElement('div');
    allQuestionsContainer.className = 'all-questions-container';
  
    questions.forEach((question, index) => {
      const singleQuestionContainer = document.createElement('div');
      singleQuestionContainer.className = 'question-container';
      singleQuestionContainer.style.marginBottom = '30px';
      singleQuestionContainer.style.padding = '20px';
      singleQuestionContainer.style.border = '1px solid #ddd';
      singleQuestionContainer.style.borderRadius = '8px';
      singleQuestionContainer.style.fontSize = '2.4rem';
  
      // Question number and text
      const questionText = document.createElement('div');
      questionText.className = 'question-text';
      questionText.innerHTML = `<strong>Question ${index + 1}:</strong> ${question.question}`;
      singleQuestionContainer.appendChild(questionText);
  
      // Check if question has input fields
     // Inside the loadAllQuestions function, modify the input field handling section:

     if (question.input) {
      const inputContainer = document.createElement('div');
      inputContainer.className = 'input-container';
      inputContainer.style.marginTop = '20px';
      inputContainer.style.display = 'flex';
      inputContainer.style.gap = '10px';
      inputContainer.style.alignItems = 'center';
    
      // Initialize answers array with fixed operands
      const answers = Ansgiven[index] || [];
      question.input.forEach((field, idx) => {
        if (field.operand !== "") {
          // Pre-fill fixed operands in the answers array
          answers[idx] = field.operand;
        }
      });
      Ansgiven[index] = answers;
      saveAnswer(index, answers);
    
      question.input.forEach((field, fieldIndex) => {
        if (field.operand !== "") {
          // For fixed operands, create a disabled input
          const fixedInput = document.createElement('input');
          fixedInput.type = 'text';
          fixedInput.className = 'numeric-input';
          fixedInput.value = field.operand;
          fixedInput.disabled = true;
          fixedInput.style.width = '100px';
          fixedInput.style.height = '50px';
          fixedInput.style.fontSize = '24px';
          fixedInput.style.textAlign = 'center';
          fixedInput.style.border = '2px solid #D6B65B';
          fixedInput.style.borderRadius = '4px';
          fixedInput.style.backgroundColor = '#f5f5f5';
          inputContainer.appendChild(fixedInput);
        } else {
          // For empty operands, create an editable input
          const inputField = document.createElement('input');
          inputField.type = 'text';
          inputField.className = 'numeric-input';
          inputField.style.width = '200px';
          inputField.style.height = '50px';
          inputField.style.fontSize = '24px';
          inputField.style.textAlign = 'center';
          inputField.style.border = '2px solid #D6B65B';
          inputField.style.borderRadius = '4px';
          
          // Save answer when input changes
          inputField.oninput = (e) => {
            const currentAnswers = Ansgiven[index] || [];
            currentAnswers[fieldIndex] = e.target.value;
            saveAnswer(index, currentAnswers);
          };
          
          inputContainer.appendChild(inputField);
        }
      });
    
      singleQuestionContainer.appendChild(inputContainer);
    }
      
      else {
        // Regular radio button options
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-container';
        const hasImageOptions = question.options.some(opt => opt.image);
        
        if (hasImageOptions) {
          optionsContainer.style.display = 'grid';
          optionsContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
          optionsContainer.style.gap = '1rem';
        } else {
          optionsContainer.style.display = 'flex';
          optionsContainer.style.flexDirection = 'column';
          optionsContainer.style.gap = '10px';
        }
  
        question.options.forEach((option, optIndex) => {
          const optionWrapper = createOptionElement(option, index, optIndex);
          optionsContainer.appendChild(optionWrapper);
        });
  
        singleQuestionContainer.appendChild(optionsContainer);
      }
  
      allQuestionsContainer.appendChild(singleQuestionContainer);
    });
  
    questionDiv.appendChild(allQuestionsContainer);
  
    // Add submit button
    const submitButton = document.createElement('button');
    submitButton.className = 'btn btn-success';
    submitButton.style.marginTop = '20px';
    submitButton.style.marginBottom = '20px';
    submitButton.textContent = 'Finish';
    submitButton.onclick = submitAllAnswers;
    questionDiv.appendChild(submitButton);
  }
  
  // Helper function to create option elements
  function createOptionElement(option, questionIndex, optionIndex) {
    const optionWrapper = document.createElement('div');
    optionWrapper.className = 'option-wrapper';
    optionWrapper.style.position = 'relative';
    optionWrapper.style.display = 'flex';
    optionWrapper.style.alignItems = 'center';
    optionWrapper.style.gap = '10px';
    optionWrapper.style.cursor = 'pointer';
    
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = `question${questionIndex}`;
    radio.value = optionIndex;
    radio.style.marginRight = '10px';
    
    if (option.image) {
      const img = document.createElement('img');
      img.src = option.image;
      img.alt = 'Option Image';
      img.style.height = '150px';
      img.style.borderRadius = '12px';
      img.style.cursor = 'pointer';
      
      if (option.sound) {
        img.onmouseover = () => playOptionSound(option.sound);
      }
      
      optionWrapper.appendChild(radio);
      optionWrapper.appendChild(img);
    } else {
      const textSpan = document.createElement('span');
      textSpan.textContent = option.text;
      textSpan.style.flex = '1';
      
      optionWrapper.appendChild(radio);
      optionWrapper.appendChild(textSpan);
    }
  
    optionWrapper.addEventListener('click', () => {
      radio.checked = true;
      saveAnswer(questionIndex, optionIndex);
    });
  
    return optionWrapper;
  }

function saveAnswer(questionIndex, optionIndex) {
  Ansgiven[questionIndex] = optionIndex;
  saveToLocalStorage('Ansgiven', Ansgiven);
}

function submitAllAnswers() {
  try {
    // Clear timer
    if (timerId) {
      clearInterval(timerId);
      const timerDiv = document.getElementById('timer');
      if (timerDiv) {
        timerDiv.remove();
      }
    }

    // Validate required data exists
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      throw new Error('No questions available');
    }

    if (!Ansgiven) {
      Ansgiven = []; // Initialize if undefined
    }

    // Play submit sound with error handling
    const sound1 = new Audio('./assests/sounds/submit.mp3');
    sound1.onerror = () => console.warn('Submit sound failed to load');
    sound1.play().catch(err => console.warn('Submit sound failed to play:', err));

    // Calculate score with type checking
    // Inside submitAllAnswers function, modify the score calculation:

score = questions.reduce((total, question, index) => {
  if (!question) return total; // Skip invalid questions

  if (question.input && Array.isArray(question.answer)) {
    // Handle input-type questions
    const userAnswers = Ansgiven[index] || [];
    const correctAnswers = question.answer;
    
    // Create complete answers array including fixed operands
    const completeAnswers = question.input.map((field, idx) => {
      if (field.operand !== "") {
        return field.operand;
      }
      return userAnswers[idx] || '';
    });

    // Compare complete answers with correct answers
    const isCorrect = correctAnswers.every((ans, i) => 
      String(completeAnswers[i]) === String(ans)
    );

    // Increment score if all answers match
    return isCorrect ? total + 1 : total;
  } else if (question.answer !== undefined) {
    // Handle radio-type questions
    return Ansgiven[index] === question.answer ? total + 1 : total;
  }
  return total;
}, 0);

    // Validate topic name
    if (!topicName) {
      topicName = 'default_topic';
    }

    // Save results with error handling
    try {
      saveToLocalStorage(topicName + '_score', score);
      saveToLocalStorage(topicName + '_completed', 'true');
    } catch (storageError) {
      console.error('Failed to save results:', storageError);
      // Continue execution even if storage fails
    }

    // Calculate percentage
    const count = questions.length;
    const percentage = (score / count) * 100;

    // Generate results content
    const home = "<a href='./graph.html'><b class='btn btn-success next-btn-progress'>Click here to View Report</b></a><br>";
    
    try {
      saveToLocalStorage(topicName + '_results_content', home);
    } catch (storageError) {
      console.error('Failed to save results content:', storageError);
    }

    // Generate question review
    let questionContent = generateQuestionReview();
    
    try {
      saveToLocalStorage(topicName + '_question_content', questionContent);
    } catch (storageError) {
      console.error('Failed to save question content:', storageError);
    }

    // Hide quiz elements
    const questionDiv = document.getElementById("questiondiv");
    if (questionDiv) {
      questionDiv.style.display = "none";
    }

    // Play completion animation and sound
    try {
      confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (confettiError) {
      console.warn('Confetti animation failed:', confettiError);
    }

    try {
      const sound = new Audio('./assests/sounds/well-done.mp3');
      sound.onerror = () => console.warn('Completion sound failed to load');
      sound.play().catch(err => console.warn('Completion sound failed to play:', err));
    } catch (soundError) {
      console.warn('Failed to play completion sound:', soundError);
    }

    // Redirect to results
    window.location.href = "./graph.html";
  } catch (error) {
    console.error('Error in submitAllAnswers:', error);
    alert('There was an error submitting your answers. Please try again or contact support.');
  }
}

// Helper function to generate question review
function generateQuestionReview() {
  try {
    const questionsPerPage = 3;
    const numberOfPages = Math.ceil(questions.length / questionsPerPage);
    let questionContent = "";

    for (let page = 0; page < numberOfPages; page++) {
      const start = page * questionsPerPage;
      const end = Math.min(start + questionsPerPage, questions.length);
      let pageDiv = `<div class='question-page' style='display: ${page === 0 ? "block" : "none"};'><h2>Page ${page + 1}</h2>`;

      for (let j = start; j < end; j++) {
        const question = questions[j];
        if (!question) continue; // Skip invalid questions

        pageDiv += generateQuestionReviewItem(question, j);
      }

      pageDiv += "</div>";
      questionContent += pageDiv;
    }

    return questionContent;
  } catch (error) {
    console.error('Error generating question review:', error);
    return "<div>Error generating question review</div>";
  }
}

// Helper function to generate single question review item
function generateQuestionReviewItem(question, index) {
  try {
    const ques = question.question || 'Question not available';
    let ansContent = '';
    let givenContent = '';

    if (question.input && Array.isArray(question.answer)) {
      // Handle input-type questions
      ansContent = question.answer.join(', ');
      const userAnswers = Ansgiven[index] || [];
      
      // Create a complete answers array including fixed operands
      const completeAnswers = question.input.map((field, idx) => {
        if (field.operand !== "") {
          return field.operand;
        }
        return userAnswers[idx] || '';
      });
      
      // Check each answer and color incorrect ones red
      const formattedAnswers = completeAnswers.map((ans, idx) => {
        if (String(ans) === String(question.answer[idx])) {
          return ans;
        } else {
          return `<span style="color:red">${ans || '__'}</span>`;
        }
      });
      
      givenContent = formattedAnswers.join(', ') || '<span style="color:red">Not Answered</span>';
    } else {
      // Handle radio-type questions
      const ans = question.options?.[question.answer];
      ansContent = ans?.image 
        ? `<img src='${ans.image}' alt='Answer Image' style='width: 50px; height: 50px;'>`
        : getOptionLabel(ans);

      const givenAnswer = Ansgiven[index] !== undefined ? question.options?.[Ansgiven[index]] : null;
      if (givenAnswer) {
        const isCorrect = Ansgiven[index] === question.answer;
        givenContent = givenAnswer.image
          ? `<img src='${givenAnswer.image}' alt='Given Answer Image' style='width: 120px; height: 50px;${isCorrect ? '' : ' border: 2px solid red;'}'>`
          : `<span style='color: ${isCorrect ? 'inherit' : 'red'};'>${getOptionLabel(givenAnswer)}</span>`;
      } else {
        givenContent = '<span style="color:red">Not Answered</span>';
      }
    }

    return `Q.${index + 1} ${ques}<br>` +
           `Correct Answer: ${ansContent}<br>` +
           `Answer Given: ${givenContent}<br><br>`;
  } catch (error) {
    console.error(`Error generating review for question ${index}:`, error);
    return `Q.${index + 1} Error generating review<br><br>`;
  }
}

function showPage(pageNumber) {
  var pages = document.getElementsByClassName('question-page');
  for (var i = 0; i < pages.length; i++) {
    pages[i].style.display = "none";
  }
  pages[pageNumber].style.display = "block";
}

function playOptionSound(soundPath) {
  const sound = new Audio(soundPath);
  sound.play();
}

function getOptionLabel(option) {
  return typeof option === 'string' ? option : option.text || '';
}
