13
[144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155]
[false, false, false, false, false, false, false, false, false, false, false, false]
14
[156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167]
[false, false, false, false, false, false, false, false, false, false, false, false]
15
[168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179]
[true, true, false, false, false, false, false, false, false, false, false, false]
16
[180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191]
[true, true, false, false, false, false, false, false, false, false, false, false]
17
[192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203]
[true, true, true, true, true, true, true, true, true, true, true, true]
18
[204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215]
[true, true, true, true, true, true, true, true, true, true, true, true]
19
[216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227]
[true, true, true, true, true, true, true, true, true, true, true, true]
20
[228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239]
[true, true, true, true, true, true, true, true, true, true, true, true]

function checkRemoveFullRowsDropAll() {
  arrayOfRows.forEach( (thisArray) => {
    var isRowFull = thisArray.map( (indexNumber) => {
      return $allGrids.eq(indexNumber).hasClass('occupied');
    }); //returns array of true and false
    console.log(isRowFull);

    if (isRowFull.every(isSquareFull)) {
      isRowFull.some()
      // console.log(isRowFull);
      let l = $allGrids.length;
      while (l > width) {
        var classToChangeTo = $allGrids.eq(l-width).attr('class');
        // console.log($allGrids.eq(l-width).attr('class'));
        $allGrids.eq(l).attr('class', classToChangeTo);
        l--;
      }
    }
  });
}
