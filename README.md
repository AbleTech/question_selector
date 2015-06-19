# QuestionSelector

A javascript plugin to read a JSON file and guide a user through a number of questions & answers to get a result.

### Requirements

- *bower* - if you don't have bower installed follow their installation instructions [here](http://bower.io/).

### Installation

Add the following line to your bower.json
```
"dependencies": {
  "question_selector": "git@github.com:Kiwibank/question_selector.git"
}
```

and then run

```bash
$ bower install
```

### Usage

####Setup

Include the question_selector.js and question_selector.scss files to make them accessable within your project.

To create a question selector on your page:
```javascript
  var selector = new QuestionSelector(jsonConfig, options);
```

#####Arguments:
- `jsonConfig`: a json object containing a the questions, answers and results. The structure of this file can be found [here](#json-config)
- `options` a object containing optional configuration values:
  + *container*: a jquery object containing the element which will contain the QuestionSelector. Defaults to 'main', or if there is no 'main' element then uses 'body'

####Events
You can then bind to the selector's events, access the results and use them as required

```javascript
  selector.on("selector:completed", function(){
    var result = selector.result;
    var alternatives = selector.alternatives;
    // Do something with the results
  });
```

#####Available Events:
- `selector:changed`: triggered everytime a user clicks on an answer.
- `selector:completed`: triggered when the user has selecter a answer which has a result.

#####Available Fields:
- `result`: The result of the last selected question. `null` if the question has more nested questions.
- `alternatives`: The list of alternative strings associated with the current result. `null` if the question has more nested questions or if a list of alternatives was not provided.
- 'element': the outermost div containing the question_selector

####<a name="json-config"></a>JSON config file

- *question*: a string of the question to be displayed
- *answers*: a list of the answers to be displayed
  + *name*: Name to be displayed on the answer
  + *question*: Additional question to be displayed if this answer is selected
  + *answers*: List of answers to the additional question to be displayed if this answer is selected
  + *result*: A string of the result of the user selecting this answer, if no more questions
  + *alternatives*: an optional list of additional strings to store with the result, if no more questions


Any number of questions can be nested within each answer.

Note that an answer attribute should be constructed to match the structure of either:
```
{
  name: ...,
  question: ...,
  answers: [...]
}
```

or
```
{
  name: ...,
  result: ...,
  (alternatives: [...])
}
```

#####*Example JSON config file:*

```javascript
{
  "question": "This is the first question you will see.",
  "answers": [
    {
      "name": "Answer 1",
      "question": "This is an additional question you will see if the user selects Answer 1",
      "answers": [
        {
          "name": "Yes",
          "result": "You selected yes",
          "alternatives": ["extra", "values", "here"]
        },
        {
          "name": "No",
          "result": "You selected no"
        }
      ]
    },
    {
      "name": "Answer 2",
      "question": "If Answer 2 is selected you will just see a result.",
      "result": "You just selected Answer 2. That was easy"
    }
  ]
}

```