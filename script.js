let genAI = null; // Variable to store the Generative AI instance

// Function to load Google Generative AI package dynamically
async function loadGoogleGenerativeAI() {
  try {
    if (!genAI) {
      // const response = await fetch(GOOGLE_GENERATIVE_AI_URL);
      // const scriptText = await response.text();
      // eval(scriptText); // Evaluate the script to load the Generative AI module
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
    console.error('Error running Generative AI model:', error);
    throw error;
  }
}

// Assuming createChatLi and other UI functions are correctly implemented
const createChatLi = (message, className) => {
  const chatLi = document.createElement('li');
  chatLi.classList.add('chat', `${className}`);
  let chatContent =
    className === 'outgoing'
      ? `<p>${message}</p>`
      : `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;
  chatLi.innerHTML = chatContent;
  return chatLi;
};

const generateResponse = async (chatElement, userMessage) => {
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
  const userMessage = chatInput.value.trim();
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

// Initially load the Google Generative AI package
loadGoogleGenerativeAI().catch(error => {
  console.error('Failed to initialize Google Generative AI:', error);
});
