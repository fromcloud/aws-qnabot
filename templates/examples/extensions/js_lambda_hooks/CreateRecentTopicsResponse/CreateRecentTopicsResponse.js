const _ = require("lodash");
const hook = require("/opt/lib/hook")

exports.handler = async function (event, context) {
  let step = hook.get_step(event)
  let topics = hook.get_userInfo_property(event, "recentTopics", [])
  if (step == "postprocess") {
    if (topics.length == 0) {
      let recentTopicButton = hook.get_setting(event, "RECENT_TOPICS_BUTTON_VALUE")
      if (recentTopicButton) {
        let buttons = hook.list_response_card_buttons(event)
        let filteredButtons = buttons.filter(r => r.value != recentTopicButton)
        event.res.card.buttons = filteredButtons
      }
    }
    return event
  }

  if (step == "preprocess") {
    return event
  }
  //Retrieve the args passed in via the Content Designer
  var args = hook.get_args(event)
  var start = 0;
  var end = 3;
  if (args) {
    start = args.start != undefined ? args.start : start;
    end = args.end != undefined ? args.end : end;
  }

  hook.set_response_card_title("Recent Topics", false)

  //Retrieve the settings from the request object
  var settings = hook.list_settings(event);
  var topicMap = {},
    topicKey;
  for (var key of Object.keys(settings)) {
    if (key.startsWith("topic::")) {
      [, topicKey] = key.split("::");
      console.log(topicKey);
      topicMap[topicKey] = settings[key];
    }
  }

  //Retrieve the "recent topics" from the userInfo object.  
  //All properties stored in the DynamoDB table for a user will be part
  //of the res._userInfo object
  var userTopics = hook.get_userInfo_property(event, "recentTopics", []).sort((t1, t2) => {
    if (t1.dateTime == t2.dateTime) {
      return 0;
    }
    return t2.dateTime < t1.dateTime ? -1 : 1;
  });

  for (var userTopic of userTopics.slice(start, end)) {
    if (!(userTopic.topic in topicMap)) {
      continue;
    }
    var [description, qid] = topicMap[userTopic.topic].split("::");

    if (!description || !qid) {
      console.log(
        "WARNING: The topic mapping topic::" +
        userTopic.topic +
        " is not defined properly.  The format should be <description>::<QID>. Using the description as the value."
      );
    }

    hook.add_response_card_button(event, description, qid, true, true)


  }
  return hook.validate_response(event);
};
