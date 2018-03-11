import { IRunnable } from "./IRunnable";

export interface IComponent {
    init: (info: any) => IRunnable;
    destroy: () => void;
}
