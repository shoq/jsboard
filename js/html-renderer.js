var FieldImageUrls = [
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
    
function HtmlRenderer(chessboard, boardControl) {

    var fieldImageSize = 50;
    var selectedRank = -1;
    var selectedFile = -1;
    
    rebuildFieldDivs();

    function rebuildFieldDivs() {
        removeAllChildren(boardControl);

        var newChessboardSize = chessboard.getSize();
        var newFieldCount = newChessboardSize * newChessboardSize;
        
        setSquareSize(boardControl, fieldImageSize * newChessboardSize);

        for (var rank = 0; rank < newChessboardSize; ++rank) {
            for (var file = 0; file < newChessboardSize; ++file) {
                boardControl.appendChild(createFieldDiv(rank, file));
            }
        }
    };
    
    function selectSquareDiv(rank, file) {
        //fieldDiv.marginLeft = fieldDiv.marginTop = fieldDiv.marginRight = fieldDiv.marginBottom = 4;
        selectedRank = rank;
        selectedFile = file;
    }

    function createFieldDiv(rank, file) {

        var fieldType = chessboard.getFieldType(rank, file);
        var fieldImage = new Image();
        var fieldDiv = document.createElement('div');
                
        fieldImage.id = getFieldImageId(rank, file);
        fieldImage.className = 'field';
        fieldDiv.id = getFieldDivId(rank, file);
        fieldDiv.onclick = function() { selectSquareDiv(fieldDiv, rank, file); };
        fieldDiv.className = isFieldWhite(rank, file) ? 'white-square' : 'black-square';
        fieldDiv.appendChild(fieldImage);
        
        setSquareSize(fieldDiv, fieldImageSize);
        setFieldImageUrlBasedOnType(fieldImage, fieldType);

        return fieldDiv;
    }

    function setFieldImageUrlBasedOnType(fieldImage, fieldType) {
        fieldImage.src = FieldImageUrls[fieldType];
    }
    
    function getFieldDivId(rank, file) {
        return 'f#' + rank + '#' + file;
    }

    function getFieldImageId(rank, file) {
        return 'img#' + rank + '#' + file;
    }
    
    function isFieldWhite(rank, file) {
        return (rank + file) % 2 == 1;
    }

    chessboard.onFieldChanged(function (board, args) {
        setFieldImageUrlBasedOnType(document.getElementById(args.rank, args.file), args.type);
    });

    chessboard.onSizeChanged(function (board, args) {
        rebuildFieldDivs();
    });

};