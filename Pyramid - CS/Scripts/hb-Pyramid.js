
function CreatePyramidView() {
    // Grab the template script
    var theTemplateScript = $("#round-template").html();

    // Compile the template
    var theTemplate = Handlebars.compile(theTemplateScript);

    Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

        switch (operator) {
            case '==':
                return (v1 == v2) ? options.fn(this) : options.inverse(this);
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
    });
    // Pass our data to the template
    var theCompiledHtml = theTemplate(RoundData);
    // Add the compiled html to the page
    document.getElementById('finalhtml').innerHTML = theCompiledHtml;

    $.each($("#finalhtml div div"), function (index, tObj) {
        $(tObj).data("words", RoundData.Round.Categories.Category[index].Word);
        $(tObj).one("click", function (event) {
            wordList = $(event.target).data("words");
            $("#divCat" + index).attr("done","true");
        });
    });
    //ShowPyramidView();
};

function wordsTemplate(){
    var theTemplateScript = $("#words-template").html();
    var theTemplate = Handlebars.compile(theTemplateScript);
    var myWordTemp = JSON.stringify(wordList[0]);
    var theCompiledHTML = theTemplate(myWordTemp);
    $('#wordsview').html = theCompiledHTML;
}