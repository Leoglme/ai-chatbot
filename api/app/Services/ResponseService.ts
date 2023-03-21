import HttpContext from '@ioc:Adonis/Core/HttpContext'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ResponseService {
  protected ctx: HttpContextContract

  constructor() {
    this.ctx = HttpContext.getOrFail()
  }

  protected send(content: unknown, code = 200) {
    return this.ctx.response.status(code).send(content)
  }
}
