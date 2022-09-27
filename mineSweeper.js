'use strict';

const MINE = '💣';
const notMine = '';

var gTimeInterval;
var gStartTime;

var board;

var flag = document.querySelector('.addFlags');
var life = document.querySelector('.lives');
var mood = document.querySelector('.smiley');
var boardEl = document.querySelector('.board');
var safePlace = document.querySelector('.safe');
var dis = document.querySelector('.disabled');
var gGame;

function initGame(size = 4, mines = 4, lives = 3) {
  mood.innerText = '😁';
  document.querySelector('.safe').style.display = 'inline';

  gGame = {
    isOn: false,
    isWin: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives,
    totalCells: size * size,
    totalMines: mines,
    safeClicks: 3,
  };

  startTimer();

  if (!gGame.isOn) {
    gGame.isOn = true;
    life.innerText = 'lives: ' + gGame.lives;
    gGame.isWin = false;
    board = createBoard(size, mines);
    renderBoard(board);
    document.querySelector('.container').style.display = 'none';
    document.querySelector('.winner').style.display = 'none';
    boardEl.classList.remove('disabled');
    document.querySelector('.boom').style.display = 'none';
  }
}

function onCellClicked(el, i, j) {
  var currCell = board[i][j];

  if (currCell.isShown) {
    return;
  } else {
    if (currCell.isMarked) {
      currCell.isMarked = false;
      gGame.markedCount--;
    }
    currCell.isShown = true;
    gGame.shownCount++;
  }

  var hasWon = checkPlayerWon();

  if (hasWon) {
    wonGame();
  } else {
    const minesAroundCell = getTotalMinesAround(i, j);

    if (minesAroundCell === 0) el.style.color = 'green';
    if (minesAroundCell === 1) el.style.color = 'yellow';
    if (minesAroundCell === 2) el.style.color = 'orange';
    if (minesAroundCell === 3) el.style.color = 'red';
    if (minesAroundCell === 4) el.style.color = 'blue';

    if (currCell.isMine) {
      el.textContent = MINE;
      boomSound();

      if (gGame.lives > 1) {
        gGame.lives--;
        life.innerText = 'lives: ' + gGame.lives;
      } else gameOver();
    } else {
      goodStep();
      el.textContent = minesAroundCell;
    }
  }
}

function createBoard(size, mines) {
  var board = [];
  for (var i = 0; i < size; i++) {
    board[i] = [];
    for (var j = 0; j < size; j++) {
      board[i][j] = {
        isShown: false,
        isMine: false,
        isMarked: false,
        i,
        j,
      };
    }
  }

  for (let i = 0; i < mines; i++) {
    var randomI = getRandomInt(0, size);
    var randomj = getRandomInt(0, size);
    board[randomI][randomj] = {
      isMine: true,
      isShown: false,
      isMarked: false,
    };
  }

  return board;
}

function renderBoard(board) {
  var strHTML = '';
  for (var i = 0; i < board.length; i++) {
    strHTML += `<tr>\n`;
    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j];

      strHTML += `<td class="cell"
            id="${i},${j}"
            data-i="${i}" data-j="${j}"
            oncontextmenu="markCell(this,${i},${j})"
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

function checkPlayerWon() {
  var hasWon;
  if (
    gGame.totalCells <= gGame.shownCount + gGame.markedCount &&
    gGame.lives >= 1
    /*||
      
    (gGame.totalCells === gGame.markedCount + gGame.totalMines &&
      gGame.lives >= 1) ||
    (gGame.totalCells <= gGame.shownCount + gGame.markedCount &&
      gGame.lives >= 1)
      */
  ) {
    hasWon = true;
  } else {
    hasWon = false;
  }

  return hasWon;
}

function gameOver() {
  gGame.isOn = false;
  stopTimer();
  boardEl.classList.add('disabled');
  document.querySelector('.container').style.display = 'block';
  document.querySelector('.boom').style.display = 'block';
  document.querySelector('.safe').style.display = 'none';

  mood.innerText = '🤯';
  loseSound();

  life.innerText = 'lives: 0';
  gGame.isWin = false;
}

function wonGame() {
  gGame.isOn = false;
  gGame.isWin = true;
  winSound();
  stopTimer();

  boardEl.classList.add('disabled');
  document.querySelector('.winner').style.display = 'block';
  document.querySelector('.container').style.display = 'block';
  document.querySelector('.safe').style.display = 'none';

  mood.innerText = '😎';
}

function startTimer() {
  gStartTime = Date.now();
  gTimeInterval = setInterval(updateTimer, 100);
}

function updateTimer() {
  var diff = Date.now() - gStartTime;
  var inSeconds = diff / 1000;
  document.querySelector('.timer').innerText = inSeconds;
  gGame.secsPassed = inSeconds; /////
}

function stopTimer() {
  clearInterval(gTimeInterval);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

document.addEventListener('contextmenu', (ev) => {
  ev.preventDefault();
});

function restart() {
  initGame();
}

function markCell(el, i, j) {
  var currCell = board[i][j];

  if (gGame.markedCount === gGame.totalMines) return;

  if (currCell.isShown) return;
  if (currCell.isMarked) {
    el.innerText = '';
    gGame.markedCount--;
  } else {
    el.innerText = '🚩';
    gGame.markedCount++;
  }

  currCell.isMarked = !currCell.isMarked;

  var hasWon = checkPlayerWon();
  if (hasWon) wonGame();
}

function loseSound() {
  let everyBody = new Audio('everyBody.mp3');
  everyBody.play();
}

function winSound() {
  let NoTimeToDie = new Audio('NoTimeToDie.mp3');
  NoTimeToDie.play();
}

function boomSound() {
  let boom = new Audio('boom.mp3');
  boom.play();
}

function goodStep() {
  let step = new Audio('goodStep.mp4');
  step.play();
}

function safeClick() {
  if (gGame.safeClicks) {
    gGame.safeClicks--;
    var safeCell = getSafeCell();
    var safeCellEl = document.getElementById(`${safeCell.i},${safeCell.j}`);

    safeCellEl.classList.add('safeCell');
    setTimeout(function () {
      safeCellEl.classList.remove('safeCell');
    }, 1000);
  }
}

function getSafeCell() {
  var checkSafe = [];
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      var currCell = board[i][j];

      if (!currCell.isMine && !currCell.isShown) {
        checkSafe.push(currCell);
      }
    }
  }

  const randIdx = getRandomInt(0, checkSafe.length);
  return checkSafe[randIdx];
}

// document.querySelector('.check').addEventListener('click', function () {
//   document.querySelector('.check').style.color = 'blue';
// });

/*
function getGhostHTML(ghost) {
  var color = gPacman.isSuper ? 'blue' : ghost.color;
  return `<span style = "color: ${color}" >${GHOST}</span>`;
*/
