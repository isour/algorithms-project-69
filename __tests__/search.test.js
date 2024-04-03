import { test, expect } from '@jest/globals';
import search from '../index.js';

test('base search', () => {
  const doc1 = {
    id: 'doc1',
    text: "I can't shoot straight unless I've had a pint!",
  };
  const doc2 = {
    id: 'doc2',
    text: "Don't shoot shoot shoot that thing at me.",
  };
  const doc3 = { id: 'doc3', text: "I'm your shooter." };
  const docs = [doc1, doc2, doc3];

  expect(search(docs, 'shoot')).toEqual(['doc2', 'doc1']);
});

test('empty search', () => {
  expect(search([], 'shoot')).toEqual([]);
});

test('punctuation search', () => {
  const doc1 = {
    id: 'doc1',
    text: "I can't shoot straight unless I've had a pint!",
  };
  const docs = [doc1];

  expect(search(docs, 'pint')).toEqual(['doc1']);
  expect(search(docs, 'pint!')).toEqual(['doc1']);
});

test('relevant search', () => {
  const doc1 = {
    id: 'doc1',
    text: "I can't shoot straight unless I've had a pint!",
  };
  const doc2 = {
    id: 'doc2',
    text: "Don't shoot shoot shoot that thing at me.",
  };
  const doc3 = { id: 'doc3', text: "I'm your shooter." };
  const docs = [doc1, doc2, doc3];

  expect(search(docs, 'shoot')).toEqual(['doc2', 'doc1']);
});

test('fuzzy search', () => {
  const doc1 = {
    id: 'doc1',
    text: "I can't shoot straight unless I've had a pint!",
  };
  const doc2 = {
    id: 'doc2',
    text: "Don't shoot shoot shoot that thing at me.",
  };
  const doc3 = { id: 'doc3', text: "I'm your shooter." };
  const docs = [doc1, doc2, doc3];

  expect(search(docs, 'shoot at me')).toEqual(['doc2', 'doc1']);
});
