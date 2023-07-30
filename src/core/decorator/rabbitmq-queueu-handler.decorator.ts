import { DecoratorMetaKey } from "../enum";

export const RabbitmqQueueuHandler = (queueName: string): MethodDecorator => {
    return (target, key, descriptor) => {
        Reflect.defineMetadata(
            DecoratorMetaKey.RABBITMQ_QUEUE_HANDLER,
            {
                queue: queueName
            },
            <Object>descriptor.value
        );
        return descriptor;
    };
};
