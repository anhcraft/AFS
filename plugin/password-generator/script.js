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
            if (lastStr == t) {
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
            if (pass == "a") {
                var pass = 'age';
            }
            if (pass == "b") {
                var pass = 'boss';
            }
            if (pass == "c") {
                var pass = 'come';
            }
            if (pass == "d") {
                var pass = 'dark';
            }
            if (pass == "e") {
                var pass = 'english';
            }
            if (pass == "f") {
                var pass = 'fly';
            }
            if (pass == "g") {
                var pass = 'game';
            }
            if (pass == "h") {
                var pass = 'home';
            }
            if (pass == "i") {
                var pass = 'ice';
            }
            if (pass == "j") {
                var pass = 'juice';
            }
            if (pass == "k") {
                var pass = 'king';
            }
            if (pass == "l") {
                var pass = 'lion';
            }
            if (pass == "m") {
                var pass = 'most';
            }
            if (pass == "n") {
                var pass = 'note';
            }
            if (pass == "o") {
                var pass = 'off';
            }
            if (pass == "p") {
                var pass = 'pen';
            }
            if (pass == "q") {
                var pass = 'queen';
            }
            if (pass == "r") {
                var pass = 'rar';
            }
            if (pass == "s") {
                var pass = 'ship';
            }
            if (pass == "t") {
                var pass = 'time';
            }
            if (pass == "u") {
                var pass = 'usa';
            }
            if (pass == "v") {
                var pass = 'visa';
            }
            if (pass == "w") {
                var pass = 'want';
            }
            if (pass == "x") {
                var pass = 'xbox';
            }
            if (pass == "y") {
                var pass = 'you';
            }
            if (pass == "z") {
                var pass = 'zip';
            }
            pass = pass + ' ';
            string = string + pass;
        }
        return string;
    }
    $('#create').click(function() {
        var string = '';
        var pass = '';
        if ($('#use-lowercase').prop('checked') == true) {
            string = string + "abcdefghijklmnopqrstuvwxyz";
        }
        if ($('#use-uppercase').prop('checked') == true) {
            string = string + "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        }
        if ($('#use-specialcharacter').prop('checked') == true) {
            string = string + "(){}[]-_+=/*<?/>,.:;|";
        }
        if ($('#use-number').prop('checked') == true) {
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