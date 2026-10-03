import test from 'node:test';
import assert from 'node:assert/strict';
import { applyGlossaryPlaceholders, restoreGlossaryPlaceholders } from '@/lib/ai/translate';

test('applyGlossaryPlaceholders should replace glossary terms with placeholders', () => {
  const glossary = {
    Policy: { fr: 'Politique' },
    Research: { fr: 'Recherche' },
  };
  const input = 'This Policy and Research note.';
  const { text, placeholders } = applyGlossaryPlaceholders(input, glossary);
  assert.match(text, /__GLOSS_0__|__GLOSS_1__/);
  assert.equal(Object.keys(placeholders).length, 2);
});

test('restoreGlossaryPlaceholders should replace placeholders with target glossary terms', () => {
  const glossary = {
    Policy: { fr: 'Politique' },
    Research: { fr: 'Recherche' },
  };
  const placeholders = { '__GLOSS_0__': 'Policy', '__GLOSS_1__': 'Research' };
  const translated = '__GLOSS_0__ and __GLOSS_1__ note.';
  const result = restoreGlossaryPlaceholders(translated, placeholders, glossary, 'fr');
  assert.equal(result, 'Politique and Recherche note.');
});
