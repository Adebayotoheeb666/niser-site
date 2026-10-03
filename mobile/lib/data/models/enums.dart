/// Enum types mirroring `types/cms.ts` union types.
///
/// Each type exposes a `wire` value (the JSON key emitted by the Next.js
/// routes) and a static `fromWire` that tolerates unknown values by
/// falling back to a safe default — new CMS fields never break decoding.
library;

enum PublicationType {
  workingPaper('working_paper'),
  policyBrief('policy_brief'),
  journalArticle('journal_article'),
  bookChapter('book_chapter'),
  annualReport('annual_report'),
  conferencePaper('conference_paper');

  const PublicationType(this.wire);
  final String wire;

  static PublicationType fromWire(String? value) {
    return PublicationType.values.firstWhere(
      (t) => t.wire == value,
      orElse: () => PublicationType.workingPaper,
    );
  }
}

enum ResearchDivision {
  macroeconomics('macroeconomics'),
  povertySocial('poverty_social'),
  agriculture('agriculture'),
  governance('governance'),
  industry('industry');

  const ResearchDivision(this.wire);
  final String wire;

  static ResearchDivision? fromWireNullable(String? value) {
    if (value == null) return null;
    for (final d in ResearchDivision.values) {
      if (d.wire == value) return d;
    }
    return null;
  }

  static ResearchDivision fromWire(String value) =>
      fromWireNullable(value) ?? ResearchDivision.macroeconomics;
}

enum TitlePrefix {
  prof('Prof'),
  dr('Dr'),
  mr('Mr'),
  mrs('Mrs'),
  ms('Ms');

  const TitlePrefix(this.wire);
  final String wire;

  static TitlePrefix? fromWireNullable(String? value) {
    if (value == null) return null;
    for (final t in TitlePrefix.values) {
      if (t.wire == value) return t;
    }
    return null;
  }
}

enum InsightContentType {
  policyBrief('policy_brief'),
  commentary('commentary'),
  analysis('analysis'),
  opinion('opinion'),
  rapidResponse('rapid_response');

  const InsightContentType(this.wire);
  final String wire;

  static InsightContentType fromWire(String? value) {
    return InsightContentType.values.firstWhere(
      (t) => t.wire == value,
      orElse: () => InsightContentType.analysis,
    );
  }
}

enum EventType {
  seminar('seminar'),
  workshop('workshop'),
  conference('conference'),
  webinar('webinar');

  const EventType(this.wire);
  final String wire;

  static EventType fromWire(String? value) {
    return EventType.values.firstWhere(
      (t) => t.wire == value,
      orElse: () => EventType.seminar,
    );
  }
}

enum NewsCategory {
  institutional('institutional'),
  media('media'),
  external('external');

  const NewsCategory(this.wire);
  final String wire;

  static NewsCategory? fromWireNullable(String? value) {
    if (value == null) return null;
    for (final c in NewsCategory.values) {
      if (c.wire == value) return c;
    }
    return null;
  }

  static NewsCategory fromWire(String value) =>
      fromWireNullable(value) ?? NewsCategory.institutional;
}

enum ContentStatus {
  draft('draft'),
  review('review'),
  published('published'),
  aiDraft('ai_draft'),
  publish('publish');

  const ContentStatus(this.wire);
  final String wire;

  static ContentStatus fromWire(String? value) {
    return ContentStatus.values.firstWhere(
      (s) => s.wire == value,
      orElse: () => ContentStatus.draft,
    );
  }
}
