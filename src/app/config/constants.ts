import { Injectable } from '@angular/core';

// Backend Enums Useful After Calling APIs From Server
enum _WorldeLetterStatus {
    CorrectLocation = "CORRECT_LETTER_WITH_CORRECT_LOCATION",
    InCorrectLocation = "CORRECT_LETTER_WITH_INCORRECT_LOCATION",
    WrongLetter = "WRONG_LETTER"
}
enum _WordleStatus {
    Correct = "CORRECT",
    Failed = "FAILED",
    KeepTrying = "KEEP_TRYING"
}

// Interfaces to match data types in API response.
export interface GetWordleResponseType {
    pk: number,
    wordle: string
}
export interface CheckWordleResponseType {
    word: KeyBox[],
    gameStatus: string
}
export interface KeyBox {
    letter: string,
    state: _WorldeLetterStatus | null
}

// Global Constants As Supplied By Backend
@Injectable()
export class Constants {

    // API Endpoints
    public static readonly API_GET_WORDLE: string      = '/api/get-wordle/?format=json'
    public static readonly API_CHECK_WORDLE: string    = '/api/check-wordle/{guess}/{wordleID}/{triesCount}/?format=json'

    // Enums
    public static readonly WorldeLetterStatus          = _WorldeLetterStatus;
    public static readonly WordleStatus                = _WordleStatus;

}


