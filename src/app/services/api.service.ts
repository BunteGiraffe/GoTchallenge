import { Injectable } from '@angular/core';
import { House } from '../models/house.model';
import { Character } from '../models/character.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})

export class GotApiService {
  constructor(private http: HttpClient) { 
    this.apiHousesEndpointUrl = GotApiService.API_URL + GotApiService.housesEndpoint;
    this.apiCharactersEndpointUrl = GotApiService.API_URL + GotApiService.charactersEndpoint;
  }

  static readonly API_URL = 'https://anapioficeandfire.com/api/';
  static readonly housesEndpoint = 'houses';
  static readonly charactersEndpoint = 'characters';

  apiHousesEndpointUrl: string = '';
  apiCharactersEndpointUrl: string = '';
  swornMembersToReturn: string[] = [];
  pageSize:number = 6;

  cache: {
    pages: Record<string,any>,
    houses: Record<string,any>,
    characters: Record<string,any>
  } = {
    pages: {},
    houses: {},
    characters: {}
  }

  public fetchHouses = async (pageNum: number): Promise<Record<string,House>> => {
    try {
        let url = this.apiHousesEndpointUrl + "?page=" + pageNum + "&pageSize=" + this.pageSize;
        if (url in this.cache.pages) {
          return this.cache.pages[url].data; 
        }  
        let housesToReturn: Record<string,House> = {};

        let request = await this.http.get<House[]>(url).pipe().toPromise();
        request.forEach( (house) => {
            this.formHouseObject(house).then((house) => {
              housesToReturn[house.url] = house;
              this.cache.houses[house.url] = house;
            });
          } 
        );

        this.cache.pages[url] = {
          lastModified: new Date().toString(),
          data: housesToReturn
        }; 

        return housesToReturn;
    } catch (error) {
        if (error) {
          return error.message
        }
    }
    return {};
  }

  private fetchCharacter = async (url: string): Promise<string> => {
    try {
        if (url in this.cache.characters) {
          return this.cache.characters[url].data; 
        }  
        let request = await this.http.get<Character>(url).pipe().toPromise().then( async (character) => {
          this.cache.characters[url] = {
            lastModified: new Date().toString(),
            data: character.name
          };   
          return this.cache.characters[url].data;    
        });

        return request;

    } catch (error) {
        if (error) {
          return error.message
        }
    }
    return '';
  }

  private fetchSingleHouse = async (url: string): Promise<House> => {
    try {
        if (url in this.cache.houses) {
          return this.cache.houses[url]; 
        }  

        let request = await this.http.get<House>(url).pipe().toPromise();
        let tempHouse = await this.formHouseObject(request).then((tempHouse) => {
          this.cache.houses[url] = tempHouse; 
          return tempHouse;
        } );
        
    } catch (error) {
        if (error) {
          return error.message
        }
    }
    return {name: '', url: '', id: ''};
  }

  public async getHousesForPage(pageNum: number) {
    let result = this.fetchHouses(pageNum);
    return result;
  }

  public async getHouse(url: string) {
    await this.fetchSingleHouse(url);
    return this.cache.houses[url];
  }

  private async formHouseObject(data: House) {
    this.swornMembersToReturn = [];

    const swornMembers = () => {
        let swornMembers: string[] = data.swornMembers ?? [];
        swornMembers.forEach( async element => {
          let tempMember = await this.fetchCharacter(element).then((data) => {return data} );
          this.swornMembersToReturn.push(tempMember);
        });
    }

    swornMembers();
        
    let tempHouse: House = {
      name: data.name,
      nameTrimmed: data.name.replace('House ', '').replace("'", '*'),
      url: data.url,
      id: data.url.split('/').pop() ?? '',
      region: data.region,
      coatOfArms: data.coatOfArms,
      titles: data.titles ?? [],
      words: data.words,
      seats: data.seats ?? [],
      currentLord: data.currentLord ? data.currentLord : '',
      heir: data.heir ? data.heir : '',
      overlord: data.overlord,
      founded: data.founded,
      founder: data.founder ? data.founder : '',
      diedOut: data.diedOut,
      ancestralWeapons: data.ancestralWeapons ?? [],
      cadetBranches: data.cadetBranches,
      swornMembers: this.swornMembersToReturn ?? [],
    };

    data.currentLord ? this.fetchCharacter(data.currentLord).then( (character) => {tempHouse.currentLord = character}) : '';
    data.heir ? this.fetchCharacter(data.heir).then( (character) => {tempHouse.heir = character}) : '';
    data.founder ? this.fetchCharacter(data.founder).then( (character) => {tempHouse.founder = character}) : '';

    switch (tempHouse.nameTrimmed) {
      case 'Lannister of Casterly Rock':
        tempHouse.image = 'lannister.jpeg';
        break;
      case 'Stark of Winterfell':
        tempHouse.image = 'stark.jpg';
        break;
      case 'Targaryen of King*s Landing':
        tempHouse.image = 'targaryen.jpg';
        break;
      default:
        break;
    }

    return tempHouse;
  }

}
