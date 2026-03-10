import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from './prisma/prisma.module'

/*
  Imports the .env file and relevant modules, controllers and services
*/
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule, AppModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}