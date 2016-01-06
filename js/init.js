// Global state
var chessboard;

// Initialization
window.onload = function() {

    var canvas = document.getElementById("chessboardCanvas");

    chessboard = new Chessboard(8);
    var renderer = new Renderer(chessboard, canvas, "#DDDDDD", "#555555");

    chessboard.resetToStandard();

    setTimeout(function() {
        chessboard.move(6, 4, 4, 4); // Moves white pawn from e2 to e4.

    }, 1000);

    chessboard.onSizeChanged(function (board) {
        var enlargeButton = document.getElementById("enlargeButton");
        enlargeButton.disabled = !board.canEnlarge();

        var reduceButton = document.getElementById("reduceButton");
        reduceButton.disabled = !board.canReduce();
    });

    renderer.drawChessboard();
};