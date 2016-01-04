function DomainEvent(eventName, sender) {

    var subscribers = [];

    this.raise = function() {
        subscribers.forEach(function(subscriber) {
            subscriber(sender);
        });
    };

    this.subscribe = function(subscriber) {
        subscribers.push(subscriber);
    };

}