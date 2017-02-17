# Stack My Bits Up
###GA WDI London - Project 1 
#### It's almost Tetris!

This Tetris variation was created using HTML, CSS, JavaScript/JQuery for Web Development Immersive course at General Assembly London. 

####There are only two rules: 

* Clear lines by filling the whole row
* Don't let it stack up to the top!

[Play it here.](damp-citadel-12920.herokuapp.com)

##Controls
* L/R Arrows = move piece left and right
* Down Arrow = move piece one row down
* W = turn clockwise
* Q = turn counter-clockwise



####Approach / How it works

Current version has 20 rows and 12 columns, so a total of 240 gridblocks. The row and column numbers can be changed in the JavaScript file and the gameboard will work for any combination (I think).

Possible shapes are defined in the JavaScript as well.

![](./screenshots/shapeRotations0.png)

![](./screenshots/shapeRotations1.png)

![](./screenshots/shapeRotations2.png)

Each moving piece is defined by a div (of the whole grid) with a class, which gets moved down one row every .2 seconds. The user uses the left and right arrows to increase/decrease the index by one depending on the direction. 



If the user chooses to input their own word, it is stored in the 'input' variable. The spaces are converted to '/' and the capital letters to lower case. If the user chooses to generate a word, it is randomly picked from an array based on their chosen category, and saved in the 'input' variable. This variable is then split into an array to seperate the letters and symbols.

The letters and hidden word are created dynamically, and once a letter selection is made it is determined whether or not the guess is correct. If a guess is correct, the letter or letters will appear. If a guess is incorrect, one part of the hangman is drawn. If 9 incorrect guesses are made, it is Game Over!

There are sounds that are triggered upon:

1. A correct guess
2. An incorrect guess
3. Game Over
4. A win!
5. Letter rollover
6. Start of the game

####The build

* HTML 5, CSS and jQuery were used to create this game. 
* Animation was created using the Animate.css stylesheet. 
* Soundmanager was used to load the sounds. 
* The Google Web Font 'Arvo' has been used to style the game.



#### Problems & Challenges

The main challenge I faced building this game, was how to link the user guesses with the revealing of correct letters. I needed to select the correct letter div that had the same name or value as the guessed letter. I am pleased with the solution that I came up with. The other challenge I had was how to centre the pop-ups vertically within the setup div, which I eventually achieved using positioning and percentages. 








