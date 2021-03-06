function hasNativeRangeSupport(){
    rangeInput = document.createElement("input");
    rangeInput.setAttribute("type", "range");

    return (rangeInput.type.toLowerCase() === "range");
}

function updatePropertyList(demoSect, skipPrettyprint){
    var slider = demoSect.querySelector("x-slider");
    var proplist = demoSect.querySelector('.proplist');
    if((!slider) || (!proplist)) return;

    var propNames = ["value", "min", "max", "step", "polyfill"];
    var propKeys = [];
    for(var i = 0; i < propNames.length; i++){
        var propName = propNames[i];
        var val = slider[propName];
        if(typeof(val) === "string") val = '"'+val+'"';
        propKeys.push("." + propName + " -> " + val);
    }

    proplist.textContent = propKeys.join("\n");
    xtag.removeClass(proplist, "prettyprinted");
    if(!skipPrettyprint) prettyPrint(); 
}

var updateEventsDemo = function(){
    var nativeCounters = {
        "change": 0,
        "input": 0
    };
    var polyfillCounters = {
        "change": 0,
        "input": 0
    };
    var eventDemo = document.getElementById("event-demo");
    var markupEl = eventDemo.querySelector(".events");
    var nativeElem = eventDemo.querySelector("x-slider:first-of-type");
    var polyfillElem = eventDemo.querySelector("x-slider:last-of-type");
    return function(slider, eventType){
        if(eventType !== undefined && 
           (slider === nativeElem || slider === polyfillElem))
        {
            var isPolyfill = (slider === polyfillElem);
            var counters = (isPolyfill) ? polyfillCounters : nativeCounters;
            if(!(eventType in counters)){
                return;
            }
            counters[eventType]++;
        }
        markupEl.textContent = "<x-slider> input count: " + 
                                nativeCounters.input + 
                                "\n<x-slider> change count: " + 
                                nativeCounters.change + 
                                "\n<x-slider polyfill> input count: " + 
                                polyfillCounters.input + 
                                "\n<x-slider polyfill> change count: " + 
                                polyfillCounters.change;
    }
}();

document.addEventListener('DOMComponentsLoaded', function(){
    var supportsNative = hasNativeRangeSupport();
    var msgEl = document.getElementById("native-support-msg");
    msgEl.innerHTML = "<code class='prettyprint'>" +
                     "&lt;input type='range'&gt;</code> is <b>" + 
                     ((supportsNative) ? "" : " NOT") +
                     " natively</b> supported by this browser, so all "+
                     "<code class='prettyprint'>&lt;x-slider&gt;</code>"+
                     " demos will use a <b>" + 
                     ((supportsNative) ? "native" : "polyfill") + " UI</b>.";


    xtag.addEvent(document, "input:delegate(.demo-wrap)", function(e){
        updateEventsDemo(e.target, "input");
        updatePropertyList(this);
    });

    xtag.addEvent(document, "change:delegate(.demo-wrap)", function(e){
        updateEventsDemo(e.target, "change");
        updatePropertyList(this);
    });

    xtag.query(document, ".demo-wrap").forEach(function(demoSect){
        updateEventsDemo();
        updatePropertyList(demoSect, true);
    });

    var form = document.querySelector("form");
    form.addEventListener("submit", function(e){
        var inputElems = e.currentTarget.elements;
        var vals = "";
        for (var i = 0; i < inputElems.length; i++) {
            var input = inputElems[i];
            if(!input.name) break;

            vals += encodeURIComponent(input.name) + "=" + 
                    encodeURIComponent(input.value);
        }
        alert("submitted: " + vals);
        e.preventDefault();
        e.stopPropagation();
    });
    prettyPrint();
});