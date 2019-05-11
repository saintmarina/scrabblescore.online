import {resizeArray, scrabbleScore, isLetterAllowed} from "./Util.js";
import {scoreListsMap} from "./scoreLists";


describe("scrabbleScore", () => {
	test("counts score without modifiers", () => {
		let word = "happy" //13
		let modifiers = [null, null, null, null, null] //15
		expect(scrabbleScore(word, modifiers, "en")).toEqual(15);
	});

	test ("counts correctly with any modifier", () => {
		let longWord = "nonplussed" //13
		let modifiers = ["triple-word", "double-letter", "triple-letter", null, "triple-letter", null, "triple-letter", null, "double-word", "blank"] //108
		expect(scrabbleScore(longWord, modifiers, "en")).toEqual(108);
	});

	test ("calculates French and Russian", () => {
		expect(scrabbleScore("ложка", ["double-letter", null, "triple-letter", null, "triple-word"], "ru")).toEqual(69);
		expect(scrabbleScore("yeux", ["double-letter", "blank", "triple-word", "triple-letter"] , "fr")).toEqual(153);
	})
})

describe("resizeArray", () => {
	test ("makes correct length of an array", () => {
		expect(resizeArray([], 2, "a")).toEqual(["a", "a"])
		expect(resizeArray([1, 2, 3], 2, 4)).toEqual([1, 2])
		expect(resizeArray(["a", "a"], 2, "a")).toEqual(["a", "a"])
	});

	test ("takes a default value of any type", () => {
		expect(resizeArray([], 2, 1)).toEqual([1, 1])
		expect(resizeArray([], 2, {a: "b"})).toEqual([{a: "b"}, {a: "b"}])
	});

	test("doesn't change the original array", () => {
		let tripleA = ["a", "a", "a"]
		resizeArray(tripleA, 4, "a")
		expect(tripleA).toEqual(["a", "a", "a"])
	})
})

describe("isLetterAllowed", () => {
	test("only allows letters", () => {
		expect(isLetterAllowed("1", "en")).toEqual(false)
		expect(isLetterAllowed(" ", "ru")).toEqual(false)
		expect(isLetterAllowed("/", "ru")).toEqual(false)
		expect(isLetterAllowed("a", "fr")).toEqual(true)
	})

	test("filters characters according to the language", () => {
		expect(isLetterAllowed("a", "en")).toEqual(true)
		expect(isLetterAllowed("ф", "ru")).toEqual(true)
		expect(isLetterAllowed("f", "ru")).toEqual(false)
	})
})
