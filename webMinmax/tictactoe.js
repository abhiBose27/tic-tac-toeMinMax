var board = [
	[0, 0, 0],
	[0, 0, 0],
	[0, 0, 0],
]

var human = -1;
var machine = +1;


function evaluate(state) {
	var score = 0;
	if (gameOver(state, machine))
		score = +1;
	else if (gameOver(state, human))
		score = -1;
	else
		score = 0;
	return score;
}

function gameOver(state, player) {
	var winstate = [
		[state[0][0], state[0][1], state[0][2]],
		[state[1][0], state[1][1], state[1][2]],
		[state[2][0], state[2][1], state[2][2]],
		[state[0][0], state[1][0], state[2][0]],
		[state[0][1], state[1][1], state[2][1]],
		[state[0][2], state[1][2], state[2][2]],
		[state[0][0], state[1][1], state[2][2]],
		[state[2][0], state[1][1], state[0][2]],
	];
	for (var i = 0; i < winstate.length; i++){
		var line = winstate[i];
		var filled = 0;
		for (var j = 0; j < 3; j++){
			if (line[j] == player)
				filled++;
		}
		if (filled == 3)
			return true;
	}
	return false;
}


function emptyCells(state) {
	let cells = [];
	for (let x = 0; x < 3; x++) {
		for (let y = 0; y < 3; y++) {
			if (state[x][y] == 0)
				cells.push([x, y]);
		}
	}
	return cells;
}


function validMove(x, y) {
	try {
		if (board[x][y] == 0)
			return true;
		return false;
		
	} catch (error) {
		return false;
	}
	
}

function gameAllover(state) {
	return gameOver(state, human) || gameOver(state, machine);
}

function setMove(x, y, player) {
	if (validMove(x, y)) {
		board[x][y] = player;
		return true;
	}
	return false;
}

function minMax(state, depth, player) {
	var bestMove;
	if (player == machine)
		bestMove = [-1, -1, -1000];
	else
		bestMove = [-1, -1, +1000];
	
	if (depth == 0 || gameAllover(state)) {
		return [-1, -1, evaluate(state)];
	}
	emptyCells(state).forEach(cell => {
		var x = cell[0];
		var y = cell[1];
		state[x][y] = player;
		var score = minMax(state, depth - 1, -player);
		state[x][y] = 0;
		score[0] = x;
		score[1] = y;
		if (player == machine) {
			if (score[2] > bestMove[2])
				bestMove = score;
		}
		else {
			if (score[2] < bestMove[2])
				bestMove = score;
		}
	});
	return bestMove;
}

function AIMove() {
	var x, y;
	var move;
	var cell;
	var lenEmptyCells = emptyCells(board).length;
	if (lenEmptyCells == 9) {
		x = parseInt(Math.random() * 3);
		y = parseInt(Math.random() * 3);
	}
	else {
		move = minMax(board, lenEmptyCells, machine);
		x = move[0];
		y = move[1];
	}
	if (setMove(x, y, machine)) {
		cell = document.getElementById(String(x) + String(y));
		cell.innerHTML = "0";
	}
}

function clickedCell(cell) {
	var btn = document.getElementById("btnRestart");
	btn.disabled = true;

	var condToConti = gameAllover(board) == false && emptyCells(board).length > 0;
	if (condToConti == true) {
		var x = cell.id.split("")[0];
		var y = cell.id.split("")[1];
		var move = setMove(x, y, human);
		if (move) {
			cell.innerHTML = "X";
			if (condToConti)
				AIMove();
		}
	}
	if (gameOver(board, machine)) {
		var lines;
		var cell;
		var msg;

		if (board[0][0] == 1 && board[0][1] == 1 && board[0][2] == 1)
			lines = [[0, 0], [0, 1], [0, 2]];
		else if (board[1][0] == 1 && board[1][1] == 1 && board[1][2] == 1)
			lines = [[1, 0], [1, 1], [1, 2]];
		else if (board[2][0] == 1 && board[2][1] == 1 && board[2][2] == 1)
			lines = [[2, 0], [2, 1], [2, 2]];
		else if (board[0][0] == 1 && board[1][0] == 1 && board[2][0] == 1)
			lines = [[0, 0], [1, 0], [2, 0]];
		else if (board[0][1] == 1 && board[1][1] == 1 && board[2][1] == 1)
			lines = [[0, 1], [1, 1], [2, 1]];
		else if (board[0][2] == 1 && board[1][2] == 1 && board[2][2] == 1)
			lines = [[0, 2], [1, 2], [2, 2]];
		else if (board[0][0] == 1 && board[1][1] == 1 && board[2][2] == 1)
			lines = [[0, 0], [1, 1], [2, 2]];
		else if (board[2][0] == 1 && board[1][1] == 1 && board[0][2] == 1)
			lines = [[2, 0], [1, 1], [0, 2]];
		
		for (var index = 0; index < lines.length; index++) {
			cell = document.getElementById(String(lines[index][0]) + String(lines[index][1]));
			cell.style.color = "red";
		}
		msg = document.getElementById("message");
		msg.innerHTML = "You lose!";
	}
	if (emptyCells(board).length == 0 && !gameAllover(board)) {
		var msg = document.getElementById("message");
		msg.innerHTML = "Draw";
	}

	if (gameAllover(board) == true || emptyCells(board).length == 0) {
		btn.value = "Restart";
		btn.disabled = false;
	}

}

function restartBtn(button) {
	if (button.value == "Play") {
		AIMove();
		button.disabled = true;
	}
	else if (button.value == "Restart") {
		var htmlBoard;
		var msg;

		for (var x = 0; x < 3; x++) {
			for (var y = 0; y < 3; y++) {
				board[x][y] = 0;
				htmlBoard = document.getElementById(String(x) + String(y));
				htmlBoard.style.color = "#444";
				htmlBoard.innerHTML = "";
			}
		}
		button.value = "Play";
		msg = document.getElementById("message");
		msg.innerHTML = "";
	}
}