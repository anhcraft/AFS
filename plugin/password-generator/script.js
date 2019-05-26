$(function() {
    function checkScoreOfPass(pass,upper,special,num) {
        var score = 100;
        var str = pass.split('');
        var lastStr = '';
        if(pass.length < 16){
            score = score - 30;
        }
        if(special !== true){
            score = score - 30;
        }
        if(upper !== true){
            score = score - 30;
        }
        if(num !== true){
            score = score - 30;
        }
        for (var i = 0; i < str.length; i++) {
            var t = str[i];
            if (lastStr === t) {
                score = score - (25 / (pass.length)) - (25 / (pass.length));
            }
            lastStr = t;
        }
        score = JSON.stringify(score);
        if(0 <= score.indexOf('.')){
            score = score.slice(0, score.indexOf('.')+3);
        }
        return score;
    }

    function memoOfPass(password) {
        var string = '';
        for (var i = 0; i < password.slice('').length; i++) {
            var pass = password.slice('')[i];
            pass = pass.toLowerCase();
            if (pass === "a") {
                pass = 'age';
            }
            if (pass === "b") {
                pass = 'boss';
            }
            if (pass === "c") {
                pass = 'come';
            }
            if (pass === "d") {
                pass = 'dark';
            }
            if (pass === "e") {
                pass = 'english';
            }
            if (pass === "f") {
                pass = 'fly';
            }
            if (pass === "g") {
                pass = 'game';
            }
            if (pass === "h") {
                pass = 'home';
            }
            if (pass === "i") {
                pass = 'ice';
            }
            if (pass === "j") {
                pass = 'juice';
            }
            if (pass === "k") {
                pass = 'king';
            }
            if (pass === "l") {
                pass = 'lion';
            }
            if (pass === "m") {
                pass = 'most';
            }
            if (pass === "n") {
                pass = 'note';
            }
            if (pass === "o") {
                pass = 'off';
            }
            if (pass === "p") {
                pass = 'pen';
            }
            if (pass === "q") {
                pass = 'queen';
            }
            if (pass === "r") {
                pass = 'rar';
            }
            if (pass === "s") {
                pass = 'ship';
            }
            if (pass === "t") {
                pass = 'time';
            }
            if (pass === "u") {
                pass = 'usa';
            }
            if (pass === "v") {
                pass = 'visa';
            }
            if (pass === "w") {
                pass = 'want';
            }
            if (pass === "x") {
                pass = 'xbox';
            }
            if (pass === "y") {
                pass = 'you';
            }
            if (pass === "z") {
                pass = 'zip';
            }
            pass = pass + ' ';
            string = string + pass;
        }
        return string;
    }
    $('#create').click(function() {
        var string = '';
        pass = '';
        if ($('#use-lowercase').prop('checked')) {
            string = string + "abcdefghijklmnopqrstuvwxyz";
        }
        if ($('#use-uppercase').prop('checked')) {
            string = string + "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        }
        if ($('#use-specialcharacter').prop('checked')) {
            string = string + "(){}[]-_+=/*<?/>,.:;|";
        }
        if ($('#use-number').prop('checked')) {
            string = string + "0123456789";
        }
        var word = string.split('');
        var i = 0;
        while (i < $('#passlength').val() * 1) {
            pass = pass + word[Math.floor((Math.random() * string.length))];
            i++;
        }
        $('#string').text(pass);
        $('#score').text(checkScoreOfPass(pass,$('#use-uppercase').prop('checked'),$('#use-specialcharacter').prop('checked'),
			$('#use-number').prop('checked')));
        $('#memo').text(memoOfPass(pass));
    });
});