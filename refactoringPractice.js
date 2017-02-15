console.log('JS loaded');

$(() => {
  // Create and implement a grid
  const width = 12;
  const height = 20;
  const numberOfGrids = width*height;

  const $gameboard = $('.gameboard');
  for (var i = 0; i < numberOfGrids; i++) {
    var $gridblock = $('<div>', {'class': 'gridblock'});
    $gameboard.append($gridblock);
  }
  const $allGrids = $('div.gridblock');

  // Initialize stuff
  let rotationIndex = 0;
  let currentRotation = [];
  let index = Math.floor((width-1)/2);    //start dropping from middle of board
  const dropping = setInterval(letsPlay, 200);

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
  let randomShapeName = shapeNames[Math.floor(Math.random() * shapeNames.length)];
  let rotationIndices = spawnPiece(randomShapeName, index);

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
    // clear previous location of moving piece
    $allGrids.removeClass('movingPiece');
    // update currentRotation
    currentRotation = rotationIndices[rotationIndex];
    for (var p = 0; p < currentRotation.length; p++) {
      $allGrids.eq(currentRotation[p]).addClass('movingPiece');
    }
    $allGrids.removeClass('movingPiece');
  }

  function isSquareFull(element) {
    return element === true;
  }

  function nextRowFull(){
    const occ = [];
    for (var g = 0; g < currentRotation.length; g++) {
      occ.push($allGrids.eq(currentRotation[g]+width).hasClass('occupied'));
    }
    if (occ.some(isSquareFull)) {
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
      if (isRowFull.every(isSquareFull)) {
        // let l = $allGrids.length;
        let l = thisArray[thisArray.length-1];
        while (l > width) {
          var classToChangeTo = $allGrids.eq(l-width).attr('class');
          // console.log($allGrids.eq(l-width).attr('class'));
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
      alert('Game over');
    }, 500);
  }

  function letsPlay(){
    updateLocation();

    // GO DOWN ONE ROW
    // PREVIOUS ATTEMPT //
    // for (var g = 0; g < currentRotation.length; g++) {
    //   currentRotation[g]+=width;  // console.log('move one down');
    //   // index+=width;  // console.log('move one down');
    // }
    // console.log(rotationIndices);
    if (canGoDown()) {
      index+=width;
      updateLocation();
    } else {
      occupySquares();
      getNewPiece();
      clearRowShiftDown();
    }
    //if top row is filled, end game
    //otherwise, occupy
    if (Math.min.apply(Math, currentRotation) < width) {
      endGame();
    } else {                // if next row is occupied
      index = Math.floor((width-1)/2);
      // $allGrids.eq(currentRotation[y]).addClass('occupied');
      occupySquares();
      getNewPiece();
    }
  }

  //  LISTENERS FOR ARROW KEYS  //
  $(this).keydown((e) => {          // should bind?
    // if (e.which === 37 && checkLeft ) {   //while index is not the left-most div
    if ( e.which === 37 && canGoLeft() ) {   //while index is not the left-most div
      for (var b = 0; b < currentRotation.length; b++) {
        currentRotation[b]-=1;
        // rotationIndices.forEach( (m, i, a) => {
        //   i.forEach( (m, i, a) => {
        //     a[i]-=1;
        //   });
        //   console.log(index);
        // });


        // rotationIndices[b][b]-=1;
        // rotationIndices[g][b] -= 1;
      }

    // } else if (e.which === 39  &&  index % width !== width - 1 ) {  //while index is not the right-most div
    } else if ( e.which === 39 && canGoRight() ) {  //while index is not the right-most div
      for (var u = 0; u < currentRotation.length; u++) {
        currentRotation[u]+=1;
      }
    } else if ( e.which === 40 ) {    //move one rown down
      for (var p = 0; p < currentRotation.length; p++) {
        currentRotation[p]+=2*width;
      }
    } else if ( e.which === 87 ) { // w
      rotationIndex++;
      rotationIndex = rotationIndex % rotationIndices.length;
    } else if ( e.which === 81 ) {
      rotationIndex--;
      if (rotationIndex < 0) {
        rotationIndex = rotationIndices.length-1;
      } else {
        rotationIndex = rotationIndex % rotationIndices.length;
      }
    }
  });

});
