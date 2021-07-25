

# Methods

These are the available methods:

- [get_step](#get_step)
- [get_args](#get_args)
- [get_lex_event](#get_lex_event)
- [get_bot](#get_bot)
- [list_settings](#list_settings)
- [get_setting](#get_setting)
- [get_sentiment](#get_sentiment)
- [list_session_attributes](#get_session_attributes)
- [add_session_attribute](#add_session_attribute)
- [list_user_attributes](list_user_attributes)
- [get_user_attribute](#get_user_attribute)
- [add_user_attribute](add_user_attribute)
- list_response_card_buttons
- add_response_card_button
- get_response_card_imageurl
- set_response_card_imageurl
- set_response_card_title
- get_message
- set_message
- get_es_result
- get_answer_source
- get_question
- get_result
- validate_response

## get_step

A Lambda hook can be called as the first step in the fulfillment pipeline (PREPROCESS), as part of processing a specific question (HOOK) or after processing has completed (POSTPROCESS ) and before the ```userInfo``` is save to DynamoDB and the result has been sent back to the client.  

### Request Syntax

```get_step(event)```

### Parameters

event - the Lambda event passed to the handler

### Return Type

string

### Returns

```PREPROCESS | POSTPROCESS | HOOK```


## get_args

Returns the arguments specified in the Content Designer when a Lambda is called as a ```HOOK```.

### Request Syntax

```get_args(event)```

### Parameters

event - the Lambda event passed to the handler

### Return Type

object or string - if the argument specified in Content Designer is valid JSON, it is deserialized and
returned as an object.  Otherwise, a string is returned.


## get_lex_event

Returns the event object received from the Amazon Lex service.

### Request Syntax

```get_lex_event(event)```

### Parameters

event - the Lambda event passed to the handler

### Return Type

object

### Returns

- Lex V1 - [https://docs.aws.amazon.com/lex/latest/dg/lambda-input-response-format.html](https://docs.aws.amazon.com/lex/latest/dg/lambda-input-response-format.html)
- Lex V2 - [https://docs.aws.amazon.com/lexv2/latest/dg/lambda.html](https://docs.aws.amazon.com/lexv2/latest/dg/lambda.html)

## get_bot

Returns the arguments specified in the Content Designer when a Lambda is called as a ```HOOK```.

### Request Syntax

```get_args(event)```

### Parameters

event - the Lambda event passed to the handler

### Return Type

object

### Returns

```
"bot": {
    "aliasId": "xxxxx",
    "aliasName": "live",
    "name": "<Lex bot name>",
    "version": "<version number>",
    "localeId": "<language code>",
    "id": "<bot id>
},
```

## get_bot

Returns the arguments specified in the Content Designer when a Lambda is called as a ```HOOK```.

### Request Syntax

```get_args(event)```

### Parameters

event - the Lambda event passed to the handler

### Return Type

object

### Returns

```
"bot": {
    "aliasId": "xxxxx",
    "aliasName": "live",
    "name": "<Lex bot name>",
    "version": "<version number>",
    "localeId": "<language code>",
    "id": "<bot id>
},
```

## list_settings

Returns the user's current settings

### Request Syntax

```get_settings(event)```

### Parameters

event - the Lambda event passed to the handler

### Return Type

object

### Returns

```
{
"ENABLE_DEBUG_RESPONSES": false,
"ES_USE_KEYWORD_FILTERS": true,
"ES_KEYWORD_SYNTAX_TYPES": "NOUN,PROPN,VERB,INTJ",
"ES_SYNTAX_CONFIDENCE_LIMIT": ".20"
...
}
```

## get_settings

Returns the user's current settings

### Request Syntax

```get_settings(event,setting)```

### Parameters

- event - the Lambda event passed to the handler
- setting - the name of the setting

### Returns

string

## get_sentiment

Returns the sentiment of the user's question as measured by Amazon Comprehend

### Request Syntax

```get_sentiment(event)```

### Parameters

- event - the Lambda event passed to the handler

### Return Type

object

### Returns

```
{
    "sentiment": "POSITIVE" | "NEUTRAL" | "MIXED" | "NEGATIVE"
    "sentimentScore": {
        "Positive": percent,
        "Negative": percent,
        "Neutral": percent,
        "Mixed": percent
},
```

See [here](https://docs.aws.amazon.com/comprehend/latest/dg/API_DetectSentiment.html)

## get_session_attributes

Returns the [Lex Session Attributes](https://docs.aws.amazon.com/connect/latest/adminguide/how-to-use-session-attributes.html). Depending on where the Lambda is called in the process,
the session attributes may be in the request or response.  This returns attributes in the request merged with the attributes in the response object.  The attributes in the response take precedence in the case of a conflict.

### Request Syntax

```get_sentiment(event)```

### Parameters

- event - the Lambda event passed to the handler

### Return Type

object

### Returns

```
{
    "qnabotcontext": "...",
    "appContext": "...",
    "qnabot_qid": "...",
    "qnabot_gotanswer": "..."
    ....
}
```

See [here](https://docs.aws.amazon.com/comprehend/latest/dg/API_DetectSentiment.html) for more information.

## add_session_attribute

Adds a session attribute to the response object that will be returned to the client.

### Request Syntax

```get_sentiment(event,key,value)```

### Parameters

- event - the Lambda event passed to the handler
- key - the name of the attribute
- value - the value of the attribute


### Return Type

n/a

See [here](https://docs.aws.amazon.com/comprehend/latest/dg/API_DetectSentiment.html) for more information.

## list_user_attributes

Returns the user attributes that are stored in DynamoDB per user. If the user is logged in, the session is permanently associated with the user across devices.  If the user is not logged in, the session is saved based on a temporary ID assigned by QnABot's [Identity Pool](https://docs.aws.amazon.com/cognito/latest/developerguide/identity-pools.html) 

Depending on where the Lambda is called in the process, the session attributes may be in the request or response.  This returns attributes in the request merged with the attributes in the response object.  The attributes in the response take precedence in the case of a conflict.

### Request Syntax

```list_user_attributes(event)```

### Parameters

- event - the Lambda event passed to the handler

### Return Type

object

### Returns

```
 {
    "UserId": "xxxx",
    "InteractionCount": integer,
    "isVerifiedIdentity": bool,
    "TimeSinceLastInteraction": <number>
    ....
}
```

If the user is logged in, more information is available such as the user name, email address, and first and last name. 

## add_user_attribute

Adds a user attribute to the response object that will be stored in DynamoDB. These properties will *not* be returned to the client. But they are available to both the processing pipeline and can be used as part of HandleBars processing.


### Request Syntax

```get_sentiment(event,key,value)```

### Parameters

- event - the Lambda event passed to the handler
- key - the name of the attribute
- value - the value of the attribute


### Return Type

n/a

## list_response_card_buttons

QnABot uses [Response Cards](https://aws.amazon.com/blogs/machine-learning/creating-a-question-and-answer-bot-with-amazon-lex-and-amazon-alexa/#buttons) to add buttons to answers.

This function returns a list of buttons attached to the answer

### Request Syntax

```list_response_card_buttons(event)```

### Parameters

- event - the Lambda event passed to the handler

### Return Type

list of object

### Returns

```
[
    {
        text: "button1 text",
        value: "button1 value"
    },
    {
        text: "button2 text",
        value: "button2 value"
    }
]
```

