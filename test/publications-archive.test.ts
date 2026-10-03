import test from 'node:test';
import assert from 'node:assert/strict';
import { filterPublications } from '@/lib/publications/archive';

const publications = [
  {
    id: '1',
    slug: 'niser-policy-brief-2024',
    title: 'NISER Policy Brief 2024',
    abstract: 'A review of governance reforms in Nigeria.',
    publicationType: 'policy_brief',
    publishedYear: 2024,
    researchDivision: 'governance',
    authors: [{ fullName: 'Ada Okafor' }],
  },
  {
    id: '2',
    slug: 'macro-research-report',
    title: 'Macroeconomic Research Report',
    abstract: 'Growth and productivity analysis.',
    publicationType: 'working_paper',
    publishedYear: 2023,
    researchDivision: 'macroeconomics',
    authors: [{ fullName: 'Ifeanyi Bello' }],
  },
  {
    id: '3',
    slug: 'agriculture-journal-article',
    title: 'Agriculture Journal Article',
    abstract: 'Food security interventions and resilience.',
    publicationType: 'journal_article',
    publishedYear: 2022,
    researchDivision: 'agriculture',
    authors: [{ fullName: 'Grace Udo' }],
  },
];

test('filterPublications matches query, type, and year filters together', () => {
  const result = filterPublications(publications, 'governance', 'policy_brief', '2024');

  assert.deepEqual(result.map((item) => item.id), ['1']);
});

test('filterPublications returns matching items when only the search term is provided', () => {
  const result = filterPublications(publications, 'research', 'all', 'all');

  assert.equal(result.length, 1);
  assert.deepEqual(result.map((item) => item.id), ['2']);
});
