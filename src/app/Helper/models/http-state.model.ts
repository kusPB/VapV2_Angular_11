export interface IHttpState {
    url: string;
    state: HttpProgressState;
}

export enum HttpProgressState {
    start,
    end
}