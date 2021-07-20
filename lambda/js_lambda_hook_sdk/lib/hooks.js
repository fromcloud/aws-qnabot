const _ = require("lodash");

module.exports = {

    steps: {
        PREPROCESS: "preproccess",
        POSTPROCESS: "postprocess",
        HOOK: "lambda_hook"
    },

    get_step: function (event) {
        return _.get(event, "req._fulfillment.step")
    },

    get_userInfo_property: function (event, property, default_value = undefined) {
        return _.get(event, "res._userInfo." + property, default_value)
    },

    list_settings: function (event) {
        return _.get(event, "req._settings", {})
    },

    get_setting: function (event, setting) {
        return this.list_settings(event)[setting]
    },

    list_response_card_buttons: function (event) {
        return _.get(event, "res.card.buttons", [])
    },

    get_args: function (event) {
        var args = _.get(event, "res.result.args");
        if (_isJson(args)) {
            return JSON.parse(args)
        }
        else
            return args

    },

    add_response_card_button: function (event, text, value, isQID = false, prepend = false) {
        let buttons = _.get(event, "res.card.buttons", undefined)
        if (buttons === undefined) {
            _.set(event, "res.card.buttons", [])
        }
        if (!prepend) {

            event.res.card.buttons.push({
                text: text,
                value: isQID ? "qid::" + value : value
            });
        } else {
            event.res.card.buttons.unshift({
                text: text,
                value: isQID ? "qid::" + value : value
            });
        }
    },

    set_response_card_imageurl: function (event, url) {
        _.set(event, "res.card.imageUrl", url)
    },

    get_response_card_imageurl: function (event) {
        _.get(event, "res.card.imageUrl", undefined)
    },

    set_response_card_title: function (event, title, overwrrite = true) {
        let card = _.get(event, "res.card.title", undefined)
        if (!card || (card && overwrrite)) {
            _.set(event, "res.card.title", title)
        }
        _.set(event, "res.card.send", true)
    },

    validate_response: function (event) {
        let card = _.get(event, "res.card", undefined)

        if (!card) {
            return card
        }

        if (card.title == undefined) {
            throw ("A response card was created without a title.  Set the title using set_response_card_title()")
        }

        let buttons = this.list_response_card_buttons(event)

        let imageUrl = this.get_response_card_imageurl(event)
        if (buttons.length == 0 && imageUrl == undefined) {
            throw ("If a response card is defined, either the imageUrl or buttons must be defined")
        }
        return event
    }
}

function _isJson(jsonString) {
    try {
        JSON.parse(jsonString);
        return true; // It's a valid JSON format
    } catch (e) {
        return false; // It's not a valid JSON format
    }
}









