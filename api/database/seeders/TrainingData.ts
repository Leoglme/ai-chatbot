import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import TrainingDataService from 'App/Services/TrainingDataService'
import { readFile } from 'fs/promises'
import { join } from 'path'

export default class extends BaseSeeder {
  public async run() {
    const rawData = await readFile(
      join(__dirname, '..', 'resources/TrainingData', 'trainings_data.json'),
      'utf-8'
    )
    const trainingData = JSON.parse(rawData)
    await TrainingDataService.createMany(trainingData)
  }
}
