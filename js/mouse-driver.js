function MouseDriver(chessboard) {

    var selectedRank = -1;
    var selectedFile = -1;

    var squareSelected = new DomainEvent('squareSelected', this);
    var squareUnselected = new DomainEvent('squareUnselected', this);

    this.onSquareSelected = squareSelected.subscribe;
    this.onSquareUnselected = squareUnselected.subscribe;

    this.selectSquareDiv = function(rank, file) {

        // If a square is clicked again, then it is deselected.
        if (selectedRank == rank && selectedFile == file) {
            selectedRank = -1;
            selectedFile = -1;
            squareUnselected.raise(position(rank, file));
        } else {
            // If a different square was selected before, then it must be deselected and a move must be made.
            if (selectedRank != -1 && selectedFile != -1) {
                if (chessboard.getPlayerColor(selectedRank, selectedFile) != chessboard.getPlayerColor(rank, file)) {
                    if (chessboard.tryToMove(selectedRank, selectedFile, rank, file)) {
                        squareUnselected.raise(position(selectedRank, selectedFile));
                        selectedRank = -1;
                        selectedFile = -1;
                    }
                } else {
                    squareUnselected.raise(position(selectedRank, selectedFile));
                    squareSelected.raise(position(rank, file));
                    selectedRank = rank;
                    selectedFile = file;
                }
                // A newly clicked square must be selected.
            } else {
                squareSelected.raise(position(rank, file));
                selectedRank = rank;
                selectedFile = file;
            }
        }
    }


}