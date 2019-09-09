import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction, ApplicationState } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface CodingChallengeState {
    isLoading: boolean;
    input: CodingChallengeInput;
    codingChallenge?: CodingChallengeOutput;
}

export interface CodingChallengeOutput {
    // Amount of minutes that the crew requires to finish the number of images
    minutes: number;
    // How many images each crew member has edited
    crewProductivity: number[];
}

export interface CodingChallengeInput {
    // number of images that the crew needs to handle
    imageCount: number;
    // each crew member's speed in minutes needed per image to do photoshopping
    crewCapacity: number[];
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestCodingChallengeAction {
    type: 'REQUEST_CODING_CHALLENGE',
    input: CodingChallengeInput;
}

interface ReceiveCodingChallengeAction {
    type: 'RECEIVE_CODING_CHALLENGE',
    input: CodingChallengeInput;
    codingChallenge: CodingChallengeOutput
}


// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestCodingChallengeAction | ReceiveCodingChallengeAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export default function CallRest(input: CodingChallengeInput, dispatch: (action: KnownAction) => void, getState: () => ApplicationState, refresh: boolean = false) {
    if (input.crewCapacity.every(x => x >= 0) && input.imageCount >= 0 && ( refresh || JSON.stringify(input) !== JSON.stringify(getState().codingChallenge.input ))) {
        let fetchTask = fetch(`/api/CodingChallenge/CodingChallenge`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(input)
        })
            .then(response => response.json() as Promise<CodingChallengeOutput>)
            .then(data => {
                dispatch({ type: 'RECEIVE_CODING_CHALLENGE', input: input, codingChallenge: data });
            });

        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
        dispatch({ type: 'REQUEST_CODING_CHALLENGE', input: input });
    }
}

export const actionCreators = {
    requestCodingChallenge: (input: CodingChallengeInput, refresh:boolean = false): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        CallRest(input, dispatch, getState, refresh);
    },
    incrementCrewSize: (input: CodingChallengeInput): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // TODO: implement adding a crew member
        dispatch({ type: 'REQUEST_CODING_CHALLENGE', input: input });
    },
    decrementCrewSize: (input: CodingChallengeInput): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // TODO: implement removing a crew member
        //dispatch({ type: 'REQUEST_CODING_CHALLENGE', input: input });
        CallRest(input, dispatch, getState);
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: CodingChallengeState = { input: {imageCount: 1000, crewCapacity: [2,3,4]}, codingChallenge: undefined, isLoading: false };

export const reducer: Reducer<CodingChallengeState> = (state: CodingChallengeState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_CODING_CHALLENGE':
            return {
                input: action.input,
                codingChallenge: state.codingChallenge,
                isLoading: true
            };
        case 'RECEIVE_CODING_CHALLENGE':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            if (JSON.stringify(action.input) === JSON.stringify(state.input)) {
                return {
                    input: action.input,
                    codingChallenge: action.codingChallenge,
                    isLoading: false
                };
            }
            break;
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
