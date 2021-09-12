module.exports = {
    log: function (...messages) {
        console.log(messages.map(message => filter(message)).join(" "))
    }
}

function filter_comprehend_pii(text) {
    console.log("Running filter comprehend pii")
    if (!process.env.found_comprehend_pii) {
        return text
    }

    let regex = process.env.found_comprehend_pii.split(",").map(pii => `(${pii})`).join("|")
    let re = new RegExp(regex, "g");

    return text.replace(re, "XXXXXX");

}
const filter = text => {

    console.log("Running filter")
    if (process.env.DISABLECLOUDWATCHLOGGING === "true") {
        return "cloudwatch logging disabled";
    } else {
        // always redact jwts
        if (typeof text === "object") {
            text = JSON.stringify(text)
        }
        if (typeof text !== 'string') {
            text = String(text)
        }
        if (text === undefined) {
            return ""
        }

        text = text.replace(/"accesstokenjwt":\s*"[^"]+?([^\/"]+)"/g, '"accesstokenjwt":"<token redacted>"');
        text = text.replace(/"idtokenjwt":\s*"[^"]+?([^\/"]+)"/g, '"idtokenjwt":"<token redacted>"');
        text = text.replace(/"refreshtoken":\s*"[^"]+?([^\/"]+)"/g, '"refreshtoken":"<token redacted>"');
        if (process.env.QNAREDACT === "true") {
            if (process.env.REDACTING_REGEX) {
                let re = new RegExp(process.env.REDACTING_REGEX, "g");
                text = text.replace(re, "XXXXXX");
            }
            text = filter_comprehend_pii(text)        }
    }
    return text
};

messages = `req is: 
{
    "_event": {
        "sessionId": "us-east-1:375451da-77e8-4876-898a-abaac8191c88",
        "inputTranscript": "Hello Zhang Wei, I am John. Your AnyCompany Financial Services, LLC credit card account 1111-0000-1111-0008 has a minimum payment of $24.53 that is due by July 31st. Based on your autopay settings, we will withdraw your payment on the due date from your bank account number XXXXXX1111 with the routing number XXXXX0000.   Your latest statement was mailed to 100 Main Street, Any City, WA 98121.  After your payment is received, you will receive a confirmation text message at 206-555-0100.  If you have questions about your bill, AnyCompany Customer Service is available by phone at 206-555-0199 or email at support@anycompany.com.",
        "interpretations": [
            {
                "intent": {
                    "slots": {},
                    "confirmationState": "None",
                    "name": "FallbackIntent",
                    "state": "ReadyForFulfillment"
                }
            }
        ],
        "responseContentType": "text/plain; charset=utf-8",
        "invocationSource": "FulfillmentCodeHook",
        "messageVersion": "1.0",
        "sessionState": {
            "sessionAttributes": {
                "qnabot_qid": "CustomNoMatches",
                "qnabot_gotanswer": "false",
                "qnabotcontext": "{\"previous\":{\"qid\":\"CustomNoMatches\",\"q\":\"Hello Zhang Wei, I am John. Your AnyCompany Financial Services, LLC credit card account 1111-0000-1111-0008 has a minimum payment of $24.53 that is due by July 31st. Based on your autopay settings, we will withdraw your payment on the due date from your bank account number XXXXXX1111 with the routing number XXXXX0000.   Your latest statement was mailed to 100 Main Street, Any City, WA 98121.  After your payment is received, you will receive a confirmation text message at 206-555-0100.  If you have questions about your bill, AnyCompany Customer Service is available by phone at 206-555-0199 or email at support@anycompany.com.\"},\"navigation\":{\"next\":\"\",\"previous\":[],\"hasParent\":true}}"
            },
            "intent": {
                "slots": {},
                "confirmationState": "None",
                "name": "FallbackIntent",
                "state": "ReadyForFulfillment"
            },
            "originatingRequestId": "57b3f0ec-275a-4c36-b1d0-ef1e786af16a"
        },
        "bot": {
            "aliasId": "H9XPGPCRBP",
            "aliasName": "live",
            "name": "QNA-prod-dev-master-2_QnaBot",
            "version": "3",
            "localeId": "en_US",
            "id": "TXFSFEHPQC"
        },
        "inputMode": "Text"
    },
    "_settings": {
        "ENABLE_DEBUG_RESPONSES": false,
        "ES_USE_KEYWORD_FILTERS": true,
        "ES_EXPAND_CONTRACTIONS": "{\"you're\":\"you are\",\"I'm\":\"I am\",\"can't\":\"cannot\"}",
        "ES_KEYWORD_SYNTAX_TYPES": "NOUN,PROPN,VERB,INTJ",
        "ES_SYNTAX_CONFIDENCE_LIMIT": ".20",
        "ES_MINIMUM_SHOULD_MATCH": "2<75%",
        "ES_NO_HITS_QUESTION": "no_hits",
        "ES_USE_FUZZY_MATCH": false,
        "ES_PHRASE_BOOST": "4",
        "ES_SCORE_ANSWER_FIELD": false,
        "ENABLE_SENTIMENT_SUPPORT": true,
        "ENABLE_MULTI_LANGUAGE_SUPPORT": false,
        "ENABLE_CUSTOM_TERMINOLOGY": false,
        "MINIMUM_CONFIDENCE_SCORE": 0.6,
        "ALT_SEARCH_KENDRA_FALLBACK_CONFIDENCE_SCORE": "HIGH",
        "ALT_SEARCH_KENDRA_FAQ_CONFIDENCE_SCORE": "HIGH",
        "ALT_SEARCH_KENDRA_INDEXES": "",
        "ALT_SEARCH_KENDRA_S3_SIGNED_URLS": true,
        "ALT_SEARCH_KENDRA_S3_SIGNED_URL_EXPIRE_SECS": 300,
        "ALT_SEARCH_KENDRA_MAX_DOCUMENT_COUNT": 2,
        "ALT_SEARCH_KENDRA_TOP_ANSWER_MESSAGE": "Amazon Kendra suggested answer.",
        "ALT_SEARCH_KENDRA_FAQ_MESSAGE": "Answer from Amazon Kendra FAQ.",
        "ALT_SEARCH_KENDRA_ANSWER_MESSAGE": "While I did not find an exact answer, these search results from Amazon Kendra might be helpful.",
        "ALT_SEARCH_KENDRA_RESPONSE_TYPES": "ANSWER,DOCUMENT,QUESTION_ANSWER",
        "ALT_SEARCH_KENDRA_ABBREVIATE_MESSAGE_FOR_SSML": true,
        "KENDRA_FAQ_INDEX": "",
        "KENDRA_FAQ_CONFIG_MAX_RETRIES": 8,
        "KENDRA_FAQ_CONFIG_RETRY_DELAY": 600,
        "KENDRA_FAQ_ES_FALLBACK": true,
        "ENABLE_KENDRA_WEB_INDEXER": false,
        "KENDRA_INDEXER_URLS": "",
        "KENDRA_INDEXER_CRAWL_DEPTH": 3,
        "KENDRA_INDEXER_SCHEDULE": "rate(1 day)",
        "KENDRA_WEB_PAGE_INDEX": "",
        "ERRORMESSAGE": "Unfortunately I encountered an error when searching for your answer. Please ask me again later.",
        "EMPTYMESSAGE": "You stumped me! Sadly I do not know how to answer your question.",
        "DEFAULT_ALEXA_LAUNCH_MESSAGE": "Hello, Please ask a question",
        "DEFAULT_ALEXA_REPROMPT": "Please either answer the question, ask another question or say Goodbye to end the conversation.",
        "DEFAULT_ALEXA_STOP_MESSAGE": "Goodbye",
        "SMS_HINT_REMINDER_ENABLE": true,
        "SMS_HINT_REMINDER": " (Feedback? Reply THUMBS UP or THUMBS DOWN. Ask HELP ME at any time)",
        "SMS_HINT_REMINDER_INTERVAL_HRS": "24",
        "IDENTITY_PROVIDER_JWKS_URLS": [],
        "ENFORCE_VERIFIED_IDENTITY": false,
        "NO_VERIFIED_IDENTITY_QUESTION": "no_verified_identity",
        "ELICIT_RESPONSE_MAX_RETRIES": 3,
        "ELICIT_RESPONSE_RETRY_MESSAGE": "Please try again?",
        "ELICIT_RESPONSE_BOT_FAILURE_MESSAGE": "Your response was not understood. Please start again.",
        "ELICIT_RESPONSE_DEFAULT_MSG": "Ok. ",
        "CONNECT_IGNORE_WORDS": "",
        "CONNECT_ENABLE_VOICE_RESPONSE_INTERRUPT": false,
        "CONNECT_NEXT_PROMPT_VARNAME": "connect_nextPrompt",
        "ENABLE_REDACTING": true,
        "REDACTING_REGEX": "\\b\\d{4}\\b(?![-])|\\b\\d{9}\\b|\\b\\d{3}-\\d{2}-\\d{4}\\b",
        "PII_REJECTION_ENABLED": true,
        "PII_REJECTION_QUESTION": "pii_rejection_question",
        "PII_REJECTION_WITH_COMPREHEND": true,
        "PII_REJECTION_REGEX": "\\b\\d{4}\\b(?![-])|\\b\\d{9}\\b|\\b\\d{3}-\\d{2}-\\d{4}\\b",
        "PII_REJECTION_IGNORE_TYPES": "Name,Address",
        "DISABLE_CLOUDWATCH_LOGGING": false,
        "MINIMAL_ES_LOGGING": false,
        "S3_PUT_REQUEST_ENCRYPTION": "",
        "BOT_ROUTER_WELCOME_BACK_MSG": "Welcome back to QnABot.",
        "BOT_ROUTER_EXIT_MSGS": "exit,quit,goodbye,leave",
        "RUN_LAMBDAHOOK_FROM_QUERY_STEP": true,
        "LAMBDA_PREPROCESS_HOOK": "",
        "LAMBDA_POSTPROCESS_HOOK": "",
        "DEFAULT_USER_POOL_JWKS_URL": "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_MHRD5IAFS/.well-known/jwks.json"
    },
    "_type": "LEX",
    "_lexVersion": "V2",
    "_userId": "us-east-1:375451da-77e8-4876-898a-abaac8191c88",
    "intentname": "FallbackIntent",
    "question": "pii_rejection_question",
    "session": {
        "qnabot_qid": "CustomNoMatches",
        "qnabot_gotanswer": false,
        "qnabotcontext": {
            "previous": {
                "qid": "CustomNoMatches",
                "q": "Hello Zhang Wei, I am John. Your AnyCompany Financial Services, LLC credit card account 1111-0000-1111-0008 has a minimum payment of $24.53 that is due by July 31st. Based on your autopay settings, we will withdraw your payment on the due date from your bank account number XXXXXX1111 with the routing number XXXXX0000.   Your latest statement was mailed to 100 Main Street, Any City, WA 98121.  After your payment is received, you will receive a confirmation text message at 206-555-0100.  If you have questions about your bill, AnyCompany Customer Service is available by phone at 206-555-0199 or email at support@anycompany.com."
            },
            "navigation": {
                "next": "",
                "previous": [],
                "hasParent": true
            }
        },
        "userPrefs": {}
    },
    "_preferredResponseType": "PlainText",
    "_clientType": "LEX.Text",
    "sentiment": "NEUTRAL",
    "sentimentScore": {
        "Positive": 0.0007247643661685288,
        "Negative": 0.012237872928380966,
        "Neutral": 0.9870284795761108,
        "Mixed": 0.000008856321983330417
    },
    "_fulfillment": {
        "step": "preprocess"
    },
    "_userInfo": {
        "UserId": "us-east-1:375451da-77e8-4876-898a-abaac8191c88",
        "InteractionCount": 3,
        "FirstSeen": "Sun Sep 12 2021 16:22:47 GMT+0000 (Coordinated Universal Time)",
        "LastSeen": "Sun Sep 12 2021 16:23:53 GMT+0000 (Coordinated Universal Time)",
        "TimeSinceLastInteraction": 1619.085,
        "recentTopics": [],
        "isVerifiedIdentity": "false"
    },
    "_info": {
        "es": {
            "address": "search-qna-pro-elasti-pppoc084wb58-tjsezpiayimz6lj2shzanyuo5m.us-east-1.es.amazonaws.com",
            "index": "qna-prod-dev-master-2",
            "type": "qna",
            "service": {
                "qid": "QNA-prod-dev-master-2-ESQidLambda-mWA2htqS6aD5",
                "proxy": "QNA-prod-dev-master-2-ESProxyLambda-YQEbay5RH6RN"
            }
        }
    }
}`

messages = [JSON.stringify(messages, null, 2)]
process.env.found_comprehend_pii = "1111-0000-1111-0008"
process.env.QNAREDACT = "true"
//console.log(filter(messages))

let text = messages.map(message => filter(message)).join(" ")
let y