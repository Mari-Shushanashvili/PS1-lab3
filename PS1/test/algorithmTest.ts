import assert from "assert";
import { AnswerDifficulty, Flashcard, BucketMap } from "../src/flashcards";
import {
  toBucketSets,
  getBucketRange,
  practice,
  update,
  getHint,
  computeProgress,
} from "../src/algorithm";

/*
 * Testing strategy for toBucketSets():
 * 1. Empty BucketMap → empty array
 * 2. Single bucket → single-element array
 * 3. Multiple contiguous buckets → preserve order
 * 4. Non-contiguous buckets → fill gaps with empty Sets
 * 5. High bucket numbers → proper array length
 */
describe("toBucketSets()", () => {
  const card1 = new Flashcard("Q1", "A1", "H1", []);
  const card2 = new Flashcard("Q2", "A2", "H2", []);
  
  // Objective 1: Empty input
  it("converts empty BucketMap to empty array", () => {
    assert.deepStrictEqual(toBucketSets(new Map()), []);
  });

  // Objective 2: Single bucket
  it("handles single bucket correctly", () => {
    const result = toBucketSets(new Map([[0, new Set([card1])]]));
    assert.deepStrictEqual(result, [new Set([card1])]);
  });

  // Objective 3: Multiple contiguous buckets
  it("preserves order for contiguous buckets", () => {
    const buckets = new Map([
      [0, new Set([card1])],
      [1, new Set([card2])]
    ]);
    const result = toBucketSets(buckets);
    assert.deepStrictEqual(result, [new Set([card1]), new Set([card2])]);
  });

  // Objective 4: Non-contiguous buckets
  it("fills gaps with empty Sets", () => {
    const buckets = new Map([[0, new Set([card1])], [2, new Set([card2])]]);
    const result = toBucketSets(buckets);
    assert.deepStrictEqual(result, [new Set([card1]), new Set(), new Set([card2])]);
  });

  // Objective 5: High bucket numbers
  it("handles high bucket indices", () => {
    const buckets = new Map([[5, new Set([card1])]]);
    const result = toBucketSets(buckets);
    assert.strictEqual(result.length, 6);
    assert.deepStrictEqual(result[5], new Set([card1]));
  });
});

/*
 * Testing strategy for getBucketRange():
 * 1. Empty array → undefined
 * 2. All empty buckets → undefined
 * 3. Single non-empty bucket → min=max
 * 4. Multiple non-empty contiguous → correct range
 * 5. Multiple non-empty non-contiguous → correct range
 */
describe("getBucketRange()", () => {
  const card = new Flashcard("Q", "A", "H", []);
  
  // Objective 1: Empty array
  it("returns undefined for empty array", () => {
    assert.strictEqual(getBucketRange([]), undefined);
  });

  // Objective 2: All empty
  it("returns undefined when all buckets empty", () => {
    assert.strictEqual(getBucketRange([new Set(), new Set()]), undefined);
  });

  // Objective 3: Single non-empty
  it("returns single bucket when only one has cards", () => {
    const result = getBucketRange([new Set(), new Set([card])]);
    assert.deepStrictEqual(result, { minBucket: 1, maxBucket: 1 });
  });

  // Objective 4: Multiple contiguous
  it("returns correct range for contiguous buckets", () => {
    const buckets = [new Set([card]), new Set([card])];
    assert.deepStrictEqual(getBucketRange(buckets), { minBucket: 0, maxBucket: 1 });
  });

  // Objective 5: Multiple non-contiguous
  it("handles gaps between buckets", () => {
    const buckets = [new Set([card]), new Set(), new Set([card])];
    assert.deepStrictEqual(getBucketRange(buckets), { minBucket: 0, maxBucket: 2 });
  });
});

/*
 * Testing strategy for practice():
 * 1. Day 0 → only bucket 0
 * 2. Day n → buckets 0 to n
 * 3. Empty buckets → skipped
 * 4. Retired bucket (5+) → never included
 * 5. All cards from selected buckets included
 */
describe("practice()", () => {
  const cards = [
    new Flashcard("Q0", "A0", "H0", []), // Bucket 0
    new Flashcard("Q1", "A1", "H1", []), // Bucket 1
    new Flashcard("QR", "AR", "HR", [])  // Bucket 5 (retired)
  ];

  const buckets = [
    new Set([cards[0]]), // 0
    new Set([cards[1]]), // 1
    new Set(),           // 2 (empty)
    new Set(),           // 3
    new Set(),           // 4
    new Set([cards[2]])  // 5 (retired)
  ];

  // Objective 1: Day 0
  it("selects only bucket 0 on day 0", () => {
    const result = practice(buckets, 0);
    assert.strictEqual(result.size, 1);
    assert(result.has(cards[0]));
  });

  // Objective 2: Day n
  it("selects buckets 0-1 on day 1", () => {
    const result = practice(buckets, 1);
    assert.strictEqual(result.size, 2);
    assert(result.has(cards[0]));
    assert(result.has(cards[1]));
  });

  // Objective 3: Empty buckets
  it("skips empty buckets", () => {
    const result = practice(buckets, 2);
    assert.strictEqual(result.size, 2); // Doesn't include empty bucket 2
  });

  // Objective 4: Retired bucket
  it("excludes retired bucket", () => {
    const result = practice(buckets, 5);
    assert(!result.has(cards[2]));
  });

  // Objective 5: All cards from selected
  it("includes all cards from selected buckets", () => {
    const result = practice(buckets, 1);
    [cards[0], cards[1]].forEach(card => assert(result.has(card)));
  });
});

/*
 * Testing strategy for update():
 * 1. Easy → move up
 * 2. Hard → move down
 * 3. Wrong → reset to 0
 * 4. Already in 0 → can't go lower
 * 5. Already in 5 → can't go higher
 */
describe("update()", () => {
  const card = new Flashcard("Q", "A", "H", []);
  let buckets: BucketMap;

  beforeEach(() => {
    buckets = new Map([
      [0, new Set()],
      [1, new Set([card])],
      [5, new Set()]
    ]);
  });

  // Objective 1: Easy answer
  it("moves card up on easy", () => {
    const result = update(buckets, card, AnswerDifficulty.Easy);
    assert(!result.get(1)?.has(card));
    assert(result.get(2)?.has(card));
  });

  // Objective 2: Hard answer
  it("moves card down on hard", () => {
    const result = update(buckets, card, AnswerDifficulty.Hard);
    assert(!result.get(1)?.has(card));
    assert(result.get(0)?.has(card));
  });

  // Objective 3: Wrong answer
  it("resets to bucket 0 on wrong", () => {
    const result = update(buckets, card, AnswerDifficulty.Wrong);
    assert(result.get(0)?.has(card));
  });

  // Objective 4: Can't go below 0
  it("stays in bucket 0 when already at bottom", () => {
    buckets.set(0, new Set([card]));
    const result = update(buckets, card, AnswerDifficulty.Hard);
    assert(result.get(0)?.has(card));
  });

  // Objective 5: Can't go above 5
  it("stays in bucket 5 when already at top", () => {
    buckets.set(5, new Set([card]));
    const result = update(buckets, card, AnswerDifficulty.Easy);
    assert(result.get(5)?.has(card));
  });
});

/*
 * Testing strategy for getHint():
 * 1. Short questions → first complete words
 * 2. Long questions → meaningful prefix
 * 3. Minimum 3 characters
 * 4. Maintains capitalization
 * 5. Handles special characters
 */
describe("getHint()", () => {
  // Objective 1: Short questions
  it("returns first complete words for short questions", () => {
    const card = new Flashcard("Capital of France?", "Paris", "Europe");
    assert.strictEqual(getHint(card), "Capital of");
  });

  // Objective 2: Long questions
  it("returns meaningful prefix for long questions", () => {
    const card = new Flashcard("Explain the theory of relativity", "Einstein", "Physics");
    assert(getHint(card).startsWith("Explain the"));
  });

  // Objective 3: Minimum length
  it("returns at least 3 characters", () => {
    const card = new Flashcard("Hi", "Hello", "Greeting");
    assert(getHint(card).length >= 3);
  });

  // Objective 4: Capitalization
  it("preserves original capitalization", () => {
    const card = new Flashcard("NAME the elements", "HONClBrIF", "Chemistry");
    assert.strictEqual(getHint(card), "NAME the");
  });

  // Objective 5: Special characters
  it("handles questions with special characters", () => {
    const card = new Flashcard("What's your name?", "John", "Introduction");
    assert.strictEqual(getHint(card), "What's your");
  });
});

/*
 * Testing strategy for computeProgress():
 * 1. Empty → 0%
 * 2. All bucket 0 → 0%
 * 3. Mixed buckets → weighted average
 * 4. All retired → 100%
 * 5. Edge cases handled
 */
describe("computeProgress()", () => {
  const cards = [
    new Flashcard("Q0", "A0", "H0", []), // Bucket 0
    new Flashcard("Q2", "A2", "H2", []), // Bucket 2
    new Flashcard("Q5", "A5", "H5", [])  // Bucket 5 (retired)
  ];

  // Objective 1: Empty
  it("returns 0 for empty buckets", () => {
    assert.strictEqual(computeProgress(new Map(), []), 0);
  });

  // Objective 2: All bucket 0
  it("returns 0 when all cards are new", () => {
    const buckets = new Map([[0, new Set(cards.slice(0, 1))]]);
    assert.strictEqual(computeProgress(buckets, []), 0);
  });

  // Objective 3: Mixed buckets
  it("returns weighted average for mixed progress", () => {
    const buckets = new Map([
      [0, new Set([cards[0]])],
      [2, new Set([cards[1]])],
      [5, new Set([cards[2]])]
    ]);
    const progress = computeProgress(buckets, []);
    assert(progress > 0 && progress < 100);
  });

  // Objective 4: All retired
  it("returns 100 when all cards retired", () => {
    const buckets = new Map([[5, new Set(cards.slice(2))]]);
    assert.strictEqual(computeProgress(buckets, []), 100);
  });

  // Objective 5: Edge cases
  it("handles all cards in same bucket", () => {
    const buckets = new Map([[3, new Set(cards)]]);
    const progress = computeProgress(buckets, []);
    assert(progress === 60); // 3/5 = 60%
  });
});