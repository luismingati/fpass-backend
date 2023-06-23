import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HeroesModule } from './heroes/heroes.module';

@Module({
  imports: [HeroesModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
