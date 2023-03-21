import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HttpContext from '@ioc:Adonis/Core/HttpContext'
import ResponseService from 'App/Services/ResponseService'
import { ResponseContract } from '@ioc:Adonis/Core/Response'
import { RequestContract } from '@ioc:Adonis/Core/Request'

export default class BaseService extends ResponseService {
  protected ctx: HttpContextContract
  protected response: ResponseContract
  protected request: RequestContract

  constructor() {
    super()
    this.ctx = HttpContext.getOrFail()
    this.response = this.ctx.response
    this.request = this.ctx.request
  }
}
