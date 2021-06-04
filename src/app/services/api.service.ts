import { Injectable } from '@angular/core';
import { House } from '../models/house.model';
import { Character } from '../models/character.model';

@Injectable({
  providedIn: 'root'
})

export class GotApiService {

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
        const response = await fetch(url);
        const data = await response.json();

        let housesToReturn: Record<string,House> = {};

        for (let index = 0; index < data.length; index++) {
          let tempHouse = (await this.formHouseObject(data[index])).house;
          let url = tempHouse.url;
          housesToReturn[url] = tempHouse;
          this.cache.houses[url] = tempHouse;
        }

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

  private fetchCharacter = async (url: string): Promise<Character> => {
    try {
        if (url in this.cache.characters) {
          return this.cache.characters[url].data; 
        }  
        const response = await fetch(url);
        const data = await response.json();

        this.cache.characters[url] = {
          lastModified: new Date().toString(),
          data: data
        }; 

        return data;
    } catch (error) {
        if (error) {
          return error.message
        }
    }
    return {name: ''};
  }

  private fetchSingleHouse = async (url: string): Promise<House> => {
    try {
        if (url in this.cache.houses) {
          return this.cache.houses[url]; 
        }  
        const response = await fetch(url);
        const data = await response.json();

        let tempHouse = (await this.formHouseObject(data)).house;

        this.cache.houses[url] = tempHouse; 
        return tempHouse;

    } catch (error) {
        if (error) {
          return error.message
        }
    }
    return {name: '', url: ''};
  }

  public async getHousesForPage(pageNum: number) {
    let result = this.fetchHouses(pageNum);
    return result;
  }

  public getCharacter(url: string) {
    return this.fetchCharacter(url);
  }

  public async getHouse(url: string) {
    const data_1 = await this.fetchSingleHouse(url);
    return this.cache.houses[url];
  }

  private async formHouseObject(data: any) {
    this.swornMembersToReturn = [];
    const currentLord = await this.fetchCharacter(data.currentLord).then((data) => {return data});
    const heir = await this.fetchCharacter(data.heir).then((data) => {return data});
    const founder = await this.fetchCharacter(data.founder).then((data) => {return data});
    const swornMembers = () => {
        let swornMembers: [] = data.swornMembers;
        swornMembers.forEach( async element => {
          let tempMember = await this.fetchCharacter(element).then((data) => {return data.name});
          this.swornMembersToReturn.push(tempMember);
        });
    }

    let houseUrl = data.url;
    swornMembers();
    
    let tempHouse: House = {
      name: data.name,
      nameTrimmed: data.name.replace('House ', '').replace("'", '*'),
      url: data.url,
      id: data.url.split('/').pop(),
      region: data.region,
      coatOfArms: data.coatOfArms,
      titles: data.titles.join(', '),
      words: data.words,
      seats: data.seats.join(', '),
      currentLord: currentLord.name,
      heir: heir.name,
      overlord: data.overlord,
      founded: data.founded,
      founder: founder.name,
      diedOut: data.diedOut,
      ancestralWeapons: data.ancestralWeapons.join(', '),
      cadetBranches: data.cadetBranches,
      swornMembers: this.swornMembersToReturn.join(', '),
    };

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

    return {url: houseUrl, house: tempHouse};
  }

  constructor() { 
    this.apiHousesEndpointUrl = GotApiService.API_URL + GotApiService.housesEndpoint;
    this.apiCharactersEndpointUrl = GotApiService.API_URL + GotApiService.charactersEndpoint;
  }
}
