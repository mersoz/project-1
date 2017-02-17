console.log('JS loaded');

$(() => {
  // Create and implement a grid
  const width = 12;
  const height = 20;
  const numberOfGrids = width*height;

  // const $scoreboard = $('.scoreboard');
  const $score = $('.score');
  const $gameboard = $('.gameboard');
  const $sidebar = $('.sidebar');
  for (var i = 0; i < numberOfGrids; i++) {
    var $gridblock = $('<div>', {'class': 'gridblock'});
    $gameboard.append($gridblock);
  }
  const $allGrids = $('div.gridblock');
  const $play = $('.startGame');
  const $pause = $('.pause');
  const $mute = $('.mute');

  // Initialize stuff
  let rotationIndex = 0;
  let currentRotation = [];
  let index = Math.floor((width-1)/2);    //start dropping from middle of board
  let dropping = null;
  let score = 0;
  let paused = true;
  $score.html(score);

  // Create an array for each rown with indexes
  //  Push each array into another for all arrays/rows
  const arrayOfRows = [];   //big array with 20 other arrays
  for ( let initNum = 0; initNum < numberOfGrids; initNum+=width ) {
    const oneRow = []; //small array with index of each square on row
    for ( let indexOfEach = initNum; indexOfEach < initNum+width; indexOfEach++) {
      oneRow.push(indexOfEach);
    }
    arrayOfRows.push(oneRow);
  }

  const shapeNames = ['O', 'I', 'S', 'Z', 'L', 'J', 'T'];
  const shapeColors = {
    'O': '#ff6961',
    'I': '#ffb347',
    'S': '#fcfc4b',
    'Z': '#77dd77',
    'L': '#8bcde5',
    'J': '#b19cd9',
    'T': '#ff9eb5'
  };

  let randomShapeName = shapeNames[Math.floor(Math.random() * shapeNames.length)];
  let rotationIndices = spawnPiece(randomShapeName, index);

  function reSetGame() {
    $allGrids.removeClass('movingPiece').removeClass('occupied');
    $.each($allGrids, (index) => {
      $allGrids.eq(index).css('background-color', 'lightgrey');
    });
    score = 0;
  }

  function spawnPiece(name, index) {
    var shapesAvailable = {
      O: [[index, index+width, index+1, index+width+1]],

      I: [[index, index+width, index+(2*width), index+(3*width)],
         [index-1, index, index+1, index+2]],

      S: [[index+1, index+2, index+width, index+width+1],
         [index, index+width, index+width+1, index+(2*width)+1]],

      Z: [[index, index+1, index+width+1, index+width+2],
         [index+1, index+width, index+width+1, index+(2*width)]],

      L: [[index+1, index+width+1, index+(2*width)+1, index+(2*width)+2],
         [index+width, index+width+1, index+width+2, index+(2*width)],
         [index+1, index+2, index+width+2, index+(2*width)+2],
         [index+width, index+width+1, index+width+2, index+2]],

      J: [[index+2, index+width+2, index+(2*width)+1, index+(2*width)+2],
         [index+width, index+(2*width), index+(2*width)+1, index+(2*width)+2],
         [index+1, index+2, index+width+1, index+(2*width)+1],
         [index+width, index+width+1, index+width+2, index+(2*width)+2]],

      T: [[index+1, index+width, index+width+1, index+width+2],
         [index+1, index+width+1, index+width+2, index+(2*width)+1],
         [index, index+1, index+2, index+width+1],
         [index+1, index+width, index+width+1, index+(2*width)+1]]
    };
    return shapesAvailable[name];
  }


  function updateLocation() {
    // console.log(randomShapeName);
    $allGrids.removeClass('movingPiece');
    currentRotation = rotationIndices[rotationIndex];
    for (var p = 0; p < currentRotation.length; p++) {
      $allGrids.eq(currentRotation[p]).addClass('movingPiece')
      .css('background-color', shapeColors[randomShapeName]);
    }

    $.each($allGrids, (index) => {
      if (!$allGrids.eq(index).hasClass('movingPiece') && !$allGrids.eq(index).hasClass('occupied')) {
        $allGrids.eq(index).css('background-color', 'lightgrey');
      }
    });
  }

  function isTrue(element) {
    return element === true;
  }

  function nextRowFull(){
    const occ = [];
    for (var g = 0; g < currentRotation.length; g++) {
      occ.push($allGrids.eq(currentRotation[g]+width).hasClass('occupied'));
    }
    if (occ.some(isTrue)) {
      return true;
    }
  }

  function canGoDown() { //when not on bottom row
    if (!nextRowFull()) {
      return currentRotation.every((index) => {
        return index < numberOfGrids - width;
      });
    }
  }

  function canGoLeft() {
    for (var l = 0; l < currentRotation.length; l++) {     //check for occupied one left (index-1)
      if ($allGrids.eq(currentRotation[l]-1).hasClass('occupied')) {
        return false;
      }
    }
    return currentRotation.every((index) => {     //lowest value
      return index % width !== 0;
    });
  }

  function canGoRight() {
    for (var l = 0; l < currentRotation.length; l++) {   //check for occupied one left (index-1)
      if ($allGrids.eq(currentRotation[l]+1).hasClass('occupied')) {
        return false;
      }
    }
    return currentRotation.every((index) => {  //hightest value
      return index % width !== width - 1;
    });
  }

  function occupySquares() {
    for (var y = 0; y < currentRotation.length; y++) {
      $allGrids.eq(currentRotation[y]).addClass('occupied');
    }
  }

  function getNewPiece() {
    randomShapeName = shapeNames[Math.floor(Math.random() * shapeNames.length)];
    rotationIndices = spawnPiece(randomShapeName, index); //NEW SHAPE
    rotationIndex = 0;
  }

//== potential glitch: when two non-adjacent rows are cleared, the mid-not-full row will probably clear as well ==//
  function clearRowShiftDown() {
    arrayOfRows.forEach( (thisArray) => {
      var isRowFull = thisArray.map( function(indexNumber) {
        return $allGrids.eq(indexNumber).hasClass('occupied');
      }); //returns array of true and false
      if (isRowFull.every(isTrue)) {
        score+=width;
        $score.html(score);
        let l = thisArray[thisArray.length-1];
        while (l > width) {
          var colorToChangeTo = $allGrids.eq(l-width).css('background-color');
          var classToChangeTo = $allGrids.eq(l-width).attr('class');
          $allGrids.eq(l).css('background-color', colorToChangeTo);
          $allGrids.eq(l).attr('class', classToChangeTo);
          l--;
        }
      }
    });
  }

  function endGame() { //if on topRow
  //--> should clearInterval before new piece ?
    $allGrids.removeClass('movingPiece');
    clearInterval(dropping);
    setTimeout( () => {
      alert(`Final score: ${score}`);
    }, 500);
  }

  function letsPlay() {
    updateLocation();
    shiftIfCrossingBorder();
    if (canGoDown()) {
      updateIndices(width);
    } else {
      occupySquares();
      getNewPiece();
      clearRowShiftDown();
      index = Math.floor((width-1)/2);
    }
    if (Math.min.apply(Math, currentRotation) < width) {
      endGame();
    }
  }

  function updateIndices(someValue) {
    for (var g = 0; g < rotationIndices.length; g++) {
      rotationIndices[g].forEach(function(element, i, arr) {
        arr[i]+= someValue; //move one down
      });
    }
    updateLocation();
  }

  function shiftIfCrossingBorder() {
    var moduloArray = currentRotation.map( (each) => {
      return each%width;
    });
    var max = Math.max.apply(Math, moduloArray);
    var min = Math.min.apply(Math, moduloArray);
    if (max === width-1 && min === 0) {
      if (moduloArray.includes(1)) {
        if (moduloArray.includes(width-2)) {
          updateIndices(-2);
        } else {
          updateIndices(1);
        }
      } else if (moduloArray.includes(width-2)) {
        updateIndices(-1);
      }
    }
  }

  //  LISTENERS  //
  $play.on('click', (e) => {
    $(e.target).animate({
      top: '4%'
    });
    setTimeout( () => {
      $gameboard.removeClass('blur');
      $sidebar.removeClass('blur');
    }, 600);
    reSetGame();
    paused = false;
    if (!paused) {
      setTimeout( () => {
        dropping = setInterval( () => {
          letsPlay();
        }, 200);
      }, 1000);
    }
  });

  $pause.on('click', (e) => {
    $(e.target).text(function(i, text){
      return text === 'Pause' ? 'Resume' : 'Pause';
    });
    if (paused) {
      paused = false;
      dropping = setInterval( () => {
        letsPlay();
      }, 200);
    } else {
      paused = true;
      clearInterval(dropping);
    }

    $mute.on('click', (e) => {
      $(e.target).text(function(i, text){
        return text === 'Mute' ? 'Unmute' : 'Mute';
      });
    });
  });

  $(this).keydown((e) => {        // should bind?
    if ( e.which === 37 && canGoLeft() ) {   //while index is not the left-most div
      updateIndices(-1);
    } else if ( e.which === 39 && canGoRight() ) {  //while index is not the right-most div
      updateIndices(1);
    } else if ( e.which === 40 ) {    //move one rown down
      e.preventDefault();
      updateIndices(width);
    } else if ( e.which === 87 ) {  // W
      rotationIndex++;
      rotationIndex = rotationIndex % rotationIndices.length;
    } else if ( e.which === 81 ) {  // Q
      rotationIndex--;
      if (rotationIndex < 0) {
        rotationIndex = rotationIndices.length-1;
      } else {
        rotationIndex = rotationIndex % rotationIndices.length;
      }
    }
  });
});

// STYLING
// PLAY/PAUSE BUTTON
// EDGE CASE WITH LINES NOT ADJACENT
// SOUND / MUTE
// DROP TO BOTTOM ON SPACEBAR KEYSTROKE
// SHOW NEXT PIECE ?
// BORDER CONTROL FOR TURNING ON LAST ROWS - shift up one row, or two?
// Bug/feature: WHEN DOWN BUTTON IS HELD DOWN, IT SINKS ONE ROW TOO MANY


// POSSIBLE AUDIO  ?? CHANGE WITH LEVELS?
// Georges Bizet - Prelude to Act I from Carmen
// https://www.youtube.com/watch?v=cvny0Mssa04
//
// Johann Strauss - Auf Der Jagd
// https://www.youtube.com/watch?v=njXfuve1VXs
//
// Aram Khachaturian - Sabre Dance
// https://www.youtube.com/watch?v=gqg3l3r_DRI
//
// Korobeiniki
// https://www.youtube.com/watch?v=2l-yUHo44hc
// from 00:41
//
// Radetzky March, Op. 228 (Strauss I)
// https://www.youtube.com/watch?v=d4AmYBhGBfM
// from 11:57
//
//
//
//
//
//
//
//
//
//
//
//
