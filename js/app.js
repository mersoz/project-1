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
  const dropping = setInterval(dropPiece, 200);

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

  function dropPiece(){
    // console.log('dropping');
    currentRotation = rotationIndices[rotationIndex];
    // clear previous location of moving piece and
    $allGrids.removeClass('movingPiece');
    for (var p = 0; p < currentRotation.length; p++) {
      $allGrids.eq(currentRotation[p]).addClass('movingPiece');
    }


    function canGoDown() { //when not on bottom row
      return currentRotation.every((index) => {
        return index < numberOfGrids - width;
      });
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

    //GO DOWN ONE ROW
    if (canGoDown() && !nextRowFull()) {
      index+=width;
      for (var g = 0; g < currentRotation.length; g++) {
        currentRotation[g]+=width;  // console.log('move one down');
        // index+=width;  // console.log('move one down');
      }
      // console.log(rotationIndices);

    } else {                  //if on top row and next row is not occupied
      for (var y = 0; y < currentRotation.length; y++) {
        $allGrids.eq(currentRotation[y]).addClass('occupied');
        randomShapeName = shapeNames[Math.floor(Math.random() * shapeNames.length)];
        rotationIndices = spawnPiece(randomShapeName, index); //NEW SHAPE
        rotationIndex = 0;
      }

      checkRemoveFullRowsDropAll();

      if (Math.min.apply(Math, currentRotation) < width) {      // end game if on top row
        //--> should clearInterval before new piece ?
        $allGrids.removeClass('movingPiece');
        clearInterval(dropping);
        setTimeout( () => {
          alert('Game over');
        }, 500);
      } else {                // if next row is occupied
        index = Math.floor((width-1)/2);
        randomShapeName = shapeNames[Math.floor(Math.random() * shapeNames.length)];
        rotationIndices = spawnPiece(randomShapeName, index);
        rotationIndex = 0;
      }
    }

    function isSquareFull(element) {
      return element === true;
    }

    function checkRemoveFullRowsDropAll() {
      arrayOfRows.forEach( (thisArray) => {
        var isRowFull = thisArray.map( (indexNumber) => {
          // console.log(thisArray);
          return $allGrids.eq(indexNumber).hasClass('occupied');
        }); //returns array of true and false

//======= potential glitch: when two non-adjacent rows are cleared, the mid-not-full row will probably clear as well ==//
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

  // Listeners for arrow keys
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
