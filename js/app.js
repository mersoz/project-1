console.log('JS loaded');

$(() => {
  // Create and implement a grid
  const $gameboard = $('.gameboard');
  const width = 12;
  const height = 20;
  const numberOfGrids = width*height;
  let index = Math.floor((width-1)/2);

  const arrayOfRows = [];   //big array with 20 other arrays
  for ( let initNum = 0; initNum < numberOfGrids; initNum+=width ) {
    // console.log(`Begin array with: ${initNum}`);
    const oneRow = []; //small array with index of each square on row
    for ( let indexOfEach = initNum; indexOfEach < initNum+width; indexOfEach++) {
      oneRow.push(indexOfEach);
    }
    arrayOfRows.push(oneRow);
  }
  // console.log(arrayOfRows);

  for (var i = 0; i < numberOfGrids; i++) {
    var $gridblock = $('<div>', {'class': 'gridblock'});
    $gameboard.append($gridblock);
  }

  const $allGrids = $('div.gridblock');

  //start dropping from middle of board
  //drop piece one row down every second
  const dropping = setInterval(dropPiece, 100);
  function dropPiece(){
    var indices = spawnPiece();
    // console.log(`Moving piece is on index: ${index}`);
    // clear previous location of moving piece and
    $allGrids.removeClass('movingPiece');
    for (var p = 0; p < indices.length; p++) {
      $allGrids.eq(indices[p]).addClass('movingPiece');
    }

    //if next row is not occupied, move one down
    if (index < numberOfGrids-width && !$allGrids.eq(index+width).hasClass('occupied')) {
      index += width;         // console.log('move one down');
    } else {                  //if on top row and next row is not occupied
      for (var g = 0; g < indices.length; g++) {
        $allGrids.eq(indices[g]).addClass('occupied');
      }

      // $allGrids.eq(index).addClass('occupied');
      checkRemoveFullRowsDropAll();

      if (index<width) {      // if on top row
        //end game when top row is occupied
        //--> should clearInterval before new piece ?
        $allGrids.removeClass('movingPiece');
        // console.log('end game');

        clearInterval(dropping);
      } else {                // if next row is occupied
        // console.log('next div full OR reached last row');
        // console.log(index);
        index = Math.floor((width-1)/2);
      }
    }

    function spawnPiece() {
      const shapesAvailable = {
        I: [index, index+width, index+(2*width), index+(3*width)],
        O: [index, index+1, index+width+1, index+width],
        T: [index, index+width+1, index+width, index+width-1],
        L: [index, index+width, index+(2*width), index+(2*width)+1],
        J: [index, index+width, index+(2*width), index+(2*width)-1],
        S: [index, index+1, index+width, index+width-1],
        Z: [index, index-1, index+width, index+width+1]
      };
      //return random property
      return shapesAvailable['S'];
    }

    function checkRemoveFullRowsDropAll() {
      arrayOfRows.forEach( (thisArray) => {
        var isRowFull = thisArray.map( (indexNumber) => {
          return $allGrids.eq(indexNumber).hasClass('occupied');
        }); //returns array of true and false

        function isSquareFull(element) {
          return element === true;
        }

        if (isRowFull.every(isSquareFull)) {
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
  //add event listener to window (this) to handle user keystrokes
  //or should bind?
  $(this).keydown((e) => {
    // console.log(e.which);
    // left 37
    if (e.which === 37 && index % width !== 0 ) {           // LEFT
      //while index is not the left-most div
      index-=1;
    } else if (e.which === 39 && index % width !== width - 1 ) {    // RIGHT
      //while index is not the right-most div
      index+=1;
    } else if (e.which === 40) {    // DOWN
      index+=width;
    }
  // up 38 - turn shape

  });
});
