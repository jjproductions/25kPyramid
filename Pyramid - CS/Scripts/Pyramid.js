var pData;
var ActiveCatID;
var currWords;
var dataPath = "@C:\Users\jbagby\Documents\Visual Studio 2015\WebSites\100kPyramid\App_Data\data";
var wordList;
var currentRound;
var currentWord;
var currentWords = [];
var interval;
var activeTeam = 1;
var pClock = 45000
var tScore1, tScore2, gameSummary = [];
var tName1 = "Team 1";
var tName2 = "Team 2";

/*//function showWordsView()
//{
//    document.getElementById("pnlWords").className="visible cssPanel";
//    document.getElementById("Roundtable").className="hide";
//}
//function showCatView()
//{
//    document.getElementById("pnlWords").className="hide";
//    document.getElementById("Roundtable").className="visible tableStyle";
//}
//function launchModal(url) {
//    alert('hi');
//    $('<div id=DialogDiv>').dialog("destroy");
//    $('<div id=DialogDiv>').dialog({
//        dialogClass: 'DynamicDialogStyle',
//        modal: true,
//        open: function () {
//            $(this).load(url);
//        },
//        close: function (e) {
//            $(this).empty();
//            $(this).dialog('destroy');
//        },
//        height: 350,
//        width: 540,
//        title: 'Round Selection'
//    });
//}

//function keyPress(e){
//    var code;
//    if (window.event) {
//        code = e.keyCode;
//    }
//    else
//        code = e.which;

//    if (code == 13) {//ENTER

//        alert("Enter");
//        updateWord();
//    }
//    else {//ESC
//    }
//}

//function keyEval() {
//    var ENTER = 13;
//    var SPACEBAR = 20;

//    if (keys.textContent == 'n' || keys.textContent == 'N') {
//        updateWord();
//    }
//    else if (keys.textContent == 'p' || keys.textContent == 'P') {
//        skipWord();
//    }
//}

//function updateWord() {

//    //alert("hi");
//    var i = myWords.indexOf(rCtrl_txtWords.value);
//    var tempMyWords = [];
//    if (myWords.length > 1) {
//        var y = 0;
//        for (var x = 0; x < myWords.length; x++) {
//            if (i != x) {
//                tempMyWords[y] = myWords[x];
//                y++;
//            }
//        }
//        myWords = tempMyWords;
//        if (i <= myWords.length - 1)
//            rCtrl_txtWords.value = myWords[i];
//        else
//            rCtrl_txtWords.value = myWords[0];
//    }
//    else {
//        categoryComplete("complete");
//    }
//}

//function categoryComplete(option) {
//    switch (option) {
//        case "complete":
//            rCtrl_txtWords.value = "Good Job!!!";
//            rCtrl_lblCountDown.style.color = "white";
//            break;
//        case "time":
//            if (!rCtrl_btnNext.disabled)
//                rCtrl_txtWords.value = "Sorry Time is Up!!!";
//            break;
//    }
//    rCtrl_btnNext.disabled = true;
//    rCtrl_btnSkip.disabled = true;
//    rCtrl_btnReturn.className = "buttonReturnVisible";
//    rCtrl_lblCountDown.innerHTML = "";
//}

//function skipWord() {
//    var i = myWords.indexOf(rCtrl_txtWords.value);
//    if (i < myWords.length - 1)
//        rCtrl_txtWords.value = myWords[i + 1];  //Show next word
//    else if (myWords.length > 1 && i == myWords.length - 1)
//        rCtrl_txtWords.value = myWords[0];  //Show the first word                
//}*/



    function checkPath(mPath) {

        alert(mPath);
    }

    function testing() {
        $.ajax({
            type: 'POST',
            url: './UIServices/Pyramid.asmx/HelloWorld',
            contentType: "application/json",
            success: ShowMyData,
            error: function () {
                alert('Error loading data');
            }
        });
    }

    function gameInitialize() {
        tScore1 = "{'score':'0','round':'0'}";
        tScore2 = "{'score':'0','round':'0'}";
        
        //gameSummary = [];
    }

   
    function TeamSetup() {
        if (gameSummary.length == 0) {
            //gameSummary = [{num:1,winner:'',team1Score:0,team2Score:0}];
        }
        else { }
        $("#divTeam1").html(tName1 + "<div>0</div>");
        $("#divTeam2").html(tName2 + "<div>0</div>");
    }

    $(function () {
        gameInitialize();
        TeamSetup();
        CreatePyramidView();
        ShowPyramidView();
    });

    $(document).keypress(function (e) {
        var code;
        var ENTER = 13;
        var SPACEBAR = 32;
        if (window.event) {
            code = e.keyCode;
        }
        else
            code = e.which;

        if (code == ENTER) {//ENTER
            //alert("Enter");
            NextWord(true);
        }
        else if (code == SPACEBAR) {//SPACEBAR
                //alert("Skip");
                NextWord(false);
        }
    });

    function ShowPyramidView(isRound) {
        if (isRound == undefined || isRound) {
            $("#btnNewGame").show();
            $("#scoreboard").show();
            $("#btnCircleGame").show();
            $("#btnStartCircle").hide();
            $("#btnBack").hide();
        }
        else {
            $("#btnNewGame").hide();
            $("#scoreboard").hide();
            $("#btnCircleGame").hide();
            $("#btnStartCircle").show();
            $("#btnBack").show();
        }
        $("#finalhtml").show();
        $("#wordsview").hide();
        $("#btnStartGame").hide();
        $("#divDescription").hide();
        $("#divCountDown").hide();
        
        //isRoundComplete();
    }

    function ShowWordsView() {
        $("#finalhtml").hide();
        $("#wordsview").show();
        $("#btnStartGame").hide();
        $("#btnNewGame").hide();
        $("#divDescription").hide();
        $("#divCountDown").show();
        $("#scoreboard").hide();
        $("#divPass").hide();
        $("#divNext").hide();
        $("#btnCircleGame").hide();
    }

    function Return() {
        NextRound();
    }
    function showCatDescription(id, description, isRound) {
        if ($('#' + id).attr("class") != 'background-gradient categoryBoxDisabled') {
            if (isRound == null || isRound)
                $("#btnStartGame").show();
            $('#' + id).prop("click", null)
                .addClass('categoryBoxDisabled')
                .html(description);
            $('#divDescription').html(description);
            $('#divDescription').show();
            toggleActiveTeam();
        }   
    }

    function showRoundSummary(_winner, _loser) {
        var round = gameSummary.length;
        var tieText = "Looks like we have a tie! <div class='hyperlink' onClick='javascript:decisionRound();'>Click here to go to the Tie-Breaker Round</div>";
        var errText = "Sorry, looks like an error occurred.";
        var goToNextRoundText = "<br/><div class='hyperlink' onclick='javascript:NextRound();return false;'>Click here to play another round</div>";
        $("#wordsview").hide();
        $("#btnNewGame").show();

        if (round == 0) {
            $("#RoundSummary").html(errText);
        }
        else if (gameSummary[round-1].winner == null)
        { $("#RoundSummary").html(tieText); }
        else {
            $("#RoundSummary").html("Round " + round + " Winner: " + gameSummary[round-1].winner + "<br/>Score: " + _winner + "-" + _loser + goToNextRoundText );
        }
        $("#RoundSummary").show();
    }

    function StartGame(index) {
        $("#finalhtml").hide();
        //wordsTemplate();
        currentWords = [];
        $("#divWord").html(wordList[index].__text);
        
        $.each(wordList, function (index, word) {
            currentWords.push(word.__text);
        });
        currentWord = currentWords[0];
        ShowWordsView();
        startTimer();
    }

    function CirclePhraseDisplay(index) {
        $("phr" + index).removeClass("phraseHidden");
        $("#divCat" + index).attr("done", "true");
        if ($("#divCountDown").is(":hidden")){
            $("#divCountDown").show();
            startTimer();
        }
    }
    function NextRound() {
        $("#RoundSummary").hide();
        getNextRoundData();
        TeamSetup();
        CreatePyramidView();
        ShowPyramidView();
    }

    function CircleRound() {
        $("#RoundSummary").hide();
        getNextRoundData(false);
        $("#scoreboard").hide();
        CreatePyramidView(false);
        ShowPyramidView(false);
    }

    function NextWord(success) {
        var i = currentWords.indexOf(currentWord);
        if (i < 0)
            return;
        var nWord = currentWord;
        var removeWord = true;
        
            if (i < currentWords.length-1) {
                nWord = currentWords[i + 1];
            }
            else if (currentWords.length == 1 && success) {
                currentWords = [];
                nWord = endGame(true);
            }
            else {
                nWord = currentWords[0];
            }

            if (success) {
                currentWords = $.grep(currentWords, function (x) {
                    return x != currentWord
                });
            }

        $("#divWord").html(nWord);
        currentWord = nWord;
    }

    function endGame(status) {
        var result;
        $("#divPass").hide();
        $("#divNext").hide();
        if (status) {
            clearInterval(interval);
            result = "Congratulations!";
            $("#divWord").html(result);
            if (isRoundComplete() != 0)
                setTimeout(function () { ShowPyramidView(); }, 2000);
        }
        else
        {
            result = "Sorry, not this time..."
            alert(result);
            if (isRoundComplete() != 0)
                ShowPyramidView();
        }
        $("#divCountDown").prop("style", "");
        $("#divCountDown").hide();
        return result;
    }
    
    function timer(time, update, complete) {
        var start = new Date().getTime();
        interval = setInterval(function () {
            var now = time - (new Date().getTime() - start);
            if (Math.floor(now / 1000) <= 0) { //(now <= 2) {
                clearInterval(interval);
                complete();
            }
            else update(Math.floor(now / 1000));
        }, 100);   // the smaller this number, the more accurate the timer will be
    }
    function startTimer() {
        timer(
        pClock, // milliseconds
        function (timeleft) { // called every step to update the visible countdown
            var t = timeleft - 1;
            $("#divCountDown").html(t.toString());
            if (t == 10) {
                $("#divCountDown").prop("style", "background:yellow");
            }
            else if (t == 5) {
                $("#divCountDown").prop("style", "background:red");
            }
            else if (t == 0) {                
                var x = endGame(false);
            }
        },
        function () { // what to do after
            //var x = endGame(false);
        }
    )
    }

    function updateScore() {
        var currScore = parseInt($("#divTeam" + activeTeam + " div").html());
        //var newScore = currScore + (wordList.length - currentWords.length);
        var newScore = wordList.length - currentWords.length;
        if (!isNaN(currScore))
            newScore = currScore + newScore;
        //alert("New Score is: " + newScore + "Current Div value is: " + $("#divTeam" + activeTeam + " div").html());
        $("#divTeam" + activeTeam + " div").html(newScore);
        
        //alert("New Div value is: " + $("#divTeam" + activeTeam + " div").html());
    }

    function ScoreUpdate() {
        var newScore;
    }

    function toggleActiveTeam()
    {
        if ($("#divTeam1").attr("class") == "float-left active")
        {
            $("#divTeam1").removeClass("active");
            $("#divTeam2").addClass("active");
            activeTeam = 2;
        }
        else
        {
            $("#divTeam1").addClass("active");
            $("#divTeam2").removeClass("active");
            activeTeam = 1;
        }
    }

    function isRoundComplete()
    {
        var isDone = 0;
        updateScore();
        $.each($("#finalhtml div div"), function (index, tObj) {
            if ($("#divCat" + index).attr("done") == "false")
            { isDone = isDone + 1; }
        });
        if (isDone==0)
        {

            var cScore1 = parseInt($("#divTeam1 div").html());
            var cScore2 = parseInt($("#divTeam2 div").html());
            var winner = "The winner of this round is ";
            var winningTeam;
            var winnerScore, loserScore;
            if (!isNaN(cScore1) & !isNaN(cScore2))
            {
                tScore1.score = parseInt(tScore1.score) + cScore1;
                tScore2.score = parseInt(tScore2.score) + cScore2;
                if (cScore1 > cScore2) {
                    winningTeam = tName1;
                    winner = winner + " " + winningTeam + " <br/>with a score of " + cScore1.toString();
                    winnerScore = cScore1;
                    loserScore = cScore2;
                    tScore1.round = parseInt(tScore1.round) + 1;
                }
                else if (cScore1 < cScore2) {
                    winningTeam = tName2;
                    winner = winner + " " + winningTeam + " <br/>with a score of " + cScore2.toString();
                    winnerScore = cScore2;
                    loserScore = cScore1;
                    tScore2.round = parseInt(tScore2.round) + 1;
                }
                else if (cScore1 == cScore2) {
                    winner = "";
                }
                gameSummary.push({ num: gameSummary.length + 1, winner: winningTeam, team1Score: cScore1, team2Score: cScore2 });
                showRoundSummary(winnerScore,loserScore)
            }
            
            //alert("Thanks for playing");
        }
        return isDone;
    }
    //function sendFilePath() {
    //     var fPath;
    //     fPath = window.document.getElementById('ctrlFiles_lstView_ctrl0_Td1_1').childNodes[1].value;
    //    $.ajax({
    //        type: 'GET',
    //        url: 'pyramid.asmx/SetData()',
    //        data: { filePath: fPath },
    //        success: function() {
    //            var x; },
    //    error: funciton() {};
            
    //    });
    
    //}
