(function() {

  this.QuestionSelector = function(jsonConfig, container) {

    container.click(function(e){

      var createQuestion = function(data, index){
        questionId = "question_"+index;
        $("#question_selector").append("<div id="+questionId+" class='form_row question'><label>"+data.question+"</label><div class='field'><ul class='button_selection'></ul></div></div>");

        for (var i = 0; i < data.answers.length; i++) {
          answer = data.answers[i];
          answer.questionIndex = index;
          createAnswer(questionId, answer, i);
        }
      };

      var createAnswer = function(questionId, answer, index){
        answerId = questionId + "_answer_" + index;
        $("#question_selector #" + questionId + " ul.button_selection").append("<li><input type='radio' id="+answerId+" name='"+questionId+"_answer'><label for="+answerId+">"+answer.name+"</label></li>");

        $('#' + answerId).data('answer-data', answer);

        $('#' + answerId).change(function(e){

          answerData = $(e.target).data('answer-data');
          rowCount = $('.form_row.question, .form_row.result').length;
          if((answerData.questionIndex + 1) < rowCount){
            //We are selecting a question with an answer already
            //remove all rows after this
            $(this).closest('.form_row').nextAll('.form_row').remove()
            rowCount = $('.form_row.question, .form_row.result').length;
          }

          if('result' in answerData){
            $("#question_selector").append("<div class='form_row result'><b>"+answerData.result.name+"</b></div>");
          }else{
            createQuestion(answerData, rowCount);
          }
        });
      };

      data = JSON.parse(jsonConfig);

      $('main').html("<form id='question_selector'></form>");
      createQuestion(data, 0)

      e.preventDefault();
    });

  }
}());

