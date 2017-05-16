$(() => {
  // Initialize grid and create board
  const column_count = 12;
  const row_count = 20;
  const grid_count = column_count*row_count;
  const $gameboard = $('.gameboard');

  for (var h = 0; h < row_count; h++) {
    for (var w = 0; w < column_count; w++) {
      var $gridblock = $('<div>', {'class': 'gridblock'});
      $gameboard.append($gridblock);
    }
    var $breakline = $('<br>');
    $gameboard.append($breakline);
  }

  // DOM variables
  const themeSong = document.getElementById('themeSong');
  const smackThat = document.getElementById('smackThat');

  const $allGrids = $('div.gridblock');
  const $sidebar = $('div.sidebar');
  const $scoreDisplay = $('span.score');
  const $highScore = $('span.highscore');

  const $landing = $('div.landing');
  const $instructions = $('div.landing > div.instructions');

  const $play = $('button.startGame');
  const $pause = $('button.pause');
  const $mute = $('button.mute');

  // Initialize gameplay variables
  let rotationIndex = 0;
  let currentRotation = [];
  let index = Math.floor((column_count-1)/2);    //start dropping from middle of board
  let dropping = null;
  let score = 0;
  let paused = true;
  let muted = false;

  var $gridblockColor = $('.gridblock').css('background-color');
  var highscore = localStorage.getItem('highscore');
  $scoreDisplay.html(score);
  $highScore.html(highscore);

  themeSong.play();

  // Create an array for each rown with indexes
  //  Push each array into another for all arrays/rows
  const arrayOfRows = [];   //big array with 20 other arrays
  for ( let initNum = 0; initNum < grid_count; initNum+=column_count ) {
    const oneRow = []; //small array with index of each square on row
    for ( let indexOfEach = initNum; indexOfEach < initNum+column_count; indexOfEach++) {
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

  function resetGame() {
    $allGrids.removeClass('movingPiece').removeClass('occupied');
    $.each($allGrids, (index) => {
      $allGrids.eq(index)
      .html('')
      .css('background-color', $gridblockColor)
      .css('border', '1px solid grey');
    });
    score = 0;
    $scoreDisplay.html(score);
  }

  function spawnPiece(name, index) {
    var shapesAvailable = {
      O: [[index, index+column_count, index+1, index+column_count+1]],

      I: [[index+1, index+column_count+1, index+(2*column_count)+1, index+(3*column_count)+1],
         [index-1, index, index+1, index+2]],

      S: [[index+1, index+2, index+column_count, index+column_count+1],
         [index, index+column_count, index+column_count+1, index+(2*column_count)+1]],

      Z: [[index, index+1, index+column_count+1, index+column_count+2],
         [index+1, index+column_count, index+column_count+1, index+(2*column_count)]],

      L: [[index+1, index+column_count+1, index+(2*column_count)+1, index+(2*column_count)+2],
         [index+column_count, index+column_count+1, index+column_count+2, index+(2*column_count)],
         [index+1, index+2, index+column_count+2, index+(2*column_count)+2],
         [index+column_count, index+column_count+1, index+column_count+2, index+2]],

      J: [[index+2, index+column_count+2, index+(2*column_count)+1, index+(2*column_count)+2],
         [index+column_count, index+(2*column_count), index+(2*column_count)+1, index+(2*column_count)+2],
         [index+1, index+2, index+column_count+1, index+(2*column_count)+1],
         [index+column_count, index+column_count+1, index+column_count+2, index+(2*column_count)+2]],

      T: [[index+1, index+column_count, index+column_count+1, index+column_count+2],
         [index+1, index+column_count+1, index+column_count+2, index+(2*column_count)+1],
         [index, index+1, index+2, index+column_count+1],
         [index+1, index+column_count, index+column_count+1, index+(2*column_count)+1]]
    };
    return shapesAvailable[name];
  }

  function updateLocation() {
    $allGrids.removeClass('movingPiece');
    currentRotation = rotationIndices[rotationIndex];
    for (var p = 0; p < currentRotation.length; p++) {
      $allGrids.eq(currentRotation[p]).addClass('movingPiece')
      .html('B')
      .css('background-color', shapeColors[randomShapeName])
      .css('border', "4px outset" + shapeColors[randomShapeName]);
    }

    $.each($allGrids, (index) => {
      if (!$allGrids.eq(index).hasClass('movingPiece') && !$allGrids.eq(index).hasClass('occupied')) {
        $allGrids.eq(index)
        .html('')
        .css('background-color', 'lightgrey')
        .css('border', '1px solid grey');
      }
    });
  }

  function isTrue(element) {
    return element === true;
  }

  function nextRowFull(){
    const occ = [];
    for (var g = 0; g < currentRotation.length; g++) {
      occ.push($allGrids.eq(currentRotation[g]+column_count).hasClass('occupied'));
      // occ.push($allGrids.eq(currentRotation[g]+(2*column_count).hasClass('occupied'));
    }
    if (occ.some(isTrue)) {
      return true;
    }
  }

  function canGoDown() { //when not on bottom row
    if (!nextRowFull()) {
      return currentRotation.every((index) => {
        return index < grid_count - column_count;
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
      return index % column_count !== 0;
    });
  }

  function canGoRight() {
    for (var l = 0; l < currentRotation.length; l++) {   //check for occupied one left (index-1)
      if ($allGrids.eq(currentRotation[l]+1).hasClass('occupied')) {
        return false;
      }
    }
    return currentRotation.every((index) => {  //hightest value
      return index % column_count !== column_count - 1;
    });
  }

  function canSpeedDown() {
    for (var l = 0; l < currentRotation.length; l++) {   //check for occupied one left (index-1)
      if ($allGrids.eq(currentRotation[l]+column_count).hasClass('occupied')) {
        return false;
      }
    }
    return currentRotation.every((index) => {
      return index + column_count < grid_count;
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

  function clearRowShiftDown() {
    arrayOfRows.forEach( (thisArray) => {
      var isRowFull = thisArray.map( function(indexNumber) {
        return $allGrids.eq(indexNumber).hasClass('occupied');
      }); //returns array of true and false
      if (isRowFull.every(isTrue)) {
        score+=column_count;
        $scoreDisplay.html(score);
        if (score > highscore) {
          localStorage.setItem('highscore', score );
        }
        let l = thisArray[thisArray.length-1];
        while (l > column_count) {
          var colorToChangeTo = $allGrids.eq(l-column_count).css('background-color');
          var borderToChangeTo = $allGrids.eq(l-column_count).css('border');
          var textToChangeTo = $allGrids.eq(l-column_count).html();
          var classToChangeTo = $allGrids.eq(l-column_count).attr('class');
          $allGrids.eq(l).html(textToChangeTo);
          $allGrids.eq(l).css('background-color', colorToChangeTo);
          $allGrids.eq(l).css('border', borderToChangeTo);
          $allGrids.eq(l).attr('class', classToChangeTo);
          l--;
        }
        $highScore.html(localStorage.getItem('highscore'));
        if (!muted) {
          themeSong.pause();
          smackThat.play();
          setTimeout( () => {
            themeSong.play();
          }, 3000);
        }
      }
    });
  }

  function endGame() { //if on topRow
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
      updateIndices(column_count);
    } else {
      occupySquares();
      getNewPiece();
      clearRowShiftDown();
      index = Math.floor((column_count-1)/2);
    }
    if (Math.min.apply(Math, currentRotation) < column_count) {
      if(highscore !== null){
        if (score > highscore) {
          localStorage.setItem('highscore', score );
        }
      } else {
        localStorage.setItem('highscore', score );
      }
      console.log(highscore);
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
      return each%column_count;
    });
    var max = Math.max.apply(Math, moduloArray);
    var min = Math.min.apply(Math, moduloArray);
    if (max === column_count-1 && min === 0) {
      if (moduloArray.includes(1)) {
        if (moduloArray.includes(column_count-2)) {
          updateIndices(-2);
        } else {
          updateIndices(1);
        }
      } else if (moduloArray.includes(column_count-2)) {
        updateIndices(-1);
      }
    }
  }

  function pauseController() {
    $pause.text(function(i, text){
      return text === 'Pause' ? 'Resume' : 'Pause';
    });
    if (paused) {
      paused = false;
      dropping = setInterval( () => {
        letsPlay();
      }, 400);
    } else {
      paused = true;
      clearInterval(dropping);
    }
  }

  function musicController() {
    $mute.text(function(i, text){
      return text === 'Mute' ? 'Unmute' : 'Mute';
    });
    if (themeSong.paused) {
      themeSong.play();
      muted = false;
    } else {
      themeSong.pause();
      muted = true;
    }
  }

  //    LISTENERS   //
  $play.on('click', (e) => {
    $landing.animate({
      top: '4%'
    });
    $instructions.animate({
      opacity: '0'
    });
    setTimeout( () => {
      $instructions.css('display', 'none');
    }, 200);

    setTimeout( () => {
      $gameboard.removeClass('blur');
      $sidebar.removeClass('blur');
    }, 600);
    resetGame();
    paused = false;
    if (!paused) {
      setTimeout( () => {
        dropping = setInterval( () => {
          letsPlay();
        }, 400);
      }, 1000);
    }
  });

  $pause.on('click', () => {
    pauseController();
  });

  $mute.on('click', () => {
    musicController();
  });

  $(this).keydown((e) => {        // should bind?
    if ( e.which === 37 && canGoLeft() ) {   //while index is not the left-most div
      updateIndices(-1);
    } else if ( e.which === 39 && canGoRight() ) {  //while index is not the right-most div
      updateIndices(1);
    } else if ( e.which === 40 && canSpeedDown() ){    //move one rown down
      // e.preventDefault();
      updateIndices(column_count);
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
    } else if ( e.which === 77 ) {  // M
      musicController();
    } else if ( e.which === 80 ) {  // P
      pauseController();
    }
  });
});
