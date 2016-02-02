// Global state
var chessboard;

// Initialization
window.onload = function() {

    var boardControl = document.getElementById("board-div");
    var pieceBoxControl = document.getElementById("piece-box-div");
    var enlargeButton = document.getElementById("enlargeButton");
    var reduceButton = document.getElementById("reduceButton");

    chessboard = new Chessboard(8);
    chessboard.resetToStandard();

    chessboard.onSizeChanged(function (board) {
        enlargeButton.disabled = !board.canEnlarge();
        reduceButton.disabled = !board.canReduce();
    });

    var mouseDriver = new MouseDriver(chessboard);
    var renderer = new HtmlRenderer(chessboard, boardControl, mouseDriver);
    var pieceBoxRenderer = new PieceBoxRenderer(pieceBoxControl, mouseDriver);
};