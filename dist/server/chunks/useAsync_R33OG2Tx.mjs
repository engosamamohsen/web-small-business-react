import { useRef, useCallback, useEffect, useState } from 'react';
import { __assign } from 'tslib';

function useMountedState() {
    var mountedRef = useRef(false);
    var get = useCallback(function () { return mountedRef.current; }, []);
    useEffect(function () {
        mountedRef.current = true;
        return function () {
            mountedRef.current = false;
        };
    }, []);
    return get;
}

function useAsyncFn(fn, deps, initialState) {
    if (deps === void 0) { deps = []; }
    if (initialState === void 0) { initialState = { loading: false }; }
    var lastCallId = useRef(0);
    var isMounted = useMountedState();
    var _a = useState(initialState), state = _a[0], set = _a[1];
    var callback = useCallback(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var callId = ++lastCallId.current;
        if (!state.loading) {
            set(function (prevState) { return (__assign(__assign({}, prevState), { loading: true })); });
        }
        return fn.apply(void 0, args).then(function (value) {
            isMounted() && callId === lastCallId.current && set({ value: value, loading: false });
            return value;
        }, function (error) {
            isMounted() && callId === lastCallId.current && set({ error: error, loading: false });
            return error;
        });
    }, deps);
    return [state, callback];
}

function useAsync(fn, deps) {
    if (deps === void 0) { deps = []; }
    var _a = useAsyncFn(fn, deps, {
        loading: true,
    }), state = _a[0], callback = _a[1];
    useEffect(function () {
        callback();
    }, [callback]);
    return state;
}

export { useAsync as u };
