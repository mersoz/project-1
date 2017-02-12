console.log('JS loaded');

$(() => {
  // Create and implement a grid
  const $gameboard = $('.gameboard');
  const numberOfGrids = 12;
  const width = 3;
  const height = numberOfGrids/width;

  for (var i = 0; i<numberOfGrids; i++) {
    var $gridblock = $('<div>', {'class': 'gridblock'});
    $gameboard.append($gridblock);
  }

  const $allGrids = $('div.gridblock');






  //start dropping from middle of board
  let index = (width-1)/2;
  //drop piece one row down every second
  const dropping = setInterval(dropPiece, 1000);
  function dropPiece(){
    console.log(`Moving piece is on index: ${index}`);
    //  clear previous location of moving piece and
    $allGrids.removeClass('movingPiece');
    $allGrids.eq(index).addClass('movingPiece');
    //if next row is not occupied, move one down
    if (index < numberOfGrids-height && !$allGrids.eq(index+width).hasClass('occupied')) {
      console.log('move one down');
      index += width;
    } else {
      if (index<width) {
        $allGrids.eq(index).addClass('occupied');
        console.log('end game');
        clearInterval(dropping);
      } else {
        console.log('next div full OR reached last row');
        $allGrids.eq(index).addClass('occupied');
        index = (width-1)/2;
      }
    }
  }

  //add event listener to window (this) to handle user keystrokes
  //or should bind?
  // $(this).keydown((e) => {
  //   alert('hi');
  //   console.log(e.which);
  // });

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
