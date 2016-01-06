// Global state
var chessboard;

// Initialization
window.onload = function() {

    var canvas = document.getElementById("chessboardCanvas");

    var renderer = new Renderer(canvas, "#DDDDDD", "#555555");
    chessboard = new Chessboard(8);
    chessboard.resetToStandard();
    chessboard.move(6, 4, 4, 4); // Moves white pawn from e2 to e4.

    var draw = function(board) {
        renderer.drawChessboard(board);
    };

    chessboard.onSizeChanged(draw);

    chessboard.onSizeChanged(function(board) {
        var enlargeButton = document.getElementById("enlargeButton");
        enlargeButton.disabled = !board.canEnlarge();

        var reduceButton = document.getElementById("reduceButton");
        reduceButton.disabled = !board.canReduce();
    });

    draw(chessboard);

};