// if the game has started or not
var game = false;

// keyboard shortcuts 
document.addEventListener("keypress", (e) => {
    if(e.key == 'r' || e.key == ' ')
    {
        if(game)
        {
            roll();
        }
    }
    else if(e.key == 's')
    {
        start();
    }
    else if(e.key >= 1 && e.key <= 5)
    {
        if(game)
        {
            holdDie(e.key);
        }
    }
});

function start()
{
    dice = [];
    hold = [0,0,0,0,0];

    simpleScoreCount = 0;
    yahtzeeCount = 0;
    turnCount = 0;

    game = true;

    rollCount = 0;

    // show the roll button
    document.getElementById("rollButton").style.display = "inline-block";
    document.getElementById("startButton").innerHTML = "Restart"
 
    // reset values
    document.getElementById("score1").innerHTML = "";
    document.getElementById("score2").innerHTML = "";
    document.getElementById("score3").innerHTML = "";
    document.getElementById("score4").innerHTML = "";
    document.getElementById("score5").innerHTML = "";
    document.getElementById("score6").innerHTML = "";
    document.getElementById("subtotal").innerHTML = "";
    document.getElementById("bonus").innerHTML = "";
    document.getElementById("totalScore").innerHTML = "";
    document.getElementById("ofKind3").innerHTML = "";
    document.getElementById("ofKind4").innerHTML = "";
    document.getElementById("fullHouse").innerHTML = "";
    document.getElementById("straight4").innerHTML = "";
    document.getElementById("straight5").innerHTML = "";
    document.getElementById("chance").innerHTML = "";
    document.getElementById("yahtzee1").innerHTML = "";
    document.getElementById("yahtzee2").innerHTML = "";
    document.getElementById("yahtzee3").innerHTML = "";

    document.getElementById("rollCount").innerHTML = "Game started, roll dice to start";

    releaseAllDice();
}

function roll()
{
    // don't roll till the game has started
    if(game)
    {
        // only three rolls allowed
        if(rollCount == 3)
        {
            document.getElementById("rollCount").innerHTML = "Roll #"+rollCount + " -- out of rolls, choose a score category";
            return;        
        }
        
        rollCount++;
        
        // roll the dice that aren't held
        for(i=0; i<5; i++)
        {
            if(hold[i] == 0)
            {   
                result = Math.floor(Math.random()*6)+1;
                document.getElementById("spot"+(i+1)).src = "./images/dice"+result+".jpg"
                dice[i] = result;
            }
        }
        
        document.getElementById("rollCount").innerHTML = "Roll #"+rollCount;
    
    }   
}

function holdDie(i)
{
    if(rollCount != 0)
    {
        var dieStyle = document.getElementById("spot"+i).style
        
        if(dieStyle.border == "")
        {
            // holding die
            dieStyle.border = "solid 5px red";
            dieStyle.borderRadius = "20px";
            hold[i-1] = 1;
        }
        else
        {
            // releasing die
            dieStyle.border = "";
            hold[i-1] = 0;
        }   
    }
}

// release all the die
function releaseAllDice()
{
    hold = [0,0,0,0,0];

    for(i=1; i<=5; i++)
    {
        document.getElementById("spot"+i).style.border = "";
    }
}

// i couldn't come up with a better name for this category, 
// but its the 1s, 2s, ... 6s from the 'upper category'
function handleSimpleScore(n)
{
    if(rollCount != 0)
    {
        score = document.getElementById("score"+n)
        subtotal = document.getElementById("subtotal")
        
        if(score.innerHTML == "")
        {   
            score.innerHTML = countTimesValue(n);
            
            simpleScoreCount++;
            
            resetRoll();
            
            if(isNaN(parseInt(subtotal.innerHTML)))
            {
                subtotal.innerHTML = parseInt(score.innerHTML);
            }
            else
            {
                subtotal.innerHTML = parseInt(subtotal.innerHTML) + parseInt(score.innerHTML);
            }
        }

        // check for the bonus
        if(simpleScoreCount == 6)
        {
            sum = 0;
            
            for(i=1; i<=6; i++)
            {
                sum += parseInt(document.getElementById("score"+i).innerHTML)
            }
            
            if(sum > 62)
            {
                document.getElementById("bonus").innerHTML = "35";
            }
            else
            {
                document.getElementById("bonus").innerHTML = "0";
            }
        }
    }
}

// used with simpleScore
function countTimesValue(n)
{
    count = 0;
    dice.forEach( (num) => {
        if(num == n)
        {
            count++;
        }
    })
    return (n * count);
}

function handleOfKind(n)
{
    if(rollCount != 0)
    {
        if(document.getElementById("ofKind"+n).innerHTML == "")
        {       
            for(i=1; i<=6; i++)
            {
                count = 0;

                dice.forEach( (d) => {
                    if(d == i)
                    {
                        count++
                    }
                });
                
                if(count >= n)
                {
                    document.getElementById("ofKind"+n).innerHTML = sumDice();
                    
                    resetRoll();
                    
                    return;
                }
            }

            document.getElementById("ofKind"+n).innerHTML = "0";
                    
            resetRoll();
        }
    }
}

// this is used for the chance, 3ofK, 4ofK
function sumDice()
{
    sum = 0;
    dice.forEach( (d) => {
        sum += d;
    });
    return sum;
}

function resetRoll()
{
    rollCount = 0;
    releaseAllDice();
    turnCount++;

    document.getElementById("rollCount").innerHTML = "roll again for next turn"

    // this checks for end of game
    if(turnCount == 15 || (turnCount == 13 && (!isYahtzee())))
    {
        calcTotalScore();
    }
}

function handleFullHouse()
{
    if(rollCount != 0)
    {
        if(document.getElementById("fullHouse").innerHTML == "")
        {
            counts = [0,0,0,0,0,0];
            for(i=0; i<=6; i++)
            {
                dice.forEach( (d) => {
                    if(d == (i+1))
                    {
                        counts[i] += 1;
                    }
                });
            }
            
            if(counts.includes(2) && counts.includes(3))
            {
                document.getElementById("fullHouse").innerHTML = "25";
            }
            else
            {
                document.getElementById("fullHouse").innerHTML = "0";
            }
            resetRoll();

            // blah!

            
        }
    }
}

function handleChance()
{
    if(rollCount != 0)
    {
        if(document.getElementById("chance").innerHTML == "")
        {
            document.getElementById("chance").innerHTML = sumDice();

            resetRoll();
        }
    }
}

function handleStraight(n)
{
    if(rollCount != 0)
    {
        if(document.getElementById("straight"+n).innerHTML == "")
        {
            copy = [...dice];

            copy.sort( (a,b) => a-b );

            copy = [...new Set(copy)]
            
            ascCount = 0
            for(i=0; i<copy.length-1; i++)
            {
                if(copy[i]+1 == copy[i+1])
                {
                    ascCount++;
                }
            }

            if(ascCount >= (n-1))
            {
                if(n <= copy.length)
                {
                    if(n == 4)
                    {
                        document.getElementById("straight4").innerHTML = "30";
                    }
                    else if(n == 5)
                    {
                        document.getElementById("straight5").innerHTML = "40";
                    }
                    
                    resetRoll();
                }
                else
                {
                    document.getElementById("straight"+n).innerHTML = "0";

                    resetRoll();
                }
            }
            else
            {
                document.getElementById("straight"+n).innerHTML = "0";

                resetRoll();
            }
        }
    }
}

function isYahtzee()
{
    for(i=1; i<=6; i++)
    {
        count = 0;

        dice.forEach( (d) => {
            if(d == i)
            {
                count++
            }
        });
        
        if(count == 5)
        {
            return true;
        }
    }
    return false;
}

// this handles the yahtzee and bonus yahtzees
function handleYahtzee(y)
{
    if(rollCount != 0)
    {
        if(document.getElementById("yahtzee"+y).innerHTML == "")
        {
            if(y == 1)
            {
                if(isYahtzee())
                {
                    document.getElementById("yahtzee"+y).innerHTML = "50";

                    yahtzeeCount++;

                    resetRoll();
                }
                else
                {
                    document.getElementById("yahtzee1").innerHTML = "0";
                    document.getElementById("yahtzee2").innerHTML = "0";
                    document.getElementById("yahtzee3").innerHTML = "0";

                    turnCount += 2;

                    resetRoll();
                }
            }
            else
            {
                if(document.getElementById("yahtzee1").innerHTML == "50")
                {
                    if(isYahtzee())
                    {
                        document.getElementById("yahtzee"+y).innerHTML = "100"; 

                        resetRoll();
                    }
                    else
                    {
                        return;
                    }
                }
                else
                {
                    return;
                }
            }
        }
    }
}

function calcTotalScore()
{
    // sum the scores
    sum = parseInt(document.getElementById('subtotal').innerHTML) + 
        parseInt(document.getElementById('bonus').innerHTML) + 
        parseInt(document.getElementById('ofKind3').innerHTML) + 
        parseInt(document.getElementById('ofKind4').innerHTML) + 
        parseInt(document.getElementById('fullHouse').innerHTML) + 
        parseInt(document.getElementById('straight4').innerHTML) + 
        parseInt(document.getElementById('straight5').innerHTML) + 
        parseInt(document.getElementById('chance').innerHTML) + 
        parseInt(document.getElementById('yahtzee1').innerHTML);
        
    // sum if they got the bonus
    if(document.getElementById("yahtzee2").innerHTML != ""){
        sum += parseInt(document.getElementById('yahtzee2').innerHTML)
    }
    if(document.getElementById("yahtzee3").innerHTML != ""){
        sum += parseInt(document.getElementById('yahtzee3').innerHTML)
    }   

    document.getElementById('totalScore').innerHTML = sum;
    
    // TODO only do this if they have top 10

    save = confirm("Click OK to save your score, or hit cancel")

    if(save)
    {
        saveScore();
    }

    document.getElementById("rollCount").innerHTML = "Game over";
} 

function saveScore() 
{
    // get their name
    var name = prompt("Your name?");
    var score = document.getElementById("totalScore").innerHTML;

    // create a POST request and send
    if(name != '')
    {        
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/saveScore", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            name: name,
            score: score
        }));
    }
}