import { IRunnable } from "./IRunnable";

export interface IInitializable extends IRunnable {
    whenOk: (callback: () => void) => IInitializable;
    whenCancel: (callback: () => void) => IInitializable;
}