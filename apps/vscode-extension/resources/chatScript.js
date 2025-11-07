// Configure marked.js for Markdown parsing
marked.setOptions({
  breaks: true,
});

const vscode = acquireVsCodeApi();
const chatDiv = document.getElementById('chat');
const input = document.getElementById('userInput');
const button = document.getElementById('sendButton');

// Retrieve previously saved conversation state (if any)
let conversation = vscode.getState()?.conversation || [];

// Render conversation from saved state
function renderConversation() {
  chatDiv.innerHTML = '';
  conversation.forEach(msg => addMessage(msg.sender, msg.text, false));
}

// Add a message to the chat
function addMessage(sender, text, updateState = true) {
  const container = document.createElement('div');
  container.classList.add('message-container', sender);

  const senderLabel = document.createElement('div');
  senderLabel.classList.add('sender-label');
  senderLabel.textContent = sender === 'user' ? 'You:' : 'Code-Agent:';

  const bubble = document.createElement('div');
  bubble.classList.add('message-bubble');

  // Render text using Markdown parsing
  const renderedText = typeof marked !== 'undefined' ? marked.parse(text) : text;
  bubble.innerHTML = renderedText;

  container.appendChild(senderLabel);
  container.appendChild(bubble);

  chatDiv.appendChild(container);
  chatDiv.scrollTop = chatDiv.scrollHeight;

  if (updateState) {
    conversation.push({ sender, text });
    vscode.setState({ conversation });
  }
}

// Render any previously saved messages on load
renderConversation();

// Function to send a message
function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage('user', text);
  vscode.postMessage({ command: 'ask', text });
  input.value = ''; // Clear input field after sending
}

// Send message when button is clicked
button.addEventListener('click', sendMessage);

// Send message when Enter key is pressed
input.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendMessage();
  }
});

// Listen for messages from the extension host
window.addEventListener('message', event => {
  const message = event.data;
  if (message.command === 'reply') {
    addMessage('agent', message.text);
  } else if (message.command === 'showPlan') {
    // Display the detailed plan
    addMessage('agent', message.plan);
    // Create buttons for the available options
    const optionsDiv = document.createElement('div');
    optionsDiv.classList.add('options-container');
    message.options.forEach((option) => {
      const btn = document.createElement('button');
      btn.textContent = option;
      btn.classList.add('option-button');
      btn.addEventListener('click', () => {
        // Send the user's choice back to the extension
        vscode.postMessage({ command: 'executeChoice', choice: option });
      });
      optionsDiv.appendChild(btn);
    });
    chatDiv.appendChild(optionsDiv);
    chatDiv.scrollTop = chatDiv.scrollHeight;
  } else if (message.command === 'showStatus') {
    addMessage('agent', message.message);
  } else if (message.command === 'showError') {
    addMessage('agent', "Error: " + message.message);
  }
});
