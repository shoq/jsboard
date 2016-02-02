function MouseDriver(chessboard) {

    var selectedRank = -1;
    var selectedFile = -1;

    var selectedPieceType = -1;

    var squareSelected = new DomainEvent('squareSelected', this);
    var squareUnselected = new DomainEvent('squareUnselected', this);

    this.onSquareSelected = squareSelected.subscribe;
    this.onSquareUnselected = squareUnselected.subscribe;

    function unselectCurrent() {
        if(selectedRank != -1 && selectedFile != -1) {
            squareUnselected.raise(position(selectedRank, selectedFile));
            selectedRank = -1;
            selectedFile = -1;
        }
    }

    function select(rank, file) {
        squareSelected.raise(position(rank, file));
        selectedRank = rank;
        selectedFile = file;
    }

    this.selectSquareDiv = function(rank, file) {

        // If a square is clicked again, then it is deselected.
        if (selectedRank == rank && selectedFile == file) {
            unselectCurrent();
        } else {
            // If a piece from piece box has been selected, it should  be placed on the chessboard
            if (selectedPieceType != -1) {
                chessboard.addPiece(rank, file, selectedPieceType);
                selectedPieceType = -1;
            }
            // If a different square was selected before, then it must be deselected and a move must be made.
            else if (selectedRank != -1 && selectedFile != -1) {
                if (chessboard.getPlayerColor(selectedRank, selectedFile) != chessboard.getPlayerColor(rank, file)) {
                    if (chessboard.tryToMove(selectedRank, selectedFile, rank, file)) {
                        unselectCurrent();
                    }
                } else {
                    unselectCurrent();
                    select(rank, file);
                }
                // A newly clicked square must be selected.
            } else {
                squareSelected.raise(position(rank, file));
                selectedRank = rank;
                selectedFile = file;
            }
        }
    };

    this.selectPieceFromBox = function(pieceType) {
        unselectCurrent();
        selectedPieceType = pieceType;
    };


}