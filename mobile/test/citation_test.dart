import 'package:flutter_test/flutter_test.dart';
import 'package:niser_mobile/core/utils/citation.dart';
import 'package:niser_mobile/data/models/author_summary.dart';
import 'package:niser_mobile/data/models/enums.dart';
import 'package:niser_mobile/data/models/publication.dart';

Publication _pub({
  String doi = '10.1234/example',
  String pdf = 'https://example.com/pub.pdf',
}) {
  return Publication(
    id: 'p1',
    title: 'Growth and Inflation in Nigeria',
    slug: 'growth-inflation-nigeria',
    publicationType: PublicationType.workingPaper,
    authors: [
      const AuthorSummary(id: 'a1', fullName: 'Ada Obi', slug: 'ada-obi', titlePrefix: 'Dr'),
      const AuthorSummary(id: 'a2', fullName: 'John Doe', slug: 'john-doe'),
    ],
    researchDivision: ResearchDivision.macroeconomics,
    abstract: 'Abstract',
    keywords: const ['growth'],
    publishedYear: 2024,
    doi: doi,
    pdfFile: pdf,
    isOpenAccess: true,
    status: ContentStatus.published,
  );
}

void main() {
  group('CitationBuilder', () {
    test('apa includes authors, year, title and doi', () {
      final text = CitationBuilder.apa(_pub());
      expect(text, contains('Ada Obi'));
      expect(text, contains('(2024).'));
      expect(text, contains('Growth and Inflation in Nigeria.'));
      expect(text, contains('https://doi.org/10.1234/example'));
    });

    test('apa without doi omits doi suffix', () {
      final text = CitationBuilder.apa(_pub(doi: ''));
      expect(text, isNot(contains('doi.org')));
    });

    test('chicago format', () {
      final text = CitationBuilder.chicago(_pub());
      expect(text, contains('Ada Obi'));
      expect(text, contains('"'));
      expect(text, contains('NISER.'));
    });

    test('bibtex generates techreport with required fields', () {
      final text = CitationBuilder.bibtex(_pub());
      expect(text, contains('@techreport{'));
      expect(text, contains('author = {Dr Ada Obi and John Doe}'));
      expect(text, contains('title = {Growth and Inflation in Nigeria}'));
      expect(text, contains('year = {2024}'));
      expect(text, contains('url = {https://example.com/pub.pdf}'));
      expect(text, contains('doi = {10.1234/example}'));
    });

    test('shareText includes slug link', () {
      final text = CitationBuilder.shareText(_pub());
      expect(text, contains('growth-inflation-nigeria'));
      expect(text, contains('https://niser.gov.ng/publications/'));
    });

    test('apa handles single author without trailing dot', () {
      final p = Publication(
        id: 'p2',
        title: 'A short title.',
        slug: 'short-title',
        publicationType: PublicationType.policyBrief,
        authors: [const AuthorSummary(id: 'a1', fullName: 'Solo', slug: 'solo')],
        researchDivision: ResearchDivision.governance,
        abstract: '',
        keywords: const [],
        publishedYear: 0,
        isOpenAccess: false,
        status: ContentStatus.published,
      );
      final text = CitationBuilder.apa(p);
      expect(text, contains('Solo'));
      expect(text, contains('A short title.'));
      expect(text, isNot(contains('(0)')));
    });
  });
}
