const widgets = require("widget");
const tabs = require("tabs");
const pageMod = require("page-mod");
const measure = require("measure");
const panels = require("panel");
const data = require("self").data;

var startTime, readyTime, loadTime;
var enabled = false;

var measureEvent = function(value, type, url, name){
    if (!enabled && type == 'start'){
        return false;
    }

    
    if (name == '' && url == tabs.activeTab.url) {
        switch (type){
            case 'start':
                    console.log('')
                    console.log('SHOW TIME!')
                    startTime = value;
                    readyTime = null;
                    loadTime = null;
                break;

            case 'ready':
                // @todo Check if event is called by main page (not any iframe or something).
                if (readyTime == null && startTime){
                    readyTime = value-startTime;
                    var avgTime;
                    [time, avgTime] = measure.add(tabs.activeTab.url, readyTime);
                    console.log('READY TIME: ', (readyTime/1000.0)+'s. AVG: ', (avgTime/1000.0)+'s.');
                }
                break;

            case 'load':
                loadTime = value-startTime;
                measure.add(tabs.activeTab.url + '#load', loadTime);
                console.log('LOAD TIME: ', (loadTime/1000.0)+'s.');
                break;
        }
    }
};

// event called at start of loading page
pageMod.PageMod({
    include: "*",
    contentScript: 'self.port.emit("measureEvent", new Date().getTime(), "start", window.location.href, window.name);',
    contentScriptWhen: 'start',
    onAttach: function(worker) {
        worker.port.on('measureEvent', measureEvent);
    }
});

// event called at page load
pageMod.PageMod({
    include: "*",
    contentScript: 'self.port.emit("measureEvent", new Date().getTime(), "ready", window.location.href, window.name);',
    contentScriptWhen: 'ready',
    onAttach: function(worker) {
        worker.port.on('measureEvent', measureEvent);
    }
});

// event called at page load
pageMod.PageMod({
    include: "*",
    contentScript: 'self.port.emit("measureEvent", new Date().getTime(), "load", window.location.href, window.name);',
    contentScriptWhen: 'end',
    onAttach: function(worker) {
        worker.port.on('measureEvent', measureEvent);
    }
});

var icon = {
    enabled: data.url('widget/dom_enabled.png'),
    disabled: data.url('widget/dom_disabled.png'),
    loading: data.url('widget/dom_measuring.gif')
}

// tooltip part
var tooltipPanel = panels.Panel({
    width: 500,
    height: 260,
    contentURL: data.url('widget/tooltip.html'),
    contentScriptFile: [
        data.url('jquery-1.6.2.min.js'),
        data.url('jquery.tmpl.min.js'),
        data.url('widget/tooltip.js'),
        data.url('jquery.jqplot.min.js'),
        data.url('jqplot.highlighter.min.js'),
        data.url('jqplot.cursor.min.js')
    ]
});
tooltipPanel.port.on('widgetSwitch', function(state){
    enabled = state;
    tooltipPanel.port.emit('widgetSwitched', enabled);
    widget.contentURL = enabled ? icon.enabled : icon.disabled;
});

// widget part
var widget = widgets.Widget({
    id: "domcontentloader-widget",
    label: "DomContentLoaded",
    contentURL: icon.disabled,
    contentScriptWhen: 'ready',
    panel: tooltipPanel,
    contentScriptFile: data.url('widget/widget.js')
});
widget.port.on('left-click', function() {
    tooltipPanel.port.emit(
        'reloadContent',
        tabs.activeTab.url,
        [
            measure.getValues(tabs.activeTab.url),
            measure.getAvgs(tabs.activeTab.url)
        ]
    );
});