// Global state
var chessboard;

// Initialization
window.onload = function() {

    var boardControl = document.getElementById("chessdiv");

    var pieceImageFileNames = [
        "", // just for the sake of index compatibility
        "white-pawn",
        "white-knight",
        "white-bishop",
        "white-rook",
        "white-queen",
        "white-king",
        "black-pawn",
        "black-knight",
        "black-bishop",
        "black-rook",
        "black-queen",
        "black-king"
    ].map(function(name) {
        return  "./images/" + name + ".png";
    });

    chessboard = new Chessboard(8);
    var renderer = new HtmlRenderer(chessboard, boardControl, pieceImageFileNames);

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