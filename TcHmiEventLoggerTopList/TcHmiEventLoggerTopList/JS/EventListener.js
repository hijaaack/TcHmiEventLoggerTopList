// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../Packages/Beckhoff.TwinCAT.HMI.Framework.12.760.37/runtimes/native1.12-tchmi/TcHmi.d.ts" />

(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    // If you want to unregister an event outside the event code you need to use the return value of the method register()
    let destroyOnInitialized = TcHmi.EventProvider.register('onInitialized', (e, data) => {
        // This event will be raised only once, so we can free resources.
        // It's best practice to use destroy function of the event object within the callback function to avoid conflicts.
        e.destroy();

        // function to handle list of events - called on startup only
        function consumeEventList(data) {
            if (data.error === TcHmi.Errors.NONE) {
                createEventCountList(data.events);
            }
        }

        // function to handle new events that has been raised 
        function consumeEventSubscription(data) {
            //add event to list if it was raised
            if (data.error === TcHmi.Errors.NONE && data.changeType === TcHmi.Server.Events.ChangeType.AlarmRaised) {
                let tempList = [];
                tempList.push(data.event);
                createEventCountList(tempList);
            }
        }

        var countArray = [];
        const countMap = {};

        function createEventCountList(eventList) {

            // Iterate over the eventlist array 
            // - its possible to add more infromation to the user, add an console.log(eventList); to see everything that the event includes. 
            eventList.forEach(event => {
                const eventId = event.params.eventId;
                const eventText = event.text;

                // Check if the eventId already exists in the countMap
                if (countMap[eventId]) {
                    // Increment the count if it exists
                    countMap[eventId].count++;
                } else {
                    // Initialize the count to 1 if it doesn't exist
                    countMap[eventId] = {
                        count: 1,
                        eventText: eventText
                    };
                }
            });

            // Create a new array of objects with the count and eventText information
            countArray = Object.entries(countMap).map(([eventId, data]) => ({
                eventId: eventId,
                count: data.count,
                eventText: data.eventText
            }));

            // Sort the countArray in descending order based on count
            countArray.sort((a, b) => b.count - a.count);

            // Take only the top 10 objects
            const top10 = countArray.slice(0, 10);

            //Write to Internal Symbol
            TcHmi.Symbol.writeEx2("%i%TopEvents%/i%", top10);
        }

        //Configure the filter, same filter that is used in the EventGrid control. So it's possible to add more complex filter if needed.
        var filter = [
            {
                path: 'type',
                comparator: '==',
                value: TcHmi.Server.Events.Type.Alarm
            },
            {
                "logic": "AND"
            },
            {
                path: 'severity',
                comparator: '==',
                value: TcHmi.Server.Events.Severity.Error
            },
            {
                "logic": "OR"
            },
            {
                path: 'severity',
                comparator: '==',
                value: TcHmi.Server.Events.Severity.Critical
            },
        ];

        // register a consumer to receive events
        var destroyFunction = TcHmi.Server.Events.registerConsumer(filter, {
            list: consumeEventList,
            subscription: consumeEventSubscription
        });

    });
})(TcHmi);