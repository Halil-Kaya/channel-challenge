type EventHandlerOptions = {};
export const EventHandler = (eventName: string): MethodDecorator => {
    return (target, key, descriptor) => {
        Reflect.defineMetadata(
            'EVENT_HANDLER',
            {
                event: eventName
            },
            <Object>descriptor.value
        );
        return descriptor;
    };
};
