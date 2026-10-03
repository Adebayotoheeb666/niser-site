import 'package:flutter_test/flutter_test.dart';
import 'package:niser_mobile/core/config/app_config.dart';
import 'package:niser_mobile/data/models/enums.dart';

void main() {
  group('AppConfig', () {
    test('exposes a non-empty API base URL in all environments', () {
      expect(AppConfig.appEnv, isNotEmpty);
      expect(AppConfig.apiBaseUrl, isNotEmpty);
      expect(AppConfig.appName, 'NISER');
    });
  });

  group('Enums', () {
    test('publication types map to wire values', () {
      expect(PublicationType.policyBrief.wire, 'policy_brief');
      expect(PublicationType.fromWire('journal_article'), PublicationType.journalArticle);
      expect(PublicationType.fromWire('bogus'), PublicationType.workingPaper);
    });

    test('divisions map to wire values', () {
      expect(ResearchDivision.povertySocial.wire, 'poverty_social');
      expect(ResearchDivision.fromWire('agriculture'), ResearchDivision.agriculture);
      expect(ResearchDivision.fromWireNullable('nope'), isNull);
    });
  });
}
