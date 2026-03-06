import { __spreadArrays, __assign } from 'tslib';
import { useState, useCallback } from 'react';
import { u as useAsync } from './useAsync_R33OG2Tx.mjs';

var useAsyncRetry = function (fn, deps) {
    if (deps === void 0) { deps = []; }
    var _a = useState(0), attempt = _a[0], setAttempt = _a[1];
    var state = useAsync(fn, __spreadArrays(deps, [attempt]));
    var stateLoading = state.loading;
    var retry = useCallback(function () {
        if (stateLoading) {
            if (process.env.NODE_ENV === 'development') {
                console.log('You are calling useAsyncRetry hook retry() method while loading in progress, this is a no-op.');
            }
            return;
        }
        setAttempt(function (currentAttempt) { return currentAttempt + 1; });
    }, __spreadArrays(deps, [stateLoading]));
    return __assign(__assign({}, state), { retry: retry });
};

export { useAsyncRetry as u };
