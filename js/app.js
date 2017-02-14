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
  let initIndices = [];
  let rotationIndices = [];
  let index = Math.floor((width-1)/2);    //start dropping from middle of board
  const dropping = setInterval(dropPiece, 1000);

  // Create an array for each rown with indexes
    // Push each array into another for all arrays/rows
  const arrayOfRows = [];   //big array with 20 other arrays
  for ( let initNum = 0; initNum < numberOfGrids; initNum+=width ) {
    const oneRow = []; //small array with index of each square on row
    for ( let indexOfEach = initNum; indexOfEach < initNum+width; indexOfEach++) {
      oneRow.push(indexOfEach);
    }
    arrayOfRows.push(oneRow);
  }

  function spawnPiece() {
    const shapesAvailable = {

      O: [[index, index+width, index+1, index+width+1]],

      I: [[index, index+width, index+(2*width), index+(3*width)],
         [index, index+1, index+2, index+3]],

      S: [[index+1, index+2, index+width, index+width+1],
         [index, index+width, index+width+1, index+(2*width)+1]],

      Z: [[index, index+1, index+width+1, index+width+2],
         [index+width, index+width, index+width+1, index+(2*width)]],

      L: [[index, index+width, index+(2*width), index+(2*width)+1],
         [index, index+width, index+1, index+2],
         [index, index+1, index+width+1, index+(2*width)+1],
         [index+width, index+width+1, index+width+2, index+2]],

      J: [[index+1, index+width+1, index+(2*width), index+(2*width)+1],
         [index, index+width, index+width+1, index+width+2],
         [index, index+1, index+width, index+(2*width)],
         [index, index+1, index+2, index+width+2]],

      T: [[index+1, index+width, index+width+1, index+width+2],
         [index, index+width, index+width+1, index+(2*width)],
         [index, index+1, index+2, index+width+1],
         [index+1, index+width, index+width+1, index+(2*width)+1]]
    };

    //return random property
    // const arrOfShapeOptions = Object.keys(shapesAvailable);
    // const randomNum = Math.floor( Math.random() * arrOfShapeOptions.length);
    // const randomShape = arrOfShapeOptions[randomNum];
    // return shapesAvailable[randomShape];
    return shapesAvailable['I'];
  }

  function dropPiece(){
    rotationIndices = spawnPiece();
    // rotationIndex = 1;
    initIndices = rotationIndices[rotationIndex];

    // console.log(`Moving piece is on index: ${index}`);
    // clear previous location of moving piece and
    $allGrids.removeClass('movingPiece');
    for (var p = 0; p < initIndices.length; p++) {
      console.log(initIndices);
      $allGrids.eq(initIndices[p]).addClass('movingPiece');
    }
    // console.log(initIndices);

    function nextRowFull(){
      const occ = [];
      for (var g = 0; g < initIndices.length; g++) {
        occ.push($allGrids.eq(initIndices[g]+width).hasClass('occupied'));
      }
      if (occ.some(isSquareFull)) {
        return true;
      }
    }

    function canGoDown() {
    //lowest value when divisible by width
      return initIndices.every((index) => {
        return index < numberOfGrids - width;
      });
    }

    // if (index < numberOfGrids-width && !nextRowFull()) {
    if (canGoDown() && !nextRowFull()) {
      index += width;         // console.log('move one down');
    } else {                  //if on top row and next row is not occupied
      for (var g = 0; g < initIndices.length; g++) {
        $allGrids.eq(initIndices[g]).addClass('occupied');
        console.log('occupy');
        rotationIndex = 0;
      }

      // $allGrids.eq(index).addClass('occupied');
      checkRemoveFullRowsDropAll();

      if (index<width) {      // end game if on top row
        //--> should clearInterval before new piece ?
        $allGrids.removeClass('movingPiece');
        clearInterval(dropping);
      } else {                // if next row is occupied
        index = Math.floor((width-1)/2);
      }
    }

    function isSquareFull(element) {
      return element === true;
    }

    function checkRemoveFullRowsDropAll() {
      arrayOfRows.forEach( (thisArray) => {
        var isRowFull = thisArray.map( (indexNumber) => {
          return $allGrids.eq(indexNumber).hasClass('occupied');
        }); //returns array of true and false
        if (isRowFull.every(isSquareFull)) {
          console.log(isRowFull);
          let l = $allGrids.length;
          while (l > width) {
            var classToChangeTo = $allGrids.eq(l-width).attr('class');
            $allGrids.eq(l).attr('class', classToChangeTo);
            l--;
          }
        }
      });
    }

  }



  function canGoLeft() {
    //check for occupied one left (index-1)
    for (var l = 0; l < initIndices.length; l++) {
      if ($allGrids.eq(initIndices[l]-1).hasClass('occupied')) {
        return false;
      }
    }
    //lowest value when divisible by width
    return initIndices.every((index) => {
      return index % width !== 0;
    });
  }

  function canGoRight() {
    //check for occupied one left (index-1)
    for (var l = 0; l < initIndices.length; l++) {
      if ($allGrids.eq(initIndices[l]+1).hasClass('occupied')) {
        return false;
      }
    }  //lowest value when divisible by width
    return initIndices.every((index) => {
      return index % width !== width - 1;
    });
  }

  // Listeners for arrow keys
  $(this).keydown((e) => {          // should bind?
    // if (e.which === 37 && checkLeft ) {   //while index is not the left-most div
    if ( e.which === 37 && canGoLeft() ) {   //while index is not the left-most div
      index-=1;
    // } else if (e.which === 39  &&  index % width !== width - 1 ) {  //while index is not the right-most div
    } else if ( e.which === 39 && canGoRight() ) {  //while index is not the right-most div
      index+=1;
    } else if ( e.which === 40 ) {    //move one rown down
      index+=2*width;
    } else if ( e.which === 38 ) {
      rotationIndex++;
      // console.log(rotationIndices, rotationIndex % rotationIndices.length);
      rotationIndex = rotationIndex % rotationIndices.length;
    }
    // up 38 - turn shape
  });
});
