import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { Action, ActionCreatorsMapObject } from "redux";
import {ActionType} from "./actionTypes";
import {StateType} from "../store/types";


/*****
 * The following section is a workaround from:
 * https://medium.com/@d.maklygin/redux-typescript-reuse-the-type-of-an-action-creators-return-value-91663a48858f
 * To allow typescript with actions - the way we're using them :)
 */

export type IsValidArg<T> = T extends Function ? true : T extends object ? keyof T extends never ? false : true : true;


type ArgumentTypes<T> = T extends (... args: infer U ) => infer R ? U: never;
type ReplaceReturnType<T, TNewReturn> = (...a: ArgumentTypes<T>) => TNewReturn;
type ActionCreatorResponse<T extends (...args: any[]) => any> = ReturnType<ReturnType<T>>
export type RemapActionCreators<T extends ActionCreatorsMapObject> = {
    [K in keyof T]: ReplaceReturnType<T[K], ActionCreatorResponse<T[K]>>
}

/** End of workaround */

export interface AppAction extends Action<ActionType> {}


export type AsyncAction<P, E extends Action> = ThunkAction<Promise<P>, StateType, null, E>;
export type Dispatch<E> = ThunkDispatch<StateType, E, AppAction>;
export type DispatchWithPayload<E, T extends AppAction> = ThunkDispatch<StateType, E, T>;
export type GetState = ()=>StateType;