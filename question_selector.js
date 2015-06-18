(function() {

  this.QuestionSelector = function(jsonConfig, options) {
    this.result = null;
    this.alternatives = null;
    this.element = $("<div id='question_selector'>")

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

    var createQuestion = function(data, index){
      questionId = "question_"+index;
      $("#question_selector").append("<div id="+questionId+" class='question'><label>"+data.question+"</label><div class='field'><ul class='button_selection'></ul></div></div>");

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
      $('#' + answerId).change(onAnswerChange);
    };

    var onAnswerChange = function(event){
      self.element.trigger('selector:changed');

      answerData = $(event.target).data('answer-data');
      rowCount = $('.question').length;

      if((answerData.questionIndex + 1) < rowCount){
        //We are selecting a question with an answer already
        //remove all rows after this
        $(this).closest('.question').nextAll('.question').remove()
        rowCount = $('.question').length;
      }

      if('result' in answerData){
        self.result = answerData.result;
        self.alternatives = answerData.alternatives;
        self.element.trigger('selector:completed')
      }else{
        createQuestion(answerData, rowCount);
      }
    };

    try {
      data = JSON.parse(jsonConfig);
    }
    catch (e) { throw("Error parsing json config for Question Selector: " + e); }

    container.html(self.element);
    createQuestion(data, 0);
    self.element.trigger('selector:started');

  }
}());
