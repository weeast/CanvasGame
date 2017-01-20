var cg = cg || {};


/********************************************
 *                时序器
 *******************************************/

cg.PRIORITY_NON_SYSTEM = cg.PRIORITY_SYSTEM + 1;
cg.ListEntry = function (prev, next, target, priority, paused, markedForDeletion) {
    this.prev = prev;
    this.next = next;
    this.target = target;
    this.priority = priority;
    this.paused = paused;
    this.markedForDeletion = markedForDeletion;
};

cg.HashUpdateEntry = function (list, entry, target, hh) {
	this.list = list;
    this.entry = entry;
    this.target = target;
    this.hh = hh;
};

cg.HashTimerEntry = function (timers, target, timerIndex, currentTimer, currentTimerSalvaged, paused, hh) {
var _t = this;
    _t.timers = timers;
    _t.target = target;
    _t.timerIndex = timerIndex;
    _t.currentTimer = currentTimer;
    _t.currentTimerSalvaged = currentTimerSalvaged;
    _t.paused = paused;
    _t.hh = hh;
};

cg.Timer = cg.Class.extend(/** @lends cg.Timer# */{
    _interval:0.0,
    _callback:null,//is called _callback before

    _target:null,//target of _callback
    _elapsed:0.0,

    _runForever:false,
    _useDelay:false,
    _timesExecuted:0,
    _repeat:0, //0 = once, 1 is 2 x executed
    _delay:0,
    getInterval : function(){return this._interval;},
    setInterval : function(interval){this._interval = interval;},
    getCallback : function(){return this._callback},
    ctor:function (target, callback, interval, repeat, delay) {
        var self = this;
        self._target = target;
        self._callback = callback;
        self._elapsed = -1;
        self._interval = interval || 0;
        self._delay = delay || 0;
        self._useDelay = self._delay > 0;
        self._repeat = (repeat == null) ? cg.REPEAT_FOREVER : repeat;
        self._runForever = (self._repeat == cg.REPEAT_FOREVER);
    },

    _doCallback:function(){
        var self = this;
        if (cg.isString(self._callback))
            self._target[self._callback](self._elapsed);
        else // if (typeof(this._callback) == "function") {
            self._callback.call(self._target, self._elapsed);
    },

    update:function (dt) {
        var self = this;
        if (self._elapsed == -1) {
            self._elapsed = 0;
            self._timesExecuted = 0;
        } else {
            var locTarget = self._target, locCallback = self._callback;
            self._elapsed += dt;//standard timer usage
            if (self._runForever && !self._useDelay) {
                if (self._elapsed >= self._interval) {
                    if (locTarget && locCallback)
                        self._doCallback();
                    self._elapsed = 0;
                }
            } else {
                //advanced usage
                if (self._useDelay) {
                    if (self._elapsed >= self._delay) {
                        if (locTarget && locCallback)
                            self._doCallback();

                        self._elapsed = self._elapsed - self._delay;
                        self._timesExecuted += 1;
                        self._useDelay = false;
                    }
                } else {
                    if (self._elapsed >= self._interval) {
                        if (locTarget && locCallback)
                            self._doCallback();

                        self._elapsed = 0;
                        self._timesExecuted += 1;
                    }
                }

                if (self._timesExecuted > self._repeat)
                    cg.director.getScheduler().unscheduleCallbackForTarget(locTarget, locCallback);
            }
        }
    }
});

cg.Scheduler = cg.Class.extend({
    _timeScale:1.0,

    _updates : null, //_updates[0] list of priority < 0, _updates[1] list of priority == 0, _updates[2] list of priority > 0,

    _hashForUpdates:null, // hash used to fetch quickly the list entries for pause,delete,etc
    _arrayForUpdates:null,

    _hashForTimers:null, //Used for "selectors with interval"
    _arrayForTimes:null,

    _currentTarget:null,
    _currentTargetSalvaged:false,
    _updateHashLocked:false, //If true unschedule will not remove anything from a hash. Elements will only be marked for deletion.

    ctor:function () {
        var self = this;
        self._timeScale = 1.0;
        self._updates = [[], [], []];

        self._hashForUpdates = {};
        self._arrayForUpdates = [];

        self._hashForTimers = {};
        self._arrayForTimers = [];

        self._currentTarget = null;
        self._currentTargetSalvaged = false;
        self._updateHashLocked = false;
    },
    _removeHashElement:function (element) {
        delete this._hashForTimers[element.target.__instanceId];
        cg.arrayRemoveObject(this._arrayForTimers, element);
        element.Timer = null;
        element.target = null;
        element = null;
    },

    _removeUpdateFromHash:function (entry) {
        var self = this, element = self._hashForUpdates[entry.target.__instanceId];
        if (element) {
            //list entry
            cg.arrayRemoveObject(element.list, element.entry);

            delete self._hashForUpdates[element.target.__instanceId];
            cg.arrayRemoveObject(self._arrayForUpdates, element);
            element.entry = null;

            //hash entry
            element.target = null;
        }
    },

    _priorityIn:function (ppList, target, priority, paused) {
        var self = this, listElement = new cg.ListEntry(null, null, target, priority, paused, false);

        // empey list ?
        if (!ppList) {
            ppList = [];
            ppList.push(listElement);
        } else {
            var index2Insert = ppList.length - 1;
            for(var i = 0; i <= index2Insert; i++){
                if (priority < ppList[i].priority) {
                    index2Insert = i;
                    break;
                }
            }
            ppList.splice(i, 0, listElement);
        }

        //update hash entry for quick acgess
        var hashElement = new cg.HashUpdateEntry(ppList, listElement, target, null);
        self._arrayForUpdates.push(hashElement);
        self._hashForUpdates[target.__instanceId] = hashElement;

        return ppList;
    },

    _appendIn:function (ppList, target, paused) {
        var self = this, listElement = new cg.ListEntry(null, null, target, 0, paused, false);
        ppList.push(listElement);

        //update hash entry for quicker acgess
        var hashElement = new cg.HashUpdateEntry(ppList, listElement, target, null);
        self._arrayForUpdates.push(hashElement);
        self._hashForUpdates[target.__instanceId] = hashElement;
    },
    setTimeScale:function (timeScale) {
        this._timeScale = timeScale;
    },

    getTimeScale:function () {
        return this._timeScale;
    },
    update:function (dt) {
        var self = this;
        var locUpdates = self._updates, locArrayForTimers = self._arrayForTimers;
        var tmpEntry, elt, i, li;
        self._updateHashLocked = true;

        if (this._timeScale != 1.0) {
            dt *= this._timeScale;
        }

        for(i = 0, li = locUpdates.length; i < li && i >= 0; i++){
            var update = self._updates[i];
            for(var j = 0, lj = update.length; j < lj; j++){
                tmpEntry = update[j];
                if ((!tmpEntry.paused) && (!tmpEntry.markedForDeletion)) tmpEntry.target.update(dt);
            }
        }

        //Interate all over the custom callbacks
        for(i = 0, li = locArrayForTimers.length; i < li; i++){
            elt = locArrayForTimers[i];
            if(!elt) break;
            self._currentTarget = elt;
            self._currentTargetSalvaged = false;

            if (!elt.paused) {
                // The 'timers' array may change while inside this loop
                for (elt.timerIndex = 0; elt.timerIndex < elt.timers.length; elt.timerIndex++) {
                    elt.currentTimer = elt.timers[elt.timerIndex];
                    elt.currentTimerSalvaged = false;

                    elt.currentTimer.update(dt);
                    elt.currentTimer = null;
                }
            }

            if ((self._currentTargetSalvaged) && (elt.timers.length == 0)){
                self._removeHashElement(elt);
                i--;
            }
        }

        for(i = 0, li = locUpdates.length; i < li; i++){
            var update = self._updates[i];
            for(var j = 0, lj = update.length; j < lj; ){
                tmpEntry = update[j];
                if(!tmpEntry) break;
                if (tmpEntry.markedForDeletion) self._removeUpdateFromHash(tmpEntry);
                else j++;
            }
        }

        self._updateHashLocked = false;
        self._currentTarget = null;
    },
    scheduleCallbackForTarget:function (target, callback_fn, interval, repeat, delay, paused) {

        cg.assert(callback_fn, cg._LogInfos.Scheduler_scheduleCallbackForTarget_2);

        cg.assert(target, cg._LogInfos.Scheduler_scheduleCallbackForTarget_3);

        // default arguments
        interval = interval || 0;
        repeat = (repeat == null) ? cg.REPEAT_FOREVER : repeat;
        delay = delay || 0;
        paused = paused || false;

        var self = this, timer;
        var element = self._hashForTimers[target.__instanceId];

        if (!element) {
            // Is this the 1st element ? Then set the pause level to all the callback_fns of this target
            element = new cg.HashTimerEntry(null, target, 0, null, null, paused, null);
            self._arrayForTimers.push(element);
            self._hashForTimers[target.__instanceId] = element;
        }

        if (element.timers == null) {
            element.timers = [];
        } else {
            for (var i = 0; i < element.timers.length; i++) {
                timer = element.timers[i];
                if (callback_fn == timer._callback) {
                    cg.log(cg._LogInfos.Scheduler_scheduleCallbackForTarget, timer.getInterval().toFixed(4), interval.toFixed(4));
                    timer._interval = interval;
                    return;
                }
            }
        }

        timer = new cg.Timer(target, callback_fn, interval, repeat, delay);
        element.timers.push(timer);
    },
    scheduleUpdateForTarget:function (target, priority, paused) {
        if(target === null)
            return;
        var self = this, locUpdates = self._updates;
        var hashElement = self._hashForUpdates[target.__instanceId];

        if (hashElement) {
            // TODO: check if priority has changed!
            hashElement.entry.markedForDeletion = false;
            return;
        }

        // most of the updates are going to be 0, that's way there
        // is an special list for updates with priority 0
        if (priority == 0) {
            self._appendIn(locUpdates[1], target, paused);
        } else if (priority < 0) {
            locUpdates[0] = self._priorityIn(locUpdates[0], target, priority, paused);
        } else {
            // priority > 0
            locUpdates[2] = self._priorityIn(locUpdates[2], target, priority, paused);
        }
    },
    unscheduleCallbackForTarget:function (target, callback_fn) {
        // explicity handle nil arguments when removing an object
        if ((target == null) || (callback_fn == null)) {
            return;
        }

        var self = this, element = self._hashForTimers[target.__instanceId];
        if (element) {
            var timers = element.timers;
            for(var i = 0, li = timers.length; i < li; i++){
                var timer = timers[i];
                if (callback_fn == timer._callback) {
                    if ((timer == element.currentTimer) && (!element.currentTimerSalvaged)) {
                        element.currentTimerSalvaged = true;
                    }
                    timers.splice(i, 1)
                    //update timerIndex in case we are in tick;, looping over the actions
                    if (element.timerIndex >= i) {
                        element.timerIndex--;
                    }

                    if (timers.length == 0) {
                        if (self._currentTarget == element) {
                            self._currentTargetSalvaged = true;
                        } else {
                            self._removeHashElement(element);
                        }
                    }
                    return;
                }
            }
        }
    },
    unscheduleUpdateForTarget:function (target) {
        if (target == null) {
            return;
        }

        var self = this, element = self._hashForUpdates[target.__instanceId];
        if (element != null) {
            if (self._updateHashLocked) {
                element.entry.markedForDeletion = true;
            } else {
                self._removeUpdateFromHash(element.entry);
            }
        }
    },

    unscheduleAllCallbacksForTarget:function (target) {
        //explicit NULL handling
        if (target == null) {
            return;
        }

        var self = this, element = self._hashForTimers[target.__instanceId];
        if (element) {
            var timers = element.timers;
            if ((!element.currentTimerSalvaged) && (timers.indexOf(element.currentTimer) >= 0)) {
                element.currentTimerSalvaged = true;
            }
            timers.length = 0;

            if (self._currentTarget == element) {
                self._currentTargetSalvaged = true;
            } else {
                self._removeHashElement(element);
            }
        }
        // update callback
        self.unscheduleUpdateForTarget(target);
    },
    unscheduleAllCallbacks:function () {
        this.unscheduleAllCallbacksWithMinPriority(cg.Scheduler.PRIORITY_SYSTEM);
    },
    unscheduleAllCallbacksWithMinPriority:function (minPriority) {
        // Custom Selectors
        var self = this, locArrayForTimers = self._arrayForTimers, locUpdates = self._updates;
        for(var i = 0, li = locArrayForTimers.length; i < li; i++){
            // element may be removed in unscheduleAllCallbacksForTarget
            self.unscheduleAllCallbacksForTarget(locArrayForTimers[i].target);
        }
        for(var i = 2; i >= 0; i--){
            if((i == 1 && minPriority > 0) || (i == 0 && minPriority >= 0)) continue;
            var updates = locUpdates[i];
            for(var j = 0, lj = updates.length; j < lj; j++){
                self.unscheduleUpdateForTarget(updates[j].target);
            }
        }
    },
    pauseAllTargets:function () {
        return this.pauseAllTargetsWithMinPriority(cg.Scheduler.PRIORITY_SYSTEM);
    },
    pauseAllTargetsWithMinPriority:function (minPriority) {
        var idsWithSelectors = [];

        var self = this, element, locArrayForTimers = self._arrayForTimers, locUpdates = self._updates;
        // Custom Selectors
        for(var i = 0, li = locArrayForTimers.length; i < li; i++){
            element = locArrayForTimers[i];
            if (element) {
                element.paused = true;
                idsWithSelectors.push(element.target);
            }
        }
        for(var i = 0, li = locUpdates.length; i < li; i++){
            var updates = locUpdates[i];
            for(var j = 0, lj = updates.length; j < lj; j++){
                element = updates[j];
                if (element) {
                    element.paused = true;
                    idsWithSelectors.push(element.target);
                }
            }
        }
        return idsWithSelectors;
    },
    resumeTargets:function (targetsToResume) {
        if (!targetsToResume)
            return;

        for (var i = 0; i < targetsToResume.length; i++) {
            this.resumeTarget(targetsToResume[i]);
        }
    },
    pauseTarget:function (target) {

        cg.assert(target, cg._LogInfos.Scheduler_pauseTarget);

        //customer selectors
        var self = this, element = self._hashForTimers[target.__instanceId];
        if (element) {
            element.paused = true;
        }

        //update callback
        var elementUpdate = self._hashForUpdates[target.__instanceId];
        if (elementUpdate) {
            elementUpdate.entry.paused = true;
        }
    },
    resumeTarget:function (target) {

        cg.assert(target, cg._LogInfos.Scheduler_resumeTarget);

        // custom selectors
        var self = this, element = self._hashForTimers[target.__instanceId];

        if (element) {
            element.paused = false;
        }

        //update callback
        var elementUpdate = self._hashForUpdates[target.__instanceId];

        if (elementUpdate) {
            elementUpdate.entry.paused = false;
        }
    },
    isTargetPaused:function (target) {

        cg.assert(target, cg._LogInfos.Scheduler_isTargetPaused);

        // Custom selectors
        var element = this._hashForTimers[target.__instanceId];
        if (element) {
            return element.paused;
        }
        return false;
    }
});
cg.Scheduler.PRIORITY_SYSTEM = (-2147483647 - 1);