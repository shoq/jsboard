function Chessboard(squareCount) {

    var that = this;

    squareCount = squareCount || 8;

    this.getSquareCount = function() {
        return squareCount;
    };

    var sizeChanged = new DomainEvent('sizeChanged', this);
    this.onSizeChanged = sizeChanged.subscribe;

    this.canEnlarge = function() {
        return squareCount < 16;
    };

    this.enlarge = function() {
        if(!this.canEnlarge()) {
            throw new Error('Cannot enlarge');
        }
        squareCount++;
        sizeChanged.raise();
    };

    this.canReduce = function() {
        return squareCount > 2;
    };

    this.reduce = function() {
        if(!this.canReduce()) {
            throw new Error('Cannot reduce');
        }
        squareCount--;
        sizeChanged.raise();
    }

}