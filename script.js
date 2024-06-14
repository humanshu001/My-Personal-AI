const GOOGLE_GENERATIVE_AI_URL = 'https://cdn.jsdelivr.net/npm/@google/generative-ai@0.12.0/dist/index.min.js';

let userMessage = null;
const inputInitHeight = chatInput.scrollHeight;
let genAI = null; // Variable to store the Generative AI instance

// Function to load Google Generative AI package dynamically
async function loadGoogleGenerativeAI() {
  try {
    if (!genAI) {
      const response = await fetch(GOOGLE_GENERATIVE_AI_URL);
      const scriptText = await response.text();
      eval(scriptText); // Evaluate the script to load the Generative AI module
      genAI = new GoogleGenerativeAI('AIzaSyCCIU7yIL791zNTZDt_DhsDrG3Fc2IZgSI');
    }
  } catch (error) {
    console.error('Error loading Google Generative AI:', error);
    throw error;
  }
}

// Function to run the Generative AI model
async function runModel(prompt) {
  try {
    await loadGoogleGenerativeAI(); // Ensure Generative AI is loaded
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.log('Error running Generative AI model:', error);
    throw error;
  }
}

// Rest of the code remains unchanged

const generateResponse = async (chatElement) => {
  const messageElement = chatElement.querySelector('p');

  try {
    const answer = await runModel(userMessage);
    messageElement.textContent = answer;
  } catch (error) {
    console.error('Failed To Generate response: ', error);
    messageElement.textContent = 'Sorry, something went wrong!';
  }

  chatbox.scrollTo(0, chatbox.scrollHeight);
};

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;

  chatInput.value = '';
  chatInput.style.height = `${inputInitHeight}px`;

  chatbox.appendChild(createChatLi(userMessage, 'outgoing'));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
    const incomingChatLi = createChatLi('Thinking...', 'incoming');
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi, userMessage);
  }, 600);
};

chatInput.addEventListener('input', () => {
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});
