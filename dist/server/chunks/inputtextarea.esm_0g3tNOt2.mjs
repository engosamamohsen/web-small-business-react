import * as React from 'react';
import { useRef, useEffect } from 'react';
import { D as DomHandler, u as useMergeProps, P as PrimeReactContext, a as useHandleStyle, O as ObjectUtils, c as classNames, T as Tooltip, C as ComponentBase } from './button.esm_DKcfQX2F.mjs';

function useFirstMountState() {
    var isFirst = useRef(true);
    if (isFirst.current) {
        isFirst.current = false;
        return true;
    }
    return isFirst.current;
}

var useUpdateEffect = function (effect, deps) {
    var isFirstMount = useFirstMountState();
    useEffect(function () {
        if (!isFirstMount) {
            return effect();
        }
    }, deps);
};

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

var KeyFilter = {
  /* eslint-disable */
  DEFAULT_MASKS: {
    pint: /[\d]/,
    "int": /[\d\-]/,
    pnum: /[\d\.]/,
    money: /[\d\.\s,]/,
    num: /[\d\-\.]/,
    hex: /[0-9a-f]/i,
    email: /[a-z0-9_\.\-@]/i,
    alpha: /[a-z_]/i,
    alphanum: /[a-z0-9_]/i
  },
  /* eslint-enable */getRegex: function getRegex(keyfilter) {
    return KeyFilter.DEFAULT_MASKS[keyfilter] ? KeyFilter.DEFAULT_MASKS[keyfilter] : keyfilter;
  },
  onBeforeInput: function onBeforeInput(e, keyfilter, validateOnly) {
    // android devices must use beforeinput https://stackoverflow.com/questions/36753548/keycode-on-android-is-always-229
    if (validateOnly || !DomHandler.isAndroid()) {
      return;
    }
    this.validateKey(e, e.data, keyfilter);
  },
  onKeyPress: function onKeyPress(e, keyfilter, validateOnly) {
    // non android devices use keydown
    if (validateOnly || DomHandler.isAndroid()) {
      return;
    }
    if (e.ctrlKey || e.altKey || e.metaKey) {
      return;
    }
    this.validateKey(e, e.key, keyfilter);
  },
  onPaste: function onPaste(e, keyfilter, validateOnly) {
    if (validateOnly) {
      return;
    }
    var regex = this.getRegex(keyfilter);
    var clipboard = e.clipboardData.getData('text');

    // loop over each letter pasted and if any fail prevent the paste
    _toConsumableArray(clipboard).forEach(function (c) {
      if (!regex.test(c)) {
        e.preventDefault();
        return false;
      }
    });
  },
  validateKey: function validateKey(e, key, keyfilter) {
    if (key === null || key === undefined) {
      return;
    }

    // some AZERTY keys come in with 2 chars like ´ç if Dead key is pressed first
    var isPrintableKey = key.length <= 2;
    if (!isPrintableKey) {
      return;
    }
    var regex = this.getRegex(keyfilter);
    if (!regex.test(key)) {
      e.preventDefault();
    }
  },
  validate: function validate(e, keyfilter) {
    var value = e.target.value;
    var validatePattern = true;
    var regex = this.getRegex(keyfilter);
    if (value && !regex.test(value)) {
      validatePattern = false;
    }
    return validatePattern;
  }
};

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}

function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint);
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}

function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}

function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

var classes = {
  root: function root(_ref) {
    var props = _ref.props,
      context = _ref.context,
      isFilled = _ref.isFilled;
    return classNames('p-inputtextarea p-inputtext p-component', {
      'p-disabled': props.disabled,
      'p-filled': isFilled,
      'p-inputtextarea-resizable': props.autoResize,
      'p-invalid': props.invalid,
      'p-variant-filled': props.variant ? props.variant === 'filled' : context && context.inputStyle === 'filled'
    });
  }
};
var styles = "\n@layer primereact {\n    .p-inputtextarea-resizable {\n        overflow: hidden;\n        resize: none;\n    }\n    \n    .p-fluid .p-inputtextarea {\n        width: 100%;\n    }\n}\n";
var InputTextareaBase = ComponentBase.extend({
  defaultProps: {
    __TYPE: 'InputTextarea',
    __parentMetadata: null,
    autoResize: false,
    invalid: false,
    variant: null,
    keyfilter: null,
    onBlur: null,
    onFocus: null,
    onBeforeInput: null,
    onInput: null,
    onKeyDown: null,
    onKeyUp: null,
    onPaste: null,
    tooltip: null,
    tooltipOptions: null,
    validateOnly: false,
    children: undefined,
    className: null
  },
  css: {
    classes: classes,
    styles: styles
  }
});

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), true).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var InputTextarea = /*#__PURE__*/React.memo(/*#__PURE__*/React.forwardRef(function (inProps, ref) {
  var mergeProps = useMergeProps();
  var context = React.useContext(PrimeReactContext);
  var props = InputTextareaBase.getProps(inProps, context);
  var elementRef = React.useRef(ref);
  var cachedScrollHeight = React.useRef(0);
  var _InputTextareaBase$se = InputTextareaBase.setMetaData(_objectSpread(_objectSpread({
      props: props
    }, props.__parentMetadata), {}, {
      context: {
        disabled: props.disabled
      }
    })),
    ptm = _InputTextareaBase$se.ptm,
    cx = _InputTextareaBase$se.cx,
    isUnstyled = _InputTextareaBase$se.isUnstyled;
  useHandleStyle(InputTextareaBase.css.styles, isUnstyled, {
    name: 'inputtextarea'
  });
  var onFocus = function onFocus(event) {
    if (props.autoResize) {
      resize();
    }
    props.onFocus && props.onFocus(event);
  };
  var onBlur = function onBlur(event) {
    if (props.autoResize) {
      resize();
    }
    props.onBlur && props.onBlur(event);
  };
  var onKeyUp = function onKeyUp(event) {
    if (props.autoResize) {
      resize();
    }
    props.onKeyUp && props.onKeyUp(event);
  };
  var onKeyDown = function onKeyDown(event) {
    props.onKeyDown && props.onKeyDown(event);
    if (props.keyfilter) {
      KeyFilter.onKeyPress(event, props.keyfilter, props.validateOnly);
    }
  };
  var onBeforeInput = function onBeforeInput(event) {
    props.onBeforeInput && props.onBeforeInput(event);
    if (props.keyfilter) {
      KeyFilter.onBeforeInput(event, props.keyfilter, props.validateOnly);
    }
  };
  var onPaste = function onPaste(event) {
    props.onPaste && props.onPaste(event);
    if (props.keyfilter) {
      KeyFilter.onPaste(event, props.keyfilter, props.validateOnly);
    }
  };
  var onInput = function onInput(event) {
    var target = event.target;
    if (props.autoResize) {
      resize(ObjectUtils.isEmpty(target.value));
    }
    props.onInput && props.onInput(event);
    ObjectUtils.isNotEmpty(target.value) ? DomHandler.addClass(target, 'p-filled') : DomHandler.removeClass(target, 'p-filled');
  };
  var resize = function resize(initial) {
    var inputEl = elementRef.current;
    if (inputEl && isVisible()) {
      if (!cachedScrollHeight.current) {
        cachedScrollHeight.current = inputEl.scrollHeight;
        inputEl.style.overflow = 'hidden';
      }
      if (cachedScrollHeight.current !== inputEl.scrollHeight || initial) {
        inputEl.style.height = '';
        inputEl.style.height = inputEl.scrollHeight + 'px';
        if (parseFloat(inputEl.style.height) >= parseFloat(inputEl.style.maxHeight)) {
          inputEl.style.overflowY = 'scroll';
          inputEl.style.height = inputEl.style.maxHeight;
        } else {
          inputEl.style.overflow = 'hidden';
        }
        cachedScrollHeight.current = inputEl.scrollHeight;
      }
    }
  };
  var isVisible = function isVisible() {
    if (DomHandler.isVisible(elementRef.current)) {
      var rect = elementRef.current.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    }
    return false;
  };
  React.useEffect(function () {
    ObjectUtils.combinedRefs(elementRef, ref);
  }, [elementRef, ref]);
  React.useEffect(function () {
    if (props.autoResize) {
      resize(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.autoResize, props.value]);
  var isFilled = React.useMemo(function () {
    return ObjectUtils.isNotEmpty(props.value) || ObjectUtils.isNotEmpty(props.defaultValue);
  }, [props.value, props.defaultValue]);
  var hasTooltip = ObjectUtils.isNotEmpty(props.tooltip);
  var rootProps = mergeProps({
    ref: elementRef,
    className: classNames(props.className, cx('root', {
      context: context,
      isFilled: isFilled
    })),
    onFocus: onFocus,
    onBlur: onBlur,
    onKeyUp: onKeyUp,
    onKeyDown: onKeyDown,
    onBeforeInput: onBeforeInput,
    onInput: onInput,
    onPaste: onPaste
  }, InputTextareaBase.getOtherProps(props), ptm('root'));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("textarea", rootProps), hasTooltip && /*#__PURE__*/React.createElement(Tooltip, _extends({
    target: elementRef,
    content: props.tooltip,
    pt: ptm('tooltip')
  }, props.tooltipOptions)));
}));
InputTextarea.displayName = 'InputTextarea';

export { InputTextarea as I, KeyFilter as K, useUpdateEffect as u };
