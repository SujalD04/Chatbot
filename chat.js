// Define questions
const questions = {
    TIRES: [
        "Sir what is the Tire Pressure of Left Front?",
        "Sir what is the Tire Pressure of Right Front?",
        "What is the Tire Condition for Left Front?",
        "What is the Tire Condition for Right Front?",
        "Sir what is the Tire Pressure for Left Rear?",
        "Sir what is the Tire Pressure for Right Rear?",
        "What is the recent Tire Condition of Left Rear (Good, Ok, Needs Replacement)?",
        "What is the recent Tire Condition of Right Rear (Good, Ok, Needs Replacement)?",
        "What are the other problems do you see?"
    ],
    BATTERY: [
        "Sir what is the Battery Make of?",
        "Sir last Battery replacement date of the subject?",
        "Sir What is the Battery Voltage Value?",
        "Sir is there leakage or damage in the battery?",
        "Sir Did the battery get Rusty?",
        "Sir any other problem in the battery?"
    ],
    EXTERIOR: [
        "Sir is there any external damage in the body?",
        "Sir is there any Oil leak in Suspension?",
        "Sir is there any external problem present?"
    ],
    BRAKES: [
        "Sir what is the Condition of Brake Fluid level?",
        "What is the Brake Condition for Front brake?",
        "What is the Brake Condition for Rear brake?",
        "How is Emergency Brake working sir?",
        "Any other fault in the brake?"
    ],
    ENGINE: [
        "Is there Rust, Dents or Damage in Engine?",
        "Sir can you describe the condition of the engine?",
        "What is the Engine Oil Condition?",
        "Sir What is the color of the Engine Oil?",
        "What is the condition of Brake Fluid?",
        "What is the color of the Brake Fluid?",
        "Any oil leak in Engine?",
        "Any other engine problem?"
    ]
};

// Initialize conversation state
let currentSection = null;
let currentQuestionIndex = 0;

// Function to handle user input
function handleUserInput(input) {
    input = input.toLowerCase();
    if (input.includes('start')) {
        const sections = Object.keys(questions).join(', ');
        addChatMessage(`Which section would you like to start with? (${sections})`);
    } else if (currentSection && questions[currentSection]) {
        const question = questions[currentSection][currentQuestionIndex];
        if (question) {
            addChatMessage(question);
        } else {
            addChatMessage(`All questions for the ${currentSection} section have been answered.`);
            currentSection = null;
            currentQuestionIndex = 0;
        }
    } else {
        const section = detectSection(input);
        if (section && questions[section]) {
            currentSection = section;
            currentQuestionIndex = 0;
            const question = questions[section][currentQuestionIndex];
            if (question) {
                addChatMessage(question);
            } else {
                addChatMessage(`All questions for the ${section} section have been answered.`);
                currentSection = null;
                currentQuestionIndex = 0;
            }
        } else {
            addChatMessage("Please specify a valid section to start with.");
        }
    }

    // Check if 'record' is in the input to trigger the download
    if (input.includes('record')) {
        downloadResponses();
    }
}

// Function to detect section based on user input
function detectSection(input) {
    const sectionKeys = Object.keys(questions);
    for (let key of sectionKeys) {
        if (input.includes(key.toLowerCase())) {
            return key;
        }
    }
    return null;
}

// Function to add chat messages to the UI
function addChatMessage(message) {
    const chatBox = document.querySelector('.chatbot-body .options');
    const chatMessage = document.createElement('div');
    chatMessage.classList.add('message', 'bot');
    chatMessage.innerHTML = `<div class="message-text">${message}</div>`;
    chatBox.appendChild(chatMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to save responses to localStorage
function saveResponse(section, question, response) {
    let responses = localStorage.getItem('responses') || "";
    responses += `Section: ${section}\nQuestion: ${question}\nResponse: ${response}\n\n`;
    localStorage.setItem('responses', responses);
}

// Function to trigger download of the response.txt file
function downloadResponses() {
    const responses = localStorage.getItem('responses');
    if (responses) {
        const blob = new Blob([responses], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Summary.txt';
        link.click();
    } else {
        addChatMessage("No responses available to download.");
    }
}

// Handle send button click
document.querySelector('.send-btn').addEventListener('click', () => {
    const chatInput = document.querySelector('.chatbot-body .input-container input');
    const input = chatInput.value.trim();
    if (input) {
        handleUserInput(input);
        chatInput.value = '';

        if (currentSection) {
            const question = questions[currentSection][currentQuestionIndex];
            saveResponse(currentSection, question, input);
            currentQuestionIndex++;
        }
    }
});

// Toggle sidebar
document.getElementById('toggle-btn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('closed');
});
