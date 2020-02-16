/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

const Hook = require("./Hook");
const HookCodeFactory = require("./HookCodeFactory");

const log = console.log

class SyncHookCodeFactory extends HookCodeFactory {
	constructor () {
		super()
		log('SyncHookCodeFactory')
	}
	content({ onError, onDone, rethrowIfPossible }) {
		log('SyncHookCodeFactory -> content')
		return this.callTapsSeries({
			onError: (i, err) => onError(err),
			onDone,
			rethrowIfPossible
		});
	}
}

const factory = new SyncHookCodeFactory();

const TAP_ASYNC = () => {
	throw new Error("tapAsync is not supported on a SyncHook");
};

const TAP_PROMISE = () => {
	throw new Error("tapPromise is not supported on a SyncHook");
};

const COMPILE = function(options) {
	log('SyncHook -> compile', options)
	factory.setup(this, options);
	return factory.create(options);
};

function SyncHook(args = [], name = undefined) {
	log('SyncHook', args)
	const hook = new Hook(args, name);
	hook.constructor = SyncHook;
	hook.tapAsync = TAP_ASYNC;
	hook.tapPromise = TAP_PROMISE;
	hook.compile = COMPILE;
	return hook;
}

SyncHook.prototype = null;

module.exports = SyncHook;
