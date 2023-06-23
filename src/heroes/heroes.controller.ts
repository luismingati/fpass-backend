import { Controller, Get, Query, Post, Body, Delete } from '@nestjs/common';
import { HeroesService } from './heroes.service';

@Controller('heroes')
export class HeroesController {
  constructor(private readonly heroesService: HeroesService) {}

  @Get()
  searchHeroes(@Query('name') name: string) {
    return this.heroesService.getHeroByName(name);
  }

  @Get('favorites')
  getFavorites() {
    return this.heroesService.getFavorites();
  }

  @Post('favorites')
  addFavorite(@Body('id') id: number) {
    this.heroesService.addFavorite(id);
    return { status: 'success' };
  }

  @Delete('favorites')
  removeFavorite(@Body('id') id: number) {
    this.heroesService.removeFavorite(id);
    return { status: 'success' };
  }
}
