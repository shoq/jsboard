// Global state
var chessboard;

// Initialization
window.onload = function() {

    var boardControl = document.getElementById("board-div");

    chessboard = new Chessboard(8);
    chessboard.resetToStandard();

    chessboard.onSizeChanged(function (board) {
        var enlargeButton = document.getElementById("enlargeButton");
        enlargeButton.disabled = !board.canEnlarge();

        var reduceButton = document.getElementById("reduceButton");
        reduceButton.disabled = !board.canReduce();
    });
    
    var renderer = new HtmlRenderer(chessboard, boardControl);
};