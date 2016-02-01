var SquareImageUrls = [
    "empty",
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
    
function HtmlRenderer(chessboard, boardControl, mouseDriver) {

    rebuildSquareDivs();

    function rebuildSquareDivs() {
        removeAllChildren(boardControl);

        var newChessboardSize = chessboard.getSize();

        for (var rank = 0; rank < newChessboardSize; ++rank) {
            var rankDiv = createRankDiv();
            for (var file = 0; file < newChessboardSize; ++file) {
                rankDiv.appendChild(createSquareDiv(rank, file));
            }

            boardControl.appendChild(rankDiv);
        }
    }

    function createRankDiv() {
        var rankDiv = document.createElement('div');
        rankDiv.className = 'rank';
        return rankDiv;
    }

    function createSquareDiv(rank, file) {

        var squareType = chessboard.getSquareType(rank, file);
        var squareImage = new Image();
        var squareDiv = document.createElement('div');
                
        squareImage.id = getSquareImageId(rank, file);
        squareImage.className = 'square-unselected';
        squareDiv.onclick = function() { mouseDriver.selectSquareDiv(rank, file); };
        squareDiv.className = isSquareWhite(rank, file) ? 'white-square' : 'black-square';
        squareDiv.appendChild(squareImage);
        
        setSquareImageUrlBasedOnType(squareImage, squareType);

        return squareDiv;
    }

    function setSquareImageUrlBasedOnType(squareImage, squareType) {
        squareImage.src = SquareImageUrls[squareType];
    }
    
    function getSquareImage(rank, file) {
        return document.getElementById(getSquareImageId(rank, file));
    }
    
    function getSquareImageId(rank, file) {
        return 'img#' + rank + '#' + file;
    }
    
    function isSquareWhite(rank, file) {
        return (rank + file) % 2 == 0;
    }

    chessboard.onSquareChanged(function (board, args) {
        setSquareImageUrlBasedOnType(getSquareImage(args.rank, args.file), args.type);
    });

    chessboard.onSizeChanged(function (board, args) {
        rebuildSquareDivs();
    });

    mouseDriver.onSquareSelected(function(sender, args) {
        getSquareImage(args.rank, args.file).className = 'square-selected';
    });

    mouseDriver.onSquareUnselected(function(sender, args) {
        getSquareImage(args.rank, args.file).className = 'square-unselected';
    });

}