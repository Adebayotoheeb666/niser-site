import 'package:flutter_test/flutter_test.dart';
import 'package:niser_mobile/data/models/author_summary.dart';
import 'package:niser_mobile/data/models/cms_event.dart';
import 'package:niser_mobile/data/models/enums.dart';
import 'package:niser_mobile/data/models/insight.dart';
import 'package:niser_mobile/data/models/news_item.dart';
import 'package:niser_mobile/data/models/publication.dart';
import 'package:niser_mobile/data/models/researcher.dart';
import 'package:niser_mobile/data/models/search_hit.dart';

void main() {
  group('AuthorSummary', () {
    test('parses JSON with title prefix', () {
      final author = AuthorSummary.fromJson(const {
        'id': 'a1',
        'fullName': 'Jane Doe',
        'slug': 'jane-doe',
        'titlePrefix': 'Dr',
        'position': 'Senior Research Fellow',
      });

      expect(author.id, 'a1');
      expect(author.displayName, 'Dr Jane Doe');
    });

    test('displayName handles missing prefix', () {
      final author = AuthorSummary.fromJson(const {
        'id': 'a2',
        'fullName': 'John Smith',
        'slug': 'john-smith',
      });
      expect(author.displayName, 'John Smith');
    });
  });

  group('Publication', () {
    final json = <String, dynamic>{
      'id': 'p1',
      'title': 'Nigerian Economy 2026',
      'slug': 'nigerian-economy-2026',
      'publicationType': 'working_paper',
      'researchDivision': 'macroeconomics',
      'abstract': 'Abstract text',
      'keywords': ['economy', 'growth'],
      'publishedYear': 2026,
      'isOpenAccess': true,
      'status': 'published',
      'doi': '10.1234/x',
      'authors': [
        {'id': 'a1', 'fullName': 'Jane Doe', 'slug': 'jane-doe'}
      ],
    };

    test('parses JSON with null-safe defaults', () {
      final pub = Publication.fromJson(json);
      expect(pub.title, 'Nigerian Economy 2026');
      expect(pub.publicationType, PublicationType.workingPaper);
      expect(pub.researchDivision, ResearchDivision.macroeconomics);
      expect(pub.authors.single.displayName, 'Jane Doe');
      expect(pub.status, ContentStatus.published);
    });

    test('unknown enum falls back safely', () {
      final unknown = Publication.fromJson({
        ...json,
        'publicationType': 'new_type',
        'researchDivision': 'new_division',
      });
      expect(unknown.publicationType, PublicationType.workingPaper);
      expect(unknown.researchDivision, ResearchDivision.macroeconomics);
    });

    test('round-trips through toJson', () {
      final pub = Publication.fromJson(json);
      expect(Publication.fromJson(pub.toJson()).title, pub.title);
    });
  });

  group('Researcher', () {
    test('parses division, prefix and interests', () {
      final researcher = Researcher.fromJson(const {
        'id': 'r1',
        'fullName': 'Adebayo Ojo',
        'slug': 'adebayo-ojo',
        'titlePrefix': 'Prof',
        'position': 'Director',
        'division': 'governance',
        'researchInterests': ['corruption', 'governance'],
        'isActive': true,
        'status': 'published',
      });

      expect(researcher.displayName, 'Prof Adebayo Ojo');
      expect(researcher.division, ResearchDivision.governance);
      expect(researcher.researchInterests, hasLength(2));
      expect(researcher.isActive, isTrue);
    });
  });

  group('Insight', () {
    test('parses contentType and dates', () {
      final insight = Insight.fromJson(const {
        'id': 'i1',
        'title': 'Policy brief',
        'slug': 'policy-brief',
        'contentType': 'policy_brief',
        'publishedDate': '2026-08-01T10:00:00Z',
        'status': 'published',
      });

      expect(insight.contentType, InsightContentType.policyBrief);
      expect(insight.publishedDateTime!.year, 2026);
      expect(insight.status, ContentStatus.published);
    });
  });

  group('CMSEvent', () {
    test('parses eventType, online flag and dates', () {
      final event = CMSEvent.fromJson(const {
        'id': 'e1',
        'title': 'Annual Conference',
        'slug': 'annual-conference',
        'eventType': 'conference',
        'startDate': '2026-09-01T09:00:00Z',
        'isOnline': true,
        'status': 'published',
      });

      expect(event.eventType, EventType.conference);
      expect(event.isOnline, isTrue);
      expect(event.startDateTime!.year, 2026);
    });
  });

  group('NewsItem', () {
    test('parses category and summary', () {
      final news = NewsItem.fromJson(const {
        'id': 'n1',
        'title': 'News title',
        'slug': 'news-title',
        'category': 'institutional',
        'summary': 'A summary',
        'status': 'published',
      });

      expect(news.category, NewsCategory.institutional);
      expect(news.summary, 'A summary');
    });
  });

  group('SearchHit / SearchResponse', () {
    test('parses hits and response envelope', () {
      final response = SearchResponse.fromJson({
        'hits': [
          {
            'id': 'h1',
            'type': 'publication',
            'title': 'Hit title',
            'excerpt': 'Excerpt',
            'url': '/publications/slug',
            'relevanceScore': 0.9,
          }
        ],
        'total': 1,
        'page': 1,
        'totalPages': 1,
        'mode': 'keyword',
      });

      expect(response.hits.single.type, 'publication');
      expect(response.hits.single.relevanceScore, 0.9);
      expect(response.total, 1);
      expect(response.mode, 'keyword');
    });
  });
}
