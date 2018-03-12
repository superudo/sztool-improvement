export interface IObserver {
    receiveNotification<T>(message: T): void;
}
