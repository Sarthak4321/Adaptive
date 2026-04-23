import { test } from 'node:test';
import assert from 'node:assert';
import { practiceService, AttemptWithQuestion } from '../services/practiceService.js';

test('adaptive logic: initial state should be MEDIUM', () => {
  const result = practiceService.calculateTargetDifficulty([]);
  assert.strictEqual(result, 'MEDIUM');
});

test('adaptive logic: high accuracy should increase difficulty', () => {
  // Case: EASY -> MEDIUM
  const attemptsEasy: AttemptWithQuestion[] = [
    { isCorrect: true, question: { difficulty: 'EASY' } },
    { isCorrect: true, question: { difficulty: 'EASY' } }
  ];
  assert.strictEqual(practiceService.calculateTargetDifficulty(attemptsEasy), 'MEDIUM');

  // Case: MEDIUM -> HARD
  const attemptsMedium: AttemptWithQuestion[] = [
    { isCorrect: true, question: { difficulty: 'MEDIUM' } },
    { isCorrect: true, question: { difficulty: 'MEDIUM' } }
  ];
  assert.strictEqual(practiceService.calculateTargetDifficulty(attemptsMedium), 'HARD');
});

test('adaptive logic: low accuracy should decrease difficulty', () => {
  // Case: HARD -> MEDIUM
  const attemptsHard: AttemptWithQuestion[] = [
    { isCorrect: false, question: { difficulty: 'HARD' } },
    { isCorrect: false, question: { difficulty: 'HARD' } }
  ];
  assert.strictEqual(practiceService.calculateTargetDifficulty(attemptsHard), 'MEDIUM');

  // Case: MEDIUM -> EASY
  const attemptsMedium: AttemptWithQuestion[] = [
    { isCorrect: false, question: { difficulty: 'MEDIUM' } },
    { isCorrect: false, question: { difficulty: 'MEDIUM' } }
  ];
  assert.strictEqual(practiceService.calculateTargetDifficulty(attemptsMedium), 'EASY');
});

test('adaptive logic: moderate accuracy should maintain difficulty', () => {
  const attempts: AttemptWithQuestion[] = [
    { isCorrect: true, question: { difficulty: 'MEDIUM' } },
    { isCorrect: false, question: { difficulty: 'MEDIUM' } }
  ];
  // Accuracy is 50%, which is between 40 and 70
  assert.strictEqual(practiceService.calculateTargetDifficulty(attempts), 'MEDIUM');
});
