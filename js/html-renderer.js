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

    var selectedRank = -1;
    var selectedFile = -1;
    
    rebuildFieldDivs();

    function rebuildFieldDivs() {
        removeAllChildren(boardControl);

        var newChessboardSize = chessboard.getSize();

        for (var rank = 0; rank < newChessboardSize; ++rank) {
            var rankDiv = createRankDiv();
            for (var file = 0; file < newChessboardSize; ++file) {
                rankDiv.appendChild(createFieldDiv(rank, file));
            }

            boardControl.appendChild(rankDiv);
        }
    };
    
    function selectSquareDiv(rank, file) {

        // If a field is clicked again, then it is deselected.
        if (selectedRank == rank && selectedFile == file) {
            selectedRank = -1;
            selectedFile = -1;
            getFieldImage(rank, file).className = 'field-unselected';
        } else {
            // If a different field was selected before, then it must be deselected and a move must be made.
            if (selectedRank != -1 && selectedFile != -1) {
                if (chessboard.tryToMove(selectedRank, selectedFile, rank, file)) {
                    getFieldImage(selectedRank, selectedFile).className = 'field-unselected';
                    selectedRank = -1;
                    selectedFile = -1;
                }
            // A newly clicked field must be selected.
            } else {
                selectedRank = rank;
                selectedFile = file;
                getFieldImage(rank, file).className = 'field-selected';
            }
        }
    }
    
    function createRankDiv() {
        var rankDiv = document.createElement('div');
        rankDiv.className = 'rank';
        return rankDiv;
    }

    function createFieldDiv(rank, file) {

        var fieldType = chessboard.getFieldType(rank, file);
        var fieldImage = new Image();
        var fieldDiv = document.createElement('div');
                
        fieldImage.id = getFieldImageId(rank, file);
        fieldImage.className = 'field-unselected';
        fieldDiv.onclick = function() { selectSquareDiv(rank, file); };
        fieldDiv.className = isFieldWhite(rank, file) ? 'white-square' : 'black-square';
        fieldDiv.appendChild(fieldImage);
        
        setFieldImageUrlBasedOnType(fieldImage, fieldType);

        return fieldDiv;
    }

    function setFieldImageUrlBasedOnType(fieldImage, fieldType) {
        fieldImage.src = FieldImageUrls[fieldType];
    }
    
    function getFieldImage(rank, file) {
        return document.getElementById(getFieldImageId(rank, file));
    }
    
    function getFieldImageId(rank, file) {
        return 'img#' + rank + '#' + file;
    }
    
    function isFieldWhite(rank, file) {
        return (rank + file) % 2 == 0;
    }

    chessboard.onFieldChanged(function (board, args) {
        setFieldImageUrlBasedOnType(getFieldImage(args.rank, args.file), args.type);
    });

    chessboard.onSizeChanged(function (board, args) {
        rebuildFieldDivs();
    });

};