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



####The build

* HTML 5, CSS and jQuery were used to create this game. 
* The Google Web Font 'Press Start2P' and 'Quicksand' have been used to style the game.


#### Problems & Challenges
Too many to list or remember...








