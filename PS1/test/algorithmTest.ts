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
 *
 * TODO: Describe your testing strategy for toBucketSets() here.
 */
describe("toBucketSets()", () => {
  it("should convert a BucketMap into an Array of Sets correctly", () => {
    const card1 = new Flashcard("Q1", "A1", "Hint1", []);
    const card2 = new Flashcard("Q2", "A2", "Hint2", []);
    const card3 = new Flashcard("Q3", "A3", "Hint3", []);

    const buckets: BucketMap = new Map([
      [0, new Set([card1])],
      [2, new Set([card2, card3])],
    ]);

    const result = toBucketSets(buckets);

    assert.deepStrictEqual(result, [
      new Set([card1]),
      new Set(),
      new Set([card2, card3]),
    ]);
  });

  it("should handle an empty BucketMap", () => {
    assert.deepStrictEqual(toBucketSets(new Map()), []);
  });

  it("should handle sequential buckets correctly", () => {
    const card1 = new Flashcard("Q1", "A1", "Hint1", []);
    const card2 = new Flashcard("Q2", "A2", "Hint2", []);
    const card3 = new Flashcard("Q3", "A3", "Hint3", []);

    const buckets: BucketMap = new Map([
      [0, new Set([card1])],
      [1, new Set([card2])],
      [2, new Set([card3])],
    ]);

    assert.deepStrictEqual(toBucketSets(buckets), [
      new Set([card1]),
      new Set([card2]),
      new Set([card3]),
    ]);
  });
});


/*
 * Testing strategy for getBucketRange():
   We will test the following cases:
   1. Buckets with a mix of non-empty and empty sets.
   2. No buckets with flashcards (expect undefined).
   3. Sequential buckets with flashcards in each.
   4. Buckets with gaps (e.g., flashcards in bucket 0 and 2, but no cards in bucket 1).
   5. Only one bucket with cards.
 * TODO: Describe your testing strategy for getBucketRange() here.
 */

   
describe("getBucketRange()", () => {
  it("should return the correct range of buckets when flashcards exist", () => {
    const card1 = new Flashcard("Q1", "A1", "Hint1", []);
    const card2 = new Flashcard("Q2", "A2", "Hint2", []);
    const card3 = new Flashcard("Q3", "A3", "Hint3", []);

    const buckets: Array<Set<Flashcard>> = [
      new Set([card1]),  // Bucket 0
      new Set(),          // Bucket 1 (empty)
      new Set([card2, card3]),  // Bucket 2
    ];

    const result = getBucketRange(buckets);

    assert.deepStrictEqual(result, { minBucket: 0, maxBucket: 2 });
  });

  it("should return undefined if no buckets contain flashcards", () => {
    const buckets: Array<Set<Flashcard>> = [
      new Set(), // Bucket 0 (empty)
      new Set(), // Bucket 1 (empty)
      new Set(), // Bucket 2 (empty)
    ];

    const result = getBucketRange(buckets);

    assert.strictEqual(result, undefined);
  });

  it("should handle sequential buckets correctly", () => {
    const card1 = new Flashcard("Q1", "A1", "Hint1", []);
    const card2 = new Flashcard("Q2", "A2", "Hint2", []);
    const card3 = new Flashcard("Q3", "A3", "Hint3", []);

    const buckets: Array<Set<Flashcard>> = [
      new Set([card1]),    // Bucket 0
      new Set([card2]),    // Bucket 1
      new Set([card3]),    // Bucket 2
    ];

    const result = getBucketRange(buckets);

    assert.deepStrictEqual(result, { minBucket: 0, maxBucket: 2 });
  });

  it("should return the correct range when buckets have gaps", () => {
    const card1 = new Flashcard("Q1", "A1", "Hint1", []);
    const card2 = new Flashcard("Q2", "A2", "Hint2", []);

    const buckets: Array<Set<Flashcard>> = [
      new Set([card1]),    // Bucket 0
      new Set(),           // Bucket 1 (empty)
      new Set([card2]),    // Bucket 2
    ];

    const result = getBucketRange(buckets);

    assert.deepStrictEqual(result, { minBucket: 0, maxBucket: 2 });
  });

  it("should return the correct range when only one bucket has flashcards", () => {
    const card1 = new Flashcard("Q1", "A1", "Hint1", []);

    const buckets: Array<Set<Flashcard>> = [
      new Set(),           // Bucket 0 (empty)
      new Set([card1]),    // Bucket 1
      new Set(),           // Bucket 2 (empty)
    ];

    const result = getBucketRange(buckets);

    assert.deepStrictEqual(result, { minBucket: 1, maxBucket: 1 });
  });
});


/*
 * Testing strategy for practice():
 *
 * TODO: Describe your testing strategy for practice() here.
 */
describe("practice()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});

/*
 * Testing strategy for update():
 *
 * TODO: Describe your testing strategy for update() here.
 */
describe("update()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});

/*
 * Testing strategy for getHint():
 *
 * TODO: Describe your testing strategy for getHint() here.
 */
describe("getHint()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});

/*
 * Testing strategy for computeProgress():
 *
 * TODO: Describe your testing strategy for computeProgress() here.
 */
describe("computeProgress()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});
