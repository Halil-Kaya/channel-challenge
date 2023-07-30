import { DecoratorMetaKey } from '../enum';

export const EventHandler = (eventName: string): MethodDecorator => {
    return (target, key, descriptor) => {
        Reflect.defineMetadata(
            DecoratorMetaKey.EVENT_HANDLER,
            {
                event: eventName
            },
            <Object>descriptor.value
        );
        return descriptor;
    };
};
