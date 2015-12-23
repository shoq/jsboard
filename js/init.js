window.onload = function() {

    var canvas = document.getElementById("chessboardCanvas");

    var renderer = new Renderer(canvas, "#DDDDDD", "#555555");
    var chessboard = new Chessboard(8);

    renderer.drawChessboard(chessboard);
};