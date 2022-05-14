import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants, GetWordleResponseType, CheckWordleResponseType, KeyBox } from './config/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})

export class AppComponent implements OnInit {
  title = 'Wordle Clone'

  keys: KeyBox[][] = [[], [], [], [], [], []]

  letterCounter: number = 0

  triesCounter: number = 0

  wordleID: number|null = null

  wordleHint: string| null = null

  wordleLetterStatus = Constants.WorldeLetterStatus

  wordleStatus = Constants.WordleStatus

  gameStatus: string | null = null

  notification: string | null = null

  constructor(private http: HttpClient) {}

  ngOnInit() {

    for(let i=0; i<6; i++){
      for(let j=0; j<5; j++) {
        this.keys[i][j] = {letter: '', state: null}
      }
    }

    this.http.get<GetWordleResponseType>(Constants.API_GET_WORDLE).subscribe(data=>{
      console.log(data)
      this.wordleID = data.pk;
      this.wordleHint = data.wordle;
    });
  }

  closeAlert() {
    this.gameStatus = null;
    this.notification = null;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    
    // If All Tries Are Exhausted Do Not Execute
    if(this.triesCounter == this.keys.length) return;

    console.log(event);

    // If Input Key Is Alphabet Then Update UI Box With Alphabet and move cursor to next box
    if (event.key.toUpperCase() != event.key.toLowerCase() && event.key.length == 1) {
      if (this.letterCounter < this.keys[this.triesCounter].length) {
        this.keys[this.triesCounter][this.letterCounter].letter = event.key;
        this.letterCounter = this.letterCounter + 1;
      }
    }

    // if Input Key is Backspace, del latest alphabet in box and move cursor behind one step
    else if (event.key.toLowerCase() == 'backspace' ) {
      if (this.letterCounter > 0) {
        this.letterCounter = this.letterCounter - 1;
      }
      this.keys[this.triesCounter][this.letterCounter].letter = '';
    }

    // If input key is Enter
    else if (event.key.toLowerCase() == 'enter' ) {
      
      // Create string from latest row
      let guess: string = '';
      this.keys[this.triesCounter].forEach(data => {
        guess = guess + data.letter;
      })

      // Check if string is valid, if yes then send this to API
      if (guess.length == this.keys[this.triesCounter].length && this.wordleID != null) {
        this.http.get<CheckWordleResponseType>(
          Constants.API_CHECK_WORDLE
            .replace('{guess}', guess)
            .replace('{wordleID}', this.wordleID.toString())
            .replace('{triesCount}', (this.triesCounter + 1).toString())
        ).subscribe(data=>{

          // update box with response from server regarding each letter
          data.word.forEach((keybox: KeyBox, index: number) => {
            this.keys[this.triesCounter][index].state = keybox.state
          });

          // update notification on screen
          this.gameStatus = data.gameStatus;
          this.notification = data.gameStatus;
          
          // if at any stage of game user get correct answer then stop game there
          if(data.gameStatus == Constants.WordleStatus.Correct) {
            this.triesCounter = this.keys.length;
          }
          // else check if user has still guess left, if yes then allow him to keep trying or else finish game with fail message
          else {
            if(this.triesCounter < this.keys.length-1) {
              this.triesCounter = this.triesCounter + 1;
              this.letterCounter = 0;
              console.log('Keep Trying');
            }
            else if (this.triesCounter == this.keys.length - 1){
              console.log('Failed');
            }
          }
        })
      }
    }
  }
}
