'use strict';

const MINE = '💥💣💥';
const notMine = '✅';

var gTimeInterval;
var gStartTime;

var board;
var boardEl = document.querySelector('.board');
var isGameOn = false;
var gGame = {
  isOn: false,
  isWin: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};

function initGame(size = 4, mines = 2) {
  if (!gGame.isOn) {
    gGame.isOn = true;
    (gGame.isWin = false), (board = createBoard(size, mines));
    renderBoard(board);
    boardEl.classList.remove('disabled');
    document.querySelector('.boom').style.display = 'none';

    startTimer();
  }
}

function onCellClicked(el, i, j) {
  var currCell = board[i][j];
  const minesAroundCell = getTotalMinesAround(i, j);

  if (minesAroundCell === 0) el.style.color = 'green';
  if (minesAroundCell === 1) el.style.color = 'yellow';
  if (minesAroundCell === 2) el.style.color = 'orange';
  if (minesAroundCell === 3) el.style.color = 'red';

  currCell.isShown = true;
  if (currCell.isMine) {
    el.textContent = MINE;
    console.log('GAME OVER');
    gameOver();
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

  for (let i = 0; i < mines; i++) {
    var randomI = getRandomInt(0, size);
    var randomj = getRandomInt(0, size);
    board[randomI][randomj] = {
      isMine: true,
      isShown: false,
    };
  }

  /*
  board[1][1] = {
    isMine: true,
    isShown: false,
  };

  board[3][3] = {
    isMine: true,
    isShown: false,
  };
  */

  console.table(board);
  return board;
}

function renderBoard(board) {
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

function gameOver() {
  gGame.isOn = false;
  stopTimer();
  // showModal(gGame.isWin);
  boardEl.classList.add('disabled');
  document.querySelector('.boom').style.display = 'block';
}

function startTimer() {
  gStartTime = Date.now();
  gTimeInterval = setInterval(updateTimer, 100);
}

function updateTimer() {
  var diff = Date.now() - gStartTime;
  var inSeconds = diff / 1000;
  document.querySelector('.timer').innerText = inSeconds;
}

function stopTimer() {
  console.log(2);
  console.log(gTimeInterval);

  clearInterval(gTimeInterval);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
