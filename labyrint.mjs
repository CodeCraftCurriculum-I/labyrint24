//#region 
import * as readlinePromises from "node:readline/promises";
const rl = readlinePromises.createInterface({
    input: process.stdin,
    output: process.stdout
});
//#endregion
import ANSI from "./ANSI.mjs";

const FPS = 250; // 60 frames i sekundet sån sirkus..
let rawLevel = `
█████████████████████████████
█           █               █
█  $        █               █
█           ████████        █
█       █                   █
█       █           B       █
█   H   █                   █
█████████████████████████████
`;

let tempLevel = rawLevel.split("\n");
let level = [];
for (let i = 0; i < tempLevel.length; i++) {
    let row = tempLevel[i];
    let outputRow = row.split("");
    level.push(outputRow);
}

let pallet = {
    "█": ANSI.COLOR.LIGHT_GRAY,
    "H": ANSI.COLOR.RED,
    "$": ANSI.COLOR.YELLOW,
    "B": ANSI.COLOR.GREEN
}

let gl = setInterval(gameLoop, FPS)
let isDirty = true;

let playerPos = {
    row: null,
    col: null,
}

function update() {

    if (playerPos.row == null) {
        for (let row = 0; row < level.length; row++) {
            for (let col = 0; col < level[row].length; col++) {
                if (level[row][col] == "H") {
                    playerPos.row = row;
                    playerPos.col = col;
                    break;
                }
            }
            if (playerPos.row != undefined) {
                break;
            }
        }
    }

    let tRow = playerPos.row - 1;
    let tcol = playerPos.col;

    if (level[tRow][tcol] == " ") {
        level[playerPos.row][playerPos.col] = " ";
        level[tRow][tcol] = "H";
        playerPos.row = tRow;
        playerPos.col = tcol;
        isDirty = true;
    }
}

function draw() {

    if (isDirty == false) {
        return;
    }
    isDirty = false;

    console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);

    let rendring = "";
    for (let row = 0; row < level.length; row++) {
        let rowRendering = "";
        for (let col = 0; col < level[row].length; col++) {
            let symbol = level[row][col];
            if (pallet[symbol] != undefined) {
                rowRendering += pallet[symbol] + symbol + ANSI.COLOR_RESET;
            } else {
                rowRendering += symbol;
            }
        }
        rowRendering += "\n";
        rendring += rowRendering;
    }

    console.log(rendring);


}


function gameLoop() {
    update();
    draw();
}