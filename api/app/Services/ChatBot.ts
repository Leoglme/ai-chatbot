import { NlpManager } from 'node-nlp'

export class ChatBot {
  private manager

  constructor() {
    // Initialize the manager
    this.manager = new NlpManager({ languages: ['fr'], nlu: { log: true } })
  }

  // Add training examples for the manager
  public async learn(trainingData) {
    trainingData.forEach((data) => {
      this.manager.addDocument('fr', data.input.toLowerCase(), data.output)
    })
    await this.manager.train()
    this.manager.save()
  }

  // Respond to a user request using the trained manager
  public async answer(query) {
    const response = await this.manager.process('fr', query.toLowerCase())
    const maxClassification = response.classifications.reduce((prev, current) =>
      prev.score > current.score ? prev : current
    )
    return maxClassification.score > 0.5 ? maxClassification.intent : 'Proposez une réponse'
  }
}
