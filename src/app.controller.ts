import { Controller, Get, Post, Body } from '@nestjs/common'
import { AppService } from './app.service'
import { CreateNodeDto } from './dto/create-node.dto'

@Controller('/tree')
export class AppController {

  constructor(private appService: AppService) {}

  @Get()
  getTrees() {
    return this.appService.getTrees()
  }

  @Post()
  createNode(@Body() dto: CreateNodeDto) {
    return this.appService.createNode(dto)
  }
}