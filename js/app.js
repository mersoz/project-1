console.log('JS loaded');

$(() => {
  // Create and implement a grid
  const $gameboard = $('.gameboard');
  const width = 12;
  const height = 20;
  const numberOfGrids = width*height;

  //
  const arrayOfRows = [];   //big array with 20 other arrays

  for ( let initNum = 0; initNum < numberOfGrids; initNum+=width ) {
    console.log(`Begin array with: ${initNum}`);
    const oneRow = []; //small array with index of each square on row
    for ( let indexOfEach = initNum; indexOfEach < initNum+width; indexOfEach++) {
      oneRow.push(indexOfEach);
    }
    arrayOfRows.push(oneRow);
  }
  console.log(arrayOfRows);


  for (var i = 0; i < numberOfGrids; i++) {
    var $gridblock = $('<div>', {'class': 'gridblock'});
    $gameboard.append($gridblock);
  }

  const $allGrids = $('div.gridblock');
  let index = Math.floor((width-1)/2);

  //start dropping from middle of board
  //drop piece one row down every second
  const dropping = setInterval(dropPiece, 100);
  function dropPiece(){
    // console.log(`Moving piece is on index: ${index}`);
    //  clear previous location of moving piece and
    $allGrids.removeClass('movingPiece');
    $allGrids.eq(index).addClass('movingPiece');
    //if next row is not occupied, move one down

    if (index < numberOfGrids-width && !$allGrids.eq(index+width).hasClass('occupied')) {
      // console.log('move one down');
      index += width;
    } else {                  //if on top row and next row is not occupied
      if (index<width) {      // if on top row
        //end game when top row is occupied
        //--> should clearInterval before new piece ?
        $allGrids.eq(index).addClass('occupied');
        console.log('end game');
        clearInterval(dropping);
      } else {                // if next row is occupied
        console.log('next div full OR reached last row');
        console.log(index);
        $allGrids.eq(index).addClass('occupied');
        // function to check for full row


        index = Math.floor((width-1)/2);
      }

    }
  }


  //add event listener to window (this) to handle user keystrokes
  //or should bind?
  $(this).keydown((e) => {
    console.log(e.which);
    // left 37
    if (e.which === 37) {           // LEFT
      index-=1;
    } else if (e.which === 39) {    // RIGHT
      index+=1;
    } else if (e.which === 40) {    // DOWN
      index+=width;
    }
    // up 38 - turn shape
    // down 40 -
  });

// //check if on last row
// if (index > numberOfGrids-height) {
//   clearInterval(dropping);
//   }
//   setTimeout(() => {
//     dropping = setInterval(dropPiece, 1000);
//   }, 1000);
// }





  // for (i = 0; i<12; i++) {
  //   setInterval(() => {
  //   }, 1000)
  // }

  // Implement a generic (base) class for the shapes
    // add a class for the single square shape
    // add a class for the block square shape
    // add a class for the long shape
    // add a class for the twisted shape
    // add a class for the three-way shape
    // Make the shapes move across the grid

  // Give some restrictions to the shapes movement

});
