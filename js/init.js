// Global state
var chessboard;

// Initialization
window.onload = function() {

    var boardControl = document.getElementById("chessdiv");

    chessboard = new Chessboard(8);
    var renderer = new HtmlRenderer(chessboard, boardControl);

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

    renderer.assembleChessboard();
};