import {
    CommonModule,
    NgForOf,
    DOCUMENT,
} from '@angular/common';
import { ElementRef } from '@angular/core';
import {
    Component,
    OnInit,
    HostListener,
    ViewChild,
    Inject,
} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import * as domain from 'node:domain';

interface AvailableLetter {
    id: number;
    value: string;
}

interface Words {
    word: Array<string>;
    guessed: boolean;
}

interface LettersLayout {
    letter: AvailableLetter;
    coordinates: Coordinates;
}

interface RectWithLetterLayout {
    rect: DOMRect,
    letterWithLayout: LettersLayout,
}

interface Coordinates {
    x: string;
    y: string;
}

@Component({
  selector: 'app-main',
  standalone: true,
    imports: [
        NgForOf,
        CommonModule
    ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.less'
})
export class MainComponent implements OnInit {
    @HostListener('mouseup')
    @HostListener('touchend')
    _onMouseUp(event: MouseEvent): void {
        if (this._isWordEnteringNow) {
            this._checkWord();
        }
    }

    public _initWords: Array<string> = [];
    public _initWords1: Array<string> = ["брат","араб","тара","бар","раб","бра"];
    public _initWords2: Array<string> = ["минор","корм","кино","мир","ком","ион","ром","мор","рок","инок"];
    public _initWords3: Array<string> = ["канон","икона","цинк","кино","ион","инок"];
    // public _initWords: Array<string> = ["бр","бар","раб","бра"];
    // public _initWords: Array<string> = ["ABCD"];
    public _words: Array<Array<string>> = [];
    public _sortedWords: Words[] = [];
    public _enteringWord: Array<AvailableLetter> = [];
    public availableLetters: Array<string> = [];
    public availableLettersInHTML: Array<AvailableLetter> = [];
    public _isWordEnteringNow: boolean = false;
    public _lettersWithLayout: Array<LettersLayout> = [];

    private _coordinatesMap: Array<Coordinates> = [];

    public _isPreviewOfLevel: boolean = false;
    public _currentLevel: number = 1;

    private _indexNumberForAvailableLettersInHTML: number = 0;

    private rects: Array<RectWithLetterLayout>;

    // private localStorage: WindowLocalStorage | undefined;

    constructor(@Inject(DOCUMENT) private document: HTMLDocument) {}

    ngOnInit(): void {
        this._startLevel();
    }

    ngAfterViewInit(): void {
        this._getCoordinatesOfAvailableLetters();
    }

    _getCoordinatesOfAvailableLetters(): void {
        // console.log(this.myElement?.nativeElement?.value);
        this.rects = [];
        this._lettersWithLayout.forEach((letterWithLayout, index) => {
            let element: HTMLElement = document.getElementById(index.toString())!;
            this.rects.push({
                rect: element.getBoundingClientRect(),
                letterWithLayout,
            });
        });

        console.log("this.rects");
        console.log(this.rects);

        // let myDiv = document.getElementById('0');
        // let rect: any = myDiv?.getBoundingClientRect();
        // this.rects = rect;
        // console.log(rect.top, rect.right, rect.bottom, rect.left);
    }

    _startLevel(): void {
        // this.localStorage = document.defaultView?.localStorage;
        this._checkStateOfGame();
        this._convertWordsToArrays();
        this._setAvailableLetters();

        this._calcCoordinates();
    }

    public getItem(key: string): any {
        return JSON.parse(localStorage.getItem(key)!);
    }

    _checkStateOfGame(): void {
        const currentLevel: string = this.getItem('currentLevel');
        const sortedWords: string = this.getItem('words');
        if (currentLevel) {
            this._currentLevel = +currentLevel;
        }
        console.log('words from local storage');
        console.log(sortedWords);
    }

    _convertWordsToArrays(): void {
        if (this._currentLevel % 3 === 1) {
            this._initWords = this._initWords1;
        } else if (this._currentLevel % 3 === 2) {
            this._initWords = this._initWords2;
        } else {
            this._initWords = this._initWords3;
        }

        this._words = [];

        this._initWords.forEach((word: string) => {
           this._words.push(word.split(''));
        });
        console.log('words: ');
        console.log(this._words);
        this._sortWords();
    }

    _sortWords(): void {
        // TODO check State of game in suitable function
        const sortedWords: any = this.getItem('words');
        if (sortedWords) {
            this._sortedWords = sortedWords;
            return;
        }

        // TODO bubble sort
        this._sortedWords = [];
        if (this._currentLevel % 3 === 1) {
            this._sortedWords.push({ word: this._words[3], guessed: false });
            this._sortedWords.push({ word: this._words[4], guessed: false });
            this._sortedWords.push({ word: this._words[5], guessed: false });
            this._sortedWords.push({ word: this._words[0], guessed: false });
            this._sortedWords.push({ word: this._words[1], guessed: false });
            this._sortedWords.push({ word: this._words[2], guessed: false });
        } else if (this._currentLevel % 3 === 2) {
            this._sortedWords.push({ word: this._words[3], guessed: false });
            this._sortedWords.push({ word: this._words[4], guessed: false });
            this._sortedWords.push({ word: this._words[5], guessed: false });
            this._sortedWords.push({ word: this._words[6], guessed: false });
            this._sortedWords.push({ word: this._words[7], guessed: false });
            this._sortedWords.push({ word: this._words[8], guessed: false });
            this._sortedWords.push({ word: this._words[1], guessed: false });
            this._sortedWords.push({ word: this._words[2], guessed: false });
            this._sortedWords.push({ word: this._words[9], guessed: false });
            this._sortedWords.push({ word: this._words[0], guessed: false });
        } else {
            this._sortedWords.push({ word: this._words[4], guessed: false });
            this._sortedWords.push({ word: this._words[2], guessed: false });
            this._sortedWords.push({ word: this._words[3], guessed: false });
            this._sortedWords.push({ word: this._words[5], guessed: false });
            this._sortedWords.push({ word: this._words[0], guessed: false });
            this._sortedWords.push({ word: this._words[1], guessed: false });
        }
        console.log('sorted words: ');
        console.log(this._sortedWords);
    }

    _calcCoordinates(): void {
        this._coordinatesMap = [];
        switch (this.availableLettersInHTML.length) {
            case (1): {
                this._coordinatesMap.push({
                    x: '-25px',
                    y: '-25px',
                });
                break;
            }
            case (2): {
                this._coordinatesMap.push({
                    x: '25px',
                    y: '-25px',
                });
                this._coordinatesMap.push({
                    x: '-75px',
                    y: '-25px',
                });
                break;
            }
            case (3): {
                this._coordinatesMap.push({
                    x: '-25px',
                    y: '-75px',
                });
                this._coordinatesMap.push({
                    x: '18px', // -25 (center) + 43 (katet)
                    y: '0px', // -25(center) + 25(from center to side if triangle)
                });
                this._coordinatesMap.push({
                    x: '-68px', // -25 (center) - 43 (katet)
                    y: '0px', // -25(center) + 25(from center to side of triangle)
                });
                break;
            }
            case (4): {
                this._coordinatesMap.push({
                    x: '-25px',
                    y: '-75px',
                });
                this._coordinatesMap.push({
                    x: '25px',
                    y: '-25px',
                });
                this._coordinatesMap.push({
                    x: '-25px',
                    y: '25px',
                });
                this._coordinatesMap.push({
                    x: '-75px',
                    y: '-25px',
                });
                break;
            }
            case (5): {
                this._coordinatesMap.push({
                    x: '0', // 0
                    y: '-100px', // -50 *2
                });
                this._coordinatesMap.push({
                    x: '96px', // +47.55 right *2 = 96
                    y: '-31px', // -15.45 up *2 = -31
                });
                this._coordinatesMap.push({
                    x: '59px', // + 29,39 *2 = 59
                    y: '81px', // + 40,45 *2 = 81
                });
                this._coordinatesMap.push({
                    x: '-59px', // - 29,39 *2 = -59
                    y: '81px', // + 40,45 *2 = 81
                });
                this._coordinatesMap.push({
                    x: '-96px', // - 47.55 *2 = -96
                    y: '-31px', // - 15.45 *2 = -31
                });
                break;
            }
            case (6): {
                this._coordinatesMap.push({
                    x: '50px', // +25 *2 = 50
                    y: '-86px', // -43 *2 = -86
                });
                this._coordinatesMap.push({
                    x: '100px', // +50 *2 = 100
                    y: '0px', // 0
                });
                this._coordinatesMap.push({
                    x: '50px', // +25 *2 = 50
                    y: '86px', // +43 *2 = 86
                });
                this._coordinatesMap.push({
                    x: '-50px', // -25 *2 = -50
                    y: '86px', // +43 *2 = 86
                });
                this._coordinatesMap.push({
                    x: '-100px', // -50 *2 = -100
                    y: '0px', // 0
                });
                this._coordinatesMap.push({
                    x: '-50px', // -25 *2 = -50
                    y: '-86px', // -43 *2 = -86
                });
                break;
            }
            case (7): {
                this._coordinatesMap.push({
                    x: '0', // +25 *2 = 50
                    y: '-100px', // -43 *2 = -86
                });
                this._coordinatesMap.push({
                    x: '84px', // +25 *2 = 50
                    y: '-65px', // -43 *2 = -86
                });
                this._coordinatesMap.push({
                    x: '100px', // +50 *2 = 100
                    y: '27px', // 0
                });
                this._coordinatesMap.push({
                    x: '45px', // +25 *2 = 50
                    y: '95px', // +43 *2 = 86
                });
                this._coordinatesMap.push({
                    x: '-45px', // -25 *2 = -50
                    y: '95px', // +43 *2 = 86
                });
                this._coordinatesMap.push({
                    x: '-100px', // -50 *2 = -100
                    y: '27px', // 0
                });
                this._coordinatesMap.push({
                    x: '-84px', // -25 *2 = -50
                    y: '-65px', // -43 *2 = -86
                });
                break;
            }
        }
        this._arrangeLettersOnCircle();
    }

    _arrangeLettersOnCircle(): void {
        this._lettersWithLayout = [];
        this.availableLettersInHTML.forEach((item: AvailableLetter, index) => {
            this._lettersWithLayout.push({
                letter: item,
                coordinates: this._coordinatesMap[index]
            })
        });

        // this function gets previous state of html, so I call it in ngAfterViewInit
        // this._getCoordinatesOfAvailableLetters();
    }

    _setAvailableLetters(): void {
        this._initWords.forEach((wordLikeString: string) => {
            let wordLikeArray: Array<string> = wordLikeString.split('');
            wordLikeArray.forEach((letter: string, index: number) => {

                let numberOfLettersInAvailableLetters: number = this.availableLetters.join('').split(letter).length - 1;
                let numberOfCurrentLettersInCurrentWord: number = wordLikeString.split(letter).length - 1;

                if (!this.availableLetters.includes(letter)) {
                    this.availableLetters.push(letter);
                } else if (numberOfCurrentLettersInCurrentWord > numberOfLettersInAvailableLetters) {
                    this.availableLetters.push(letter);
                }
            });
        });
        console.log('availableLetters');
        console.log(this.availableLetters);

        this._randomizeOrderOfAvailableLetters();
    }

    _randomizeOrderOfAvailableLetters(): void {
        const numberOfAvailableLetters: number = this.availableLetters.length;
        this.availableLettersInHTML = [];
        this._indexNumberForAvailableLettersInHTML = 0;
        this._randomizeRecursion(numberOfAvailableLetters);
    }

    _randomizeRecursion(numberOfAvailableLetters: number): void {
        if (numberOfAvailableLetters > 0) {
            let randomIndex = Math.floor(Math.random() * numberOfAvailableLetters);
            this.availableLettersInHTML.push({
                id: this._indexNumberForAvailableLettersInHTML,
                value: this.availableLetters[randomIndex],
            });
            this._indexNumberForAvailableLettersInHTML++;
            this.availableLetters.splice(randomIndex, 1);
            this._randomizeRecursion(numberOfAvailableLetters - 1);
        } else {
            return;
        }
    }

    _onLetterClick(letter: AvailableLetter): void {
        this._isWordEnteringNow = true;
        console.log(letter);
        this._enteringWord.push(letter);

        // TODO fix this walk around) need to call this function after view init on second level
        if (this._currentLevel > 1) {
            this._getCoordinatesOfAvailableLetters();
        }
    }

    _onLetterHover(letter: AvailableLetter): void {
        console.log("letter hovered");
        if (this._isWordEnteringNow) {
            let isLetterChecked: boolean = false;
            let isLastCheckedLetter: boolean = false;
            this._enteringWord.forEach((letterInEnteringWord: AvailableLetter) => {
                if (letterInEnteringWord.id === letter.id) {
                    isLetterChecked = true;
                }
            });

            if (isLetterChecked) {
                if (this._enteringWord.length > 1 && letter.id === this._enteringWord[this._enteringWord.length - 2].id) {
                    this._enteringWord.pop();
                }
            } else {
                console.log(letter);
                this._enteringWord.push(letter);
            }
        }
    }

    _onTouchMove(event: TouchEvent) {
        // console.log(event);
        console.log(event.touches[0]);
        const clientX: number = event.touches[0].clientX;
        const clientY: number = event.touches[0].clientY;
        // console.log(clientX, clientY);
        // fixed: set coordinated in ts file and check them +-30px in this function

        // let rect = this.rects;
        // console.log(rect.top, rect.right, rect.bottom, rect.left);
        //
        // if (clientX > rect.left && clientX < rect.right && clientY > rect.top && clientY < rect.bottom ) {
        //     this._onLetterHover(this.availableLettersInHTML[0]);
        // }

        this.rects.forEach((item: RectWithLetterLayout, index: number) => {
            if (clientX > item.rect.left && clientX < item.rect.right && clientY > item.rect.top && clientY < item.rect.bottom ) {
                this._onLetterHover(this._lettersWithLayout[index].letter);
            }
        });

        // if (this._lettersWithLayout.length === 5) {
        //     // 227 447   0
        //     if (clientX > (227 - 30) && clientX < (227 + 30) && clientY > (447 - 30) && clientY < (447 + 30) ) {
        //         this._onLetterHover(this.availableLettersInHTML[0]);
        //     }
        //
        //     // 322 518   1
        //     if (clientX > (322 - 30) && clientX < (322 + 30) && clientY > (518 - 30) && clientY < (518 + 30) ) {
        //         this._onLetterHover(this.availableLettersInHTML[1]);
        //     }
        //
        //     // 285 628   2
        //     if (clientX > (285 - 30) && clientX < (285 + 30) && clientY > (628 - 30) && clientY < (628 + 30) ) {
        //         this._onLetterHover(this.availableLettersInHTML[2]);
        //     }
        //
        //     // 167 629   3
        //     if (clientX > (167 - 30) && clientX < (167 + 30) && clientY > (629 - 30) && clientY < (629 + 30) ) {
        //         this._onLetterHover(this.availableLettersInHTML[3]);
        //     }
        //
        //     // 131 518   4
        //     if (clientX > (131 - 30) && clientX < (131 + 30) && clientY > (518 - 30) && clientY < (518 + 30) ) {
        //         this._onLetterHover(this.availableLettersInHTML[4]);
        //     }
        // }
    }

    _checkWord(): void {
        console.log('mouse up');
        console.log(this._enteringWord);

        let enteringWord: Array<string> = [];
        this._enteringWord.forEach((letter: AvailableLetter) => {
            enteringWord.push(letter.value);
        })

        this._initWords.forEach((word: string) => {
           if (word === enteringWord.join('')) {
                const index: number = this._sortedWords.findIndex(obj => obj.word?.join('') === word);
                this._sortedWords[index].guessed = true;

                this._saveProgress();

                let isSomeWordStillNotGuessed: boolean = false;
                this._sortedWords.forEach((word) => {
                    if (word.guessed === false) {
                        isSomeWordStillNotGuessed = true;
                        return;
                    }
                });

                if (!isSomeWordStillNotGuessed) {
                    this._isPreviewOfLevel = true;
                }

           }
        });

        this._enteringWord = [];
        this._isWordEnteringNow = false;

    }

    _saveProgress(): void {
        console.log("localStorage");
        console.log(localStorage);
        localStorage.setItem('currentLevel', JSON.stringify(this._currentLevel));
        localStorage.setItem('words', JSON.stringify(this._sortedWords));
    }

    _startNewLevel(): void {
        this._isPreviewOfLevel = false;
        this._currentLevel++;
        localStorage.setItem('currentLevel', this._currentLevel.toString());
        localStorage.removeItem('words');
        this._startLevel();
    }

}
