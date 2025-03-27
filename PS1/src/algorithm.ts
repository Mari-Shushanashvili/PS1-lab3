/**
 * Problem Set 1: Flashcards - Algorithm Functions
 *
 * This file contains the implementations for the flashcard algorithm functions
 * as described in the problem set handout.
 *
 * Please DO NOT modify the signatures of the exported functions in this file,
 * or you risk failing the Didit autograder.
 */

import { Flashcard, AnswerDifficulty, BucketMap } from "./flashcards";

/**
 * Converts a Map representation of learning buckets into an Array-of-Set representation.
 *
 * @param buckets Map where keys are bucket numbers and values are sets of Flashcards.
 * @returns Array of Sets, where element at index i is the set of flashcards in bucket i.
 *          Buckets with no cards will have empty sets in the array.
 * @spec.requires buckets is a valid representation of flashcard buckets.
 */
export function toBucketSets(buckets: BucketMap): Array<Set<Flashcard>> {
  if (buckets.size === 0) return [];
  
  const maxBucket = Math.max(...buckets.keys());
  const result = Array.from({length: maxBucket + 1}, () => new Set<Flashcard>());
  
  buckets.forEach((cards, bucket) => {
    result[bucket] = new Set(cards); // Defensive copy
  });
  
  return result;
}


/**
 * Finds the range of buckets that contain flashcards, as a rough measure of progress.
 *
 * @param buckets Array-of-Set representation of buckets.
 * @returns object with minBucket and maxBucket properties representing the range,
 *          or undefined if no buckets contain cards.
 * @spec.requires buckets is a valid Array-of-Set representation of flashcard buckets.
 */
export function getBucketRange(
  buckets: Array<Set<Flashcard>>
): { minBucket: number; maxBucket: number } | undefined {
  let min = Infinity;
  let max = -Infinity;

  buckets.forEach((set, index) => {
    if (set.size > 0) {
      min = Math.min(min, index);
      max = Math.max(max, index);
    }
  });

  return isFinite(min) ? {minBucket: min, maxBucket: max} : undefined;
}

/**
 * Selects cards to practice on a particular day.
 *
 * @param buckets Array-of-Set representation of buckets.
 * @param day current day number (starting from 0).
 * @returns a Set of Flashcards that should be practiced on day `day`,
 *          according to the Modified-Leitner algorithm.
 * @spec.requires buckets is a valid Array-of-Set representation of flashcard buckets.
 */
export function practice(
  buckets: Array<Set<Flashcard>>,
  day: number
): Set<Flashcard> {
  const result = new Set<Flashcard>();
  const retiredBucket = 5;

  buckets.slice(0, retiredBucket).forEach((set, bucket) => {
    if (day % (2 ** bucket) === 0) {
      set.forEach(card => result.add(card));
    }
  });

  return result;
}

/**
 * Updates a card's bucket number after a practice trial.
 *
 * @param buckets Map representation of learning buckets.
 * @param card flashcard that was practiced.
 * @param difficulty how well the user did on the card in this practice trial.
 * @returns updated Map of learning buckets.
 * @spec.requires buckets is a valid representation of flashcard buckets.
 */
export function update(
  buckets: BucketMap,
  card: Flashcard,
  difficulty: AnswerDifficulty
): BucketMap {
  const newBuckets = new Map(buckets);
  let currentBucket: number | undefined;

  // Find current bucket
  newBuckets.forEach((set, bucket) => {
    if (set.has(card)) currentBucket = bucket;
  });

  if (currentBucket === undefined) return newBuckets;

  // Calculate new bucket
  let newBucket = currentBucket;
  if (difficulty === AnswerDifficulty.Easy) {
    newBucket = Math.min(currentBucket + 1, 5);
  } else if (difficulty === AnswerDifficulty.Hard) {
    newBucket = Math.max(currentBucket - 1, 0);
  } else { // Wrong
    newBucket = 0;
  }

  // Update buckets
  newBuckets.get(currentBucket)?.delete(card);
  if (!newBuckets.has(newBucket)) {
    newBuckets.set(newBucket, new Set());
  }
  newBuckets.get(newBucket)?.add(card);

  return newBuckets;
}

/**
 * Generates a hint for a flashcard.
 *
 * @param card flashcard to hint
 * @returns a hint for the front of the flashcard.
 * @spec.requires card is a valid Flashcard.
 */
export function getHint(card: Flashcard): string {
  if (!card.front.trim()) return "No hint available";
  
  const minLength = 3;
  const words = card.front.split(/\s+/);
  let hint = "";
  
  for (const word of words) {
    if (hint.length + word.length > minLength * 2) break;
    hint += (hint ? " " : "") + word;
  }
  
  return hint.length >= minLength ? hint : card.front.slice(0, minLength);
}

/**
 * Computes statistics about the user's learning progress.
 *
 * @param buckets representation of learning buckets.
 * @param history representation of user's answer history.
 * @returns statistics about learning progress.
 * @spec.requires [SPEC TO BE DEFINED]
 */
export function computeProgress(buckets: any, history: any): any {
  let totalCards = 0;
  let weightedSum = 0;

  // Explicitly type the forEach parameters
  buckets.forEach((set: Set<Flashcard>, bucket: number) => {
    const count = set.size;
    totalCards += count;
    weightedSum += count * (bucket * 20); // 0→0%, 1→20%, etc.
  });

  return totalCards > 0 ? Math.round(weightedSum / totalCards) : 0;
}
