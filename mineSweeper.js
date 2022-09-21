const MINE = '💣';
const notMine = '✅';
// const Easy = 4;
// const Medium = 8;
// const Expert = 12;

var board;
var isGameOn = false;
var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};

function initGame(size = 4, mines = 2) {
  if (!gGame.isOn) {
    gGame.isOn = true;
    board = createBoard(size, mines);
    renderBoard(board);
  }
}

function onCellClicked(el, i, j) {
  var currCell = board[i][j];
  const minesAroundCell = getTotalMinesAround(i, j);

  currCell.isShown = true;
  if (currCell.isMine) {
    el.textContent = MINE;
    console.log('GAME OVER');
    // gameOver()
  } else {
    el.textContent = minesAroundCell;
  }

  board.shownCount++;
}

function createBoard(size, mines) {
  var board = [];
  for (var i = 0; i < size; i++) {
    board[i] = [];
    for (var j = 0; j < size; j++) {
      board[i][j] = {
        isShown: false,
        isMine: false,
        // isMarked: true
      };
    }
  }

  // loop over number of mines and create mines objects
  board[1][1] = {
    isMine: true,
    isShown: false,
  };

  board[3][3] = {
    isMine: true,
    isShown: false,
  };
  console.table(board);
  return board;
}

function renderBoard(board) {
  // console.table(board);
  var strHTML = '';
  for (var i = 0; i < board.length; i++) {
    strHTML += `<tr>\n`;
    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j];

      strHTML += `<td class="cell"
            data-i="${i}" data-j="${j}"
            onclick="onCellClicked(this,${i},${j})">
            ${currCell.isShown ? (currCell.isMine ? MINE : notMine) : ''}</td>`;
    }
    strHTML += `</tr>\n`;
  }
  // console.log('strHTML', strHTML)
  var elBoard = document.querySelector('.board');
  elBoard.innerHTML = strHTML;
}

function getTotalMinesAround(i, j) {
  let total = 0;
  let bottomNeighbor = board[i + 1]?.[j];
  let topNeighbor = board[i - 1]?.[j];
  let rightNeighbor = board[i]?.[j + 1];
  let leftNeighbor = board[i]?.[j - 1];

  let bottomRightNeighbor = board[i + 1]?.[j + 1];
  let bottomLeftNeighbor = board[i + 1]?.[j - 1];
  let topRightNeighbor = board[i - 1]?.[j + 1];
  let topLeftNeighbor = board[i - 1]?.[j - 1];

  let neighbors = [
    bottomNeighbor,
    topNeighbor,
    rightNeighbor,
    leftNeighbor,
    bottomRightNeighbor,
    bottomLeftNeighbor,
    topRightNeighbor,
    topLeftNeighbor,
  ];

  neighbors.forEach((neighbor) => {
    if (neighbor && neighbor.isMine) total++;
  });

  return total;
}

/*
function getTotalMinesAround(boardI, boardJ, size) {
  var MinesNegsCount = 0;
  for (var i = boardI - 1; i <= boardI + 1; i++) {
    if (i < 0 || i >= size.length) continue;
    for (var j = boardJ - 1; j <= boardJ + 1; j++) {
      if (j < 0 || j >= size[i].length) continue;

      if (currCell.isMine) MinesNegsCount++;
    }
  }

  console.log(MinesNegsCount);
  return MinesNegsCount;
}

 function setMinesNegsCount(i, j) {
     console.log(object);
   var MinesNegsCount = 0;
   for (var i = i - 1; i <= i + 1; i++) {
     if (i < 0 || i >= board.length) continue;
     for (var j = j - 1; j <= j + 1; j++) {
       if (j < 0 || j >= board[0].length) continue;
       if (i === i && j === j) continue;

       if (board[i][j].isMine) MinesNegsCount++;
     }
   }
   console.log(MinesNegsCount);
   return MinesNegsCount;
 
*/
