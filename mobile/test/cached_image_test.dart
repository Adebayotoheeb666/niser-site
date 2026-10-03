import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:niser_mobile/presentation/widgets/cached_image.dart';

void main() {
  group('NiserCachedImage', () {
    testWidgets('shows fallback when url is null', (tester) async {
      await tester.pumpWidget(const MaterialApp(home: Scaffold(body: NiserCachedImage(url: null, width: 100, height: 100))));
      await tester.pump();
      expect(find.byIcon(Icons.image_outlined), findsOneWidget);
    });

    testWidgets('shows fallback when url is empty', (tester) async {
      await tester.pumpWidget(const MaterialApp(home: Scaffold(body: NiserCachedImage(url: '', width: 100, height: 100))));
      await tester.pump();
      expect(find.byIcon(Icons.image_outlined), findsOneWidget);
    });

    testWidgets('shows image widget when url provided', (tester) async {
      await tester.pumpWidget(const MaterialApp(home: Scaffold(body: NiserCachedImage(url: 'https://example.com/img.jpg', width: 100, height: 100))));
      await tester.pump();
      // CachedNetworkImage renders even before load; check no fallback icon.
      expect(find.byIcon(Icons.image_outlined), findsNothing);
    });

    testWidgets('clips with borderRadius', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(body: NiserCachedImage(url: 'https://example.com/img.jpg', width: 100, height: 100, borderRadius: BorderRadius.circular(12))),
      ));
      await tester.pump();
      expect(find.byType(ClipRRect), findsOneWidget);
    });
  });

  group('NiserCachedAvatar', () {
    testWidgets('shows fallback icon when url null', (tester) async {
      await tester.pumpWidget(const MaterialApp(home: Scaffold(body: NiserCachedAvatar(url: null))));
      await tester.pump();
      expect(find.byIcon(Icons.person), findsOneWidget);
    });

    testWidgets('uses CachedNetworkImageProvider when url present', (tester) async {
      await tester.pumpWidget(const MaterialApp(home: Scaffold(body: NiserCachedAvatar(url: 'https://example.com/photo.jpg'))));
      await tester.pump();
      final avatar = tester.widget<CircleAvatar>(find.byType(CircleAvatar));
      expect(avatar.foregroundImage, isNotNull);
    });
  });
}
