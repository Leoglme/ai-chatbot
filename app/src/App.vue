<template>
  <div class="chatbot-container">
    <div class="chatbot-icon" @click="toggleChat">
      <svg
        width="20"
        :height="20"
        viewBox="0 0 372 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M178.834 269.9L80.8736 246.521L104.272 148.48C108.895 129.106 119.161 111.537 133.769 97.9969C148.378 84.4563 166.674 75.5518 186.343 72.4093C206.012 69.2669 226.172 72.0276 244.272 80.3424C262.372 88.6572 277.6 102.153 288.031 119.122C298.461 136.092 303.625 155.773 302.87 175.678C302.115 195.582 295.474 214.815 283.788 230.946C272.102 247.076 255.895 259.379 237.216 266.298C218.538 273.218 198.227 274.443 178.853 269.819M365.189 212.117C370.943 190.828 372.447 168.615 369.616 146.745C366.785 124.875 359.675 103.777 348.69 84.6555C337.705 65.5338 323.062 48.7629 305.596 35.3004C288.129 21.8379 268.183 11.9474 246.894 6.19366C225.606 0.439931 203.392 -1.06437 181.523 1.76662C159.653 4.59762 138.555 11.7085 119.433 22.6932C100.311 33.6779 83.5403 48.3214 70.0778 65.7875C56.6153 83.2537 46.7248 103.2 40.9711 124.489L0.000570349 296.161L161.327 334.663C251.366 356.151 343.054 302.002 365.189 212.117Z"
          fill="#101623"
        />
      </svg>
    </div>
    <div class="chatbot-window" :class="{ open: isOpen }">
      <div class="chatbot-header">
        <h2>Chatbot</h2>
        <button class="close-button" @click="toggleChat">
          <i class="fa fa-times"></i>
        </button>
      </div>
      <div class="chatbot-messages">
        <div v-for="message in messages" :key="message.id">
          <p v-if="message.isUser">{{ message.text }}</p>
          <div v-else>
            <p>{{ message.text }}</p>
            <small>{{ message.time }}</small>
          </div>
        </div>
      </div>
      <div class="chatbot-input">
        <input type="text" v-model="userInput" @keyup.enter="sendMessage" />
        <button @click="sendMessage">Envoyer</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { io } from 'socket.io-client'
import { ref, reactive } from 'vue'
import * as process from 'process'

/*REFS*/
const isOpen = ref(false)
const userInput = ref('')
const messages = ref([
  {
    id: 1,
    text: 'Bonjour, comment puis-je vous aider?',
    isUser: false,
    time: new Date().toLocaleTimeString()
  }
])

/*REACTIVE*/
const state = reactive({
  connected: false
})

/*DATA*/
// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3333'

const socket = URL ? io(URL) : undefined

if (socket) {
  socket.on('connect', () => {
    state.connected = true
  })
  socket.on('disconnect', () => {
    state.connected = false
  })
}

/*METHODS*/
const toggleChat = () => {
  isOpen.value = !isOpen.value
}

// Afficher un message dans la fenêtre de chat
const addMessage = (text: string, isUser: boolean) => {
  messages.value.push({
    id: messages.value.length + 1,
    text,
    isUser,
    time: new Date().toLocaleTimeString()
  })
}

// Soumettre le message au serveur
const sendMessage = () => {
  if (userInput.value) {
    if (socket) {
      socket.emit('message', { message: userInput.value })
      addMessage(userInput.value, true)
    }
    userInput.value = ''
  }
}

// Soumettre le message de réponse personnalisée au serveur
const sendResponse = (input: string, response: string) => {
  if (socket) {
    socket.emit('response', { message: input, response })
  }

  addMessage(`Bot: Thank you, I have learned the response.`, false)
}

if (socket) {
  // Afficher un message de bot dans la fenêtre de chat
  socket.on('message', (data) => {
    const message = data.message
    addMessage(message, false)
  })

  // Afficher une invite de réponse de bot dans la fenêtre de chat
  socket.on('prompt', (data) => {
    const message = data.message
    const response = prompt(`Bot: ${message}`)
    if (response) {
      sendResponse(message, response)
    }
  })
}
</script>

<style lang="scss" scoped>
.chatbot-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
}

.chatbot-icon {
  background-color: #8472f3;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.chatbot-icon i {
  font-size: 24px;
}

.chatbot-window {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 400px;
  height: 500px;
  border: 1px solid #ccc;
  display: none;
  flex-direction: column;
  justify-content: space-between;
  z-index: 999;
}

.chatbot-window.open {
  display: flex;
}

.chatbot-header {
  background-color: #8472f3;
  color: white;
  padding: 10px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chatbot-messages {
  height: 350px;
  overflow-y: scroll;
  padding: 10px;
}

.chatbot-messages p {
  background-color: #404040;
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 5px;
}

.chatbot-messages small {
  color: #ccc;
  font-size: 12px;
  margin-top: 5px;
}

.chatbot-input {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-top: 1px solid #ccc;
}

.chatbot-input input {
  flex: 1;
  padding: 5px;
  margin-right: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.chatbot-input button {
  padding: 5px 10px;
  border-radius: 5px;
  border: none;
  background-color: #8472f3;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.chatbot-input button:hover {
  background-color: #2e8b57;
}

.close-button {
  background-color: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 24px;
}
</style>
