class PubSub {
    constructor() {
        this.handlers = [];
    }

    subscribe(event, handler, context) {
        if (typeof context === 'undefined') {
            context = handler;
        }
        this.handlers.push({event: event, handler: handler.bind(context)});
    }

    publish(event, args) {
        this.handlers.forEach((topic) => {
            if (topic.event === event) {
                topic.handler(args)
            }
        })
    }
}

/*
 * Mediator Pattern
 */
class Mediator extends PubSub {
    constructor(opts) {
        super(); // get handlers
    }

    attachToObject(obj) {
        obj.handlers = [];
        obj.publish = this.publish;
        obj.subscribe = this.subscribe;
    }
}

var Billy = (function () {
    var messages = []

    return {
        setMsg(msg) {
            messages.push(msg)
            return messages
        },
        subscribeOn(channel, event) {
            {
                this.subscribe(channel, event);
            }
        }
    }
})();
var Rozy = (function () {
    var messages = []

    return {
        setMsg(msg) {
            messages.push(msg)
            return messages
        },
        sendMsg(channel, msg) {
            this.publish(channel, msg)
        },
        subscribeOn(channel, event) {
            this.subscribe(channel, event);
        }
    }
})();
var Jack = (function () {
    var messages = []

    return {
        setMsg(msg) {
            messages.push(msg)
            return messages
        },
        subscribeOn(channel, event) {
            {
                this.subscribe(channel, event);
            }
        }
    }
})();

var mediator = new Mediator()
mediator.attachToObject(Rozy)
mediator.attachToObject(Billy)
mediator.attachToObject(Jack)

Rozy.subscribeOn('rozy-from-billy', function (msg) {
    console.group('Billy sent first')
    Billy.setMsg(msg)
    console.log(msg)
    Jack.publish('rozy-to-jack', 'Sorry, i love Billy')
    console.groupEnd()
});
Rozy.subscribeOn('rozy-to-billy', function (msg) {
    console.group('rozy-to-billy')
    Rozy.setMsg(msg)
    console.log(msg)
    console.groupEnd()
});


Billy.subscribeOn('rozy-to-billy', function (msg) {
    console.group('rozy-to-billy')
    Rozy.setMsg(msg)
    console.log(msg)
    console.groupEnd()
});

Jack.subscribeOn('rozy-to-jack', function (msg) {
    console.group('rozy-to-jack')
    Rozy.setMsg(msg)
    console.log(msg)
    console.groupEnd()
})

// Rozy.sendMsg('rozy-from-jack', 'hi Rozy, i love you')
Rozy.sendMsg('rozy-from-billy', 'hi Rozy, i love you')
