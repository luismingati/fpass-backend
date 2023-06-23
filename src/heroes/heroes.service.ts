import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { map } from 'rxjs/operators';
import * as crypto from 'crypto';
import { Observable, forkJoin, of } from 'rxjs';

@Injectable()
export class HeroesService {
  private readonly favorites: Set<number>;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.favorites = new Set<number>();
  }

  getHeroByName(name: string): Observable<AxiosResponse<any>> {
    const apiKey = this.configService.get<string>('MARVEL_API_KEY');
    const privateKey = this.configService.get<string>('MARVEL_PRIVATE_KEY');

    const ts = new Date().getTime();
    const hash = crypto
      .createHash('md5')
      .update(ts + privateKey + apiKey)
      .digest('hex');

    const url = `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${encodeURIComponent(
      name,
    )}&apikey=${apiKey}&ts=${ts}&hash=${hash}`;

    return this.httpService.get(url).pipe(
      map((response) => response.data.data.results),
      map((heroes) =>
        heroes.map((hero) => ({
          id: hero.id,
          name: hero.name,
          description: hero.description,
          isFavorite: this.favorites.has(hero.id),
        })),
      ),
    );
  }

  addFavorite(id: number): void {
    this.favorites.add(id);
  }

  removeFavorite(id: number): void {
    this.favorites.delete(id);
  }

  getHeroById(id: number): Observable<any> {
    const apiKey = this.configService.get<string>('MARVEL_API_KEY');
    const privateKey = this.configService.get<string>('MARVEL_PRIVATE_KEY');

    const ts = new Date().getTime();
    const hash = crypto
      .createHash('md5')
      .update(ts + privateKey + apiKey)
      .digest('hex');

    const url = `https://gateway.marvel.com:443/v1/public/characters/${id}?apikey=${apiKey}&ts=${ts}&hash=${hash}`;

    return this.httpService.get(url).pipe(
      map((response) => response.data.data.results[0]),
      map((hero) => ({
        id: hero.id,
        name: hero.name,
        description: hero.description,
      })),
    );
  }

  getFavorites(): Observable<any> {
    if (this.favorites.size === 0) {
      return of([]);
    }
    const favoriteHeroes = Array.from(this.favorites).map((id) =>
      this.getHeroById(id),
    );
    return forkJoin(favoriteHeroes);
  }
}
