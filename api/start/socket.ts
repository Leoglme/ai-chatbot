import Ws from 'App/Services/Ws'
import { ChatBot } from 'App/Services/ChatBot'

Ws.boot()

const datas = [
  { input: 'hello', output: 'hello' },
  { input: "what's up ?", output: 'Ça va, et toi ?' },
  { input: 'how are you doing ?', output: 'Ça va, et toi ?' },
  { input: 'how are you today ?', output: 'Ça va, et toi ?' },
  { input: "how's it going ?", output: 'Ça va, et toi ?' },
  { input: 'hello how are you ?', output: 'Salut, ça va bien et toi ?' },
  { input: "what's your name ?", output: "Je m'appelle Bot" },
]

let bot = new ChatBot()
bot.learn(datas).then(() => loadSockets())

const loadSockets = () => {
  /**
   * Listen for incoming socket connections
   */
  Ws.io.on('connection', (socket) => {
    console.log('User connected:', socket.id)
    socket.on('message', async (data) => {
      const answer = await bot.answer(data.message)

      if (answer === 'Proposez une réponse') {
        socket.emit('prompt', { message: data.message })
      } else {
        socket.emit('message', { message: `Bot: ${answer}` })
      }
    })

    socket.on('response', async (data) => {
      datas.push({ input: data.message, output: data.response })
      bot = new ChatBot()
      await bot.learn(datas)
      console.log("Bot : Merci, j'ai appris la réponse.\n")
    })

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
    })
  })
}
