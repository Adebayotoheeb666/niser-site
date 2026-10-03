/// Human-readable display labels for CMS enum values.
///
/// Presentation-layer extensions so `data/models` stay free of UI text.
library;

import '../../data/models/enums.dart';

extension PublicationTypeLabels on PublicationType {
  String get label {
    switch (this) {
      case PublicationType.workingPaper:
        return 'Working paper';
      case PublicationType.policyBrief:
        return 'Policy brief';
      case PublicationType.journalArticle:
        return 'Journal article';
      case PublicationType.bookChapter:
        return 'Book chapter';
      case PublicationType.annualReport:
        return 'Annual report';
      case PublicationType.conferencePaper:
        return 'Conference paper';
    }
  }
}

extension ResearchDivisionLabels on ResearchDivision {
  String get label {
    switch (this) {
      case ResearchDivision.macroeconomics:
        return 'Macroeconomics';
      case ResearchDivision.povertySocial:
        return 'Poverty & Social';
      case ResearchDivision.agriculture:
        return 'Agriculture';
      case ResearchDivision.governance:
        return 'Governance';
      case ResearchDivision.industry:
        return 'Industry';
    }
  }
}

extension InsightContentTypeLabels on InsightContentType {
  String get label {
    switch (this) {
      case InsightContentType.policyBrief:
        return 'Policy brief';
      case InsightContentType.commentary:
        return 'Commentary';
      case InsightContentType.analysis:
        return 'Analysis';
      case InsightContentType.opinion:
        return 'Opinion';
      case InsightContentType.rapidResponse:
        return 'Rapid response';
    }
  }
}

extension EventTypeLabels on EventType {
  String get label {
    switch (this) {
      case EventType.seminar:
        return 'Seminar';
      case EventType.workshop:
        return 'Workshop';
      case EventType.conference:
        return 'Conference';
      case EventType.webinar:
        return 'Webinar';
    }
  }
}

extension NewsCategoryLabels on NewsCategory {
  String get label {
    switch (this) {
      case NewsCategory.institutional:
        return 'Institutional';
      case NewsCategory.media:
        return 'Media';
      case NewsCategory.external:
        return 'External';
    }
  }
}

extension ContentStatusLabels on ContentStatus {
  String get label {
    switch (this) {
      case ContentStatus.published:
      case ContentStatus.publish:
        return 'Published';
      case ContentStatus.draft:
        return 'Draft';
      case ContentStatus.review:
        return 'Review';
      case ContentStatus.aiDraft:
        return 'AI draft';
    }
  }
}
