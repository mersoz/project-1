console.log('JS loaded');

$(() => {
  // Create and implement a grid
  const $gameboard = $('.gameboard');
  const numberOfGrids = 12;

  for (var i = 0; i<numberOfGrids; i++) {
    var $gridblock = $('<div>', {'class': 'gridblock'});
    $gameboard.append($gridblock);
  }

  const $allGrids = $('div.gridblock');

  let index = 1;
  function dropPiece(){
    console.log(index);
//    while( index < numberOfGrids ){
    $allGrids.removeClass('movingPiece');
    $allGrids.eq(index).toggleClass('movingPiece');
    if (index > numberOfGrids-4) {
      console.log('reached bottom row');
      clearInterval(dropping);
      index = 0;
    }
    index += 3;
  }

  var dropping = setInterval(dropPiece, 1000);

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

  // Handle the user keystrokes
});
