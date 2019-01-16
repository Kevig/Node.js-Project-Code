class PublishEvent 
{

    constructor()
    {
        console.log('Constructor Called');
    }

    getEvent() { return this.event; }
    setEvent(anEvent) { this.event = anEvent; console.log('event set');}

    getEventType() { return this.eventType; }
    setEventType(anEventType) { this.eventType = anEventType; console.log('eventType set');}

};

module.exports = PublishEvent;