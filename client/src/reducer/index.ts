import { combineReducers } from 'redux';
import { root as displayRecordsState, collectionState } from './collection';
import { State } from '../state';
import { UpdateTabChangedType } from '../action/record';
import * as _ from 'lodash';
import { uiState } from './ui';
import { userState } from './user';
import { teamState } from './team';
import { environmentState } from './environment';

export const reduceReducers = (...reducers) => {
    return (state, action) =>
        reducers.reduce(
            (p, r) => r(p, action),
            state
        );
};

export function rootReducer(state: State, action: any): State {
    const intermediateState = combineReducers<State>({
        collectionState,
        displayRecordsState,
        uiState,
        userState,
        teamState,
        environmentState
    })(state, action);

    const finalState = root(intermediateState, action);

    return finalState;
};

function root(state: State, action: any): State {
    switch (action.type) {
        case UpdateTabChangedType: {
            const record = action.record;
            const cid = record.collectionId;
            let isChanged = true;
            if (cid) {
                isChanged = !_.isEqual(state.collectionState.collectionsInfo.records[record.collectionId][record.id], record);
            }
            const recordState = state.displayRecordsState.recordStates;
            const index = recordState.findIndex(r => r.record.id === action.record.id);
            recordState[index].record = { ...action.record };
            recordState[index].isChanged = isChanged;
            return { ...state, displayRecordsState: { ...state.displayRecordsState, recordStates: [...recordState] } };
        }
        default: return state;
    }
}