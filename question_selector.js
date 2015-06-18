(function() {

  this.QuestionSelector = function(jsonConfig, trigger, options) {
    this.result = null;
    this.alternatives = null;
    this.element = $("<form id='question_selector'>")

    if (typeof(options)==='undefined') options = {};

    var self = this;
    var container = options.container;

    if(typeof container === 'undefined'){
      // Default container to 'main' element if there is one,
      // otherwise attach to body
      if($('main').length > 0){
        container = $('main');
      }else {
        container = $('body');
      }
    }

    //Wrap class events around main element events
    this.on = function(eventName, fn){
      self.element.on(eventName, fn);
    }

    trigger.click(function(e){

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
            self.result = answerData.result;
            self.alternatives = answerData.alternatives;
            self.element.trigger('selector:completed')
          }else{
            createQuestion(answerData, rowCount);
          }
        });
      };

      try {
        data = JSON.parse(jsonConfig);
      } catch (e) {
        throw("Error parsing json config for Question Selector: " + e);
        return;
      }

      container.html(self.element);
      createQuestion(data, 0);
      e.preventDefault();
    });

  }
}());
