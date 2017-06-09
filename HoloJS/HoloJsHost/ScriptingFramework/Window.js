﻿var window = (window ? window : {});

(function () {

    function makeLocation(href) {
        this.href = href;
    }
    
    window.drawCallback = null;
    window.location = new makeLocation(nativeInterface.window.getBaseUrl());

    window.requestAnimationFrame = function (callback) {
        window.drawCallback = callback;
    };

    // Mapping of type ids to strings;
    // JavaScript side registers events by string but the native side sends events with a numeric type for performance reasons
    window.nativeEvents = {};
    window.nativeEvents.spatialInputEvents = ["sourcepress", "sourcerelease", "sourcelost", "sourcedetected", "sourceupdate"];
    window.nativeEvents.keyboardEvents = ["keydown", "keyup"];
    window.nativeEvents.mouseEvents = ["mouseup", "mousedown", "mousemove", "mousewheel"];

    window.nativeEvents.events = ["resize", "mouse", "keyboard", "spatialinput"];
    window.nativeEvents.resize = 0;
    window.nativeEvents.mouse = 1;
    window.nativeEvents.keyboard = 2;
    window.nativeEvents.spatialinput = 3;

    window.nativeEvents.spatialinput = 3;

    function onMouseEvent(x, y, button, action) {
        if (!document.canvas) {
            return;
        }

        var mouseEvent = {};
        
        mouseEvent.buttons = button;

        // Native button parameter is actually MouseEvent.buttons. Convert it to MouseEvent.button now
        if (button & 1) {
            mouseEvent.button = 0;
        } else if (button & 2) {
            mouseEvent.button = 2;
        } else if (button & 4) {
            mouseEvent.button = 1;
        }

        mouseEvent.clientX = x;
        mouseEvent.clientY = y;

        mouseEvent.preventDefault = function () { };
        mouseEvent.srcElement = document.canvas;

        document.canvas.fireHandlersByType(window.nativeEvents.mouseEvents[action], mouseEvent);
        document.fireHandlersByType(window.nativeEvents.mouseEvents[action], mouseEvent);
    }

    function onSpatialInputEvent(x, y, z, isPressed, sourceKind, eventType) {
        var spatialInputEvent = {};

        spatialInputEvent.isPressed = isPressed;
        spatialInputEvent.location = { x: x, y: y, z: z };

        spatialInputEvent.preventDefault = function () { };
        spatialInputEvent.srcElement = document.canvas;
        spatialInputEvent.sourceKind = sourceKind;

        document.canvas.fireHandlersByType(window.nativeEvents.spatialInputEvents[eventType], spatialInputEvent);
    }

    function onKeyboardEvent(event) {
    }

    window.devicePixelRatio = 1;

    Object.defineProperty(window, "innerWidth", {
        get: function () {
            return nativeInterface.window.getWidth();
        }
    });

    Object.defineProperty(window, "innerHeight", {
        get: function () {
            return nativeInterface.window.getHeight()
        }
    });

    Object.defineProperty(window, "width", {
        get: function () {
            return nativeInterface.window.getWidth();
        }
    });

    Object.defineProperty(window, "height", {
        get: function () {
            return nativeInterface.window.getHeight()
        }
    });

    window.nativeCallback = function (type) {
        if (!type) {
            var capturedCallback = window.drawCallback;
            window.drawCallback = null;
            if (capturedCallback !== null) {
                capturedCallback();
            }
        } else if (type === window.nativeEvents.resize) {
            window.fireHandlersByType(window.nativeEvents.events[type]);
        } else if (type === window.nativeEvents.mouse) {
            onMouseEvent(arguments[1], arguments[2], arguments[3], arguments[4]);
        } else if (type === window.nativeEvents.keyboard) {
            onKeyboardEvent(arguments[1], arguments[2]);
        } else if (type === window.nativeEvents.spatialinput) {
            onSpatialInputEvent(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6])
        }
        else {
            window.fireHandlersByType(type);
        }
    };

    nativeInterface.extendWithEventHandling(window);

    nativeInterface.window.setCallback(window.nativeCallback);

    window.getViewMatrix = function () {
        return nativeInterface.window.holographicViewMatrix;
    };

    window.getCameraPositionVector = function () {
        return nativeInterface.window.holographicCameraPosition;
    };
})();