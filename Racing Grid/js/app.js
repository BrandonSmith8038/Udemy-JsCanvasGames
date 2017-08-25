var carPic = document.createElement("img");
var carPicLoaded = false;

var CarX = 75;
var CarY = 75;
var carAng = 0.02;
var CarSpeedX = 5;
var CarSpeedY = 7;

const TRACK_W = 40;
const TRACK_H = 40;
const TRACK_GAP = 2;
const TRACK_COLS = 20;
const TRACK_ROWS = 15;
var trackGrid = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
				 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
				 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
				 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1,
				 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1,
				 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1,
				 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1,
				 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
				 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
				 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
				 1, 0, 2, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1,
				 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
				 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1,
				 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1,
				 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

var canvas, canvasContext;

var mouseX = 0;
var mouseY = 0;

function updateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;

	mouseX = evt.clientX - rect.left - root.scrollLeft;
	mouseY = evt.clientY - rect.top - root.scrollTop;

	// cheat / hack to test Car in any position
	/*CarX = mouseX;
	CarY = mouseY;
	CarSpeedX = 4;
	CarSpeedY = -4;*/
}

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	var framesPerSecond = 30;
	setInterval(updateAll, 1000/framesPerSecond);

	canvas.addEventListener('mousemove', updateMousePos);

	carPic.onload = function() {
		carPicLoaded = true;
	}
	carPic.src = "player1car.png";

	CarReset();
}

function updateAll() {
	moveAll();
	drawAll();
}

function CarReset() {
	for(var eachRow=0;eachRow<TRACK_ROWS;eachRow++) {
		for(var eachCol=0;eachCol<TRACK_COLS;eachCol++) {
			var arrayIndex = rowColToArrayIndex(eachCol, eachRow); 
			if(trackGrid[arrayIndex] == 2) {
				trackGrid[arrayIndex] = 0;
				CarX = eachCol * TRACK_W + TRACK_W/2;
				CarY = eachRow * TRACK_H + TRACK_H/2;
			}
		}
	}
}

function CarMove() {
	
	carAng += 0.02;
	
	CarX += CarSpeedX;
	CarY += CarSpeedY;

	if(CarX < 0 && CarSpeedX < 0.0) { //left
		CarSpeedX *= -1;
	}
	if(CarX > canvas.width && CarSpeedX > 0.0) { // right
		CarSpeedX *= -1;
	}
	if(CarY < 0 && CarSpeedY < 0.0) { // top
		CarSpeedY *= -1;
	}
	if(CarY > canvas.height) { // bottom
		CarReset();
		trackReset();
	}
}

function isTrackAtColRow(col, row) {
	if(col >= 0 && col < TRACK_COLS &&
		row >= 0 && row < TRACK_ROWS) {
		 var trackIndexUnderCoord = rowColToArrayIndex(col, row);
		 return (trackGrid[trackIndexUnderCoord] == 1);
	} else {
		return false;
	}
}

function CarTrackHandling() {
	var CarTrackCol = Math.floor(CarX / TRACK_W);
	var CarTrackRow = Math.floor(CarY / TRACK_H);
	var trackIndexUnderCar = rowColToArrayIndex(CarTrackCol, CarTrackRow);

	if(CarTrackCol >= 0 && CarTrackCol < TRACK_COLS &&
		CarTrackRow >= 0 && CarTrackRow < TRACK_ROWS) {

		if(isTrackAtColRow( CarTrackCol,CarTrackRow )) {
			// console.log(tracksLeft);

			var prevCarX = CarX - CarSpeedX;
			var prevCarY = CarY - CarSpeedY;
			var prevTrackCol = Math.floor(prevCarX / TRACK_W);
			var prevTrackRow = Math.floor(prevCarY / TRACK_H);

			var bothTestsFailed = true;

			if(prevTrackCol != CarTrackCol) {
				if(isTrackAtColRow(prevTrackCol, CarTrackRow) == false) {
					CarSpeedX *= -1;
					bothTestsFailed = false;
				}
			}
			if(prevTrackRow != CarTrackRow) {
				if(isTrackAtColRow(CarTrackCol, prevTrackRow) == false) {
					CarSpeedY *= -1;
					bothTestsFailed = false;
				}
			}

			if(bothTestsFailed) { // armpit case, prevents Car from going through
				CarSpeedX *= -1;
				CarSpeedY *= -1;
			}

		} // end of track found
	} // end of valid col and row
} // end of CarTrackHandling func

function moveAll() {
	CarMove();
	
	CarTrackHandling();
}

function rowColToArrayIndex(col, row) {
	return col + TRACK_COLS * row;
}

function drawTracks() {

	for(var eachRow=0;eachRow<TRACK_ROWS;eachRow++) {
		for(var eachCol=0;eachCol<TRACK_COLS;eachCol++) {

			var arrayIndex = rowColToArrayIndex(eachCol, eachRow); 

			if(trackGrid[arrayIndex] == 1) {
				colorRect(TRACK_W*eachCol,TRACK_H*eachRow,
					TRACK_W-TRACK_GAP,TRACK_H-TRACK_GAP, 'blue');
			} // end of is this track here
		} // end of for each track
	} // end of for each row

} // end of drawTracks func

function drawAll() {
	colorRect(0,0, canvas.width,canvas.height, 'black'); // clear screen

	//colorCircle(CarX,CarY, 10, 'white'); // draw Car
	if(carPicLoaded) {
		drawBitMapCenteredWithRotation(carPic, carX,carY, carAng )
	}

	drawTracks();
}

function drawBitMapCenteredWithRotation(useBitmap, atX, atY, withAng){
	canvasContext.save();
	canvasContext.translate(atX,atY);
	canvasContext.rotate(withAng);
	canvasContext.drawImage(useBitmap, useBitmap.width/2,useBitmap.height/2);
}

function colorRect(topLeftX,topLeftY, boxWidth,boxHeight, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.fillRect(topLeftX,topLeftY, boxWidth,boxHeight);
}

function colorCircle(centerX,centerY, radius, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX,centerY, 10, 0,Math.PI*2, true);
	canvasContext.fill();
}

function colorText(showWords, textX,textY, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.fillText(showWords, textX, textY);
}