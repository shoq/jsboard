function DomainEvent(eventName, sender) {

    var subscribers = [];

    this.raise = function(args) {
        subscribers.forEach(function(subscriber) {
            subscriber(sender, args);
        });
    };

    this.subscribe = function(subscriber) {
        subscribers.push(subscriber);
    };

}