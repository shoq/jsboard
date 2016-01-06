// Global state
var chessboard;

// Initialization
window.onload = function() {

    var canvas = document.getElementById("chessboardCanvas");

    chessboard = new Chessboard(8);
    var renderer = new Renderer(chessboard, canvas, "#DDDDDD", "#555555");

    chessboard.resetToStandard();

    setTimeout(function() {
        chessboard.move(6, 4, 4, 4);
    }, 1000);
    
    setTimeout(function() {
        chessboard.move(1, 3, 3, 3);
    }, 2000);
    
    setTimeout(function() {
        chessboard.move(7, 1, 5, 2);
    }, 3000);
    
    setTimeout(function() {
        chessboard.move(3, 3, 4, 4);
    }, 4000);
    
    setTimeout(function() {
        chessboard.move(5, 2, 4, 4);
    }, 5000);

    chessboard.onSizeChanged(function (board) {
        var enlargeButton = document.getElementById("enlargeButton");
        enlargeButton.disabled = !board.canEnlarge();

        var reduceButton = document.getElementById("reduceButton");
        reduceButton.disabled = !board.canReduce();
    });

    renderer.drawChessboard();
};