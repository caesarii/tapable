/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

const SyncHook = require("../SyncHook");

describe("Hook", () => {
	it("should allow to insert hooks before others and in stages", () => {

		// 这个测试的基本原理: hook 会对所有 tapCallback 排序, 这个排序决定了 calls 中字母的顺序
		const hook = new SyncHook();

		const calls = [];
		hook.tap("A", () => calls.push("A"));
		hook.tap(
			{
				name: "B",
				before: "A"
			},
			() => calls.push("B")
		);

		calls.length = 0;
		hook.call();
		expect(calls).toEqual(["B", "A"]);

		hook.tap(
			{
				name: "C",
				before: ["A", "B"]
			},
			() => calls.push("C")
		);

		calls.length = 0;
		hook.call();
		expect(calls).toEqual(["C", "B", "A"]);

		hook.tap(
			{
				name: "D",
				before: "B"
			},
			() => calls.push("D")
		);

		calls.length = 0;
		hook.call();
		expect(calls).toEqual(["C", "D", "B", "A"]);

		hook.tap(
			{
				name: "E",
				stage: -5
			},
			() => calls.push("E")
		);
		hook.tap(
			{
				name: "F",
				stage: -3
			},
			() => calls.push("F")
		);

		calls.length = 0;
		hook.call();
		expect(calls).toEqual(["E", "F", "C", "D", "B", "A"]);

		hook.tap(
			{
				name: "G",
				before: "F",
				stage: -2,
			},
			() => calls.push("G")
		);

		calls.length = 0;
		hook.call();
		// 上面指定了 G before F, G stage > F stage, 最终 G before F, 说明 before 优先级高于 stage
		expect(calls).toEqual(["E", "G", "F", "C", "D", "B", "A"]);


	});
});
