import TrainingData from 'App/Models/TrainingData'
import type { TrainingDataPayload } from 'App/Payloads/TrainingDataPayload'

class TrainingDataService {
  public async create(data: TrainingDataPayload): Promise<TrainingData> {
    return await TrainingData.create(data)
  }
  public async createMany(data: TrainingDataPayload[]): Promise<TrainingData[]> {
    return await TrainingData.createMany(data)
  }
}

export default new TrainingDataService()
