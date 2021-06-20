import { Character } from './character.model';

export interface House {
    "name": any,
    "nameTrimmed"?: string,
    "url": string,
    "id": string,
    "region"?: string,
    "coatOfArms"?: string,
    "words"?: string,
    "titles"?: [],
    "seats"?: [],
    "currentLord"?: string,
    "heir"?: string,
    "overlord"?: string,
    "founded"?: string,
    "founder"?: string,
    "diedOut"?: string,
    "ancestralWeapons"?: [],
    "cadetBranches"?: string,
    "swornMembers"?: string[],
    "image"?: string
}