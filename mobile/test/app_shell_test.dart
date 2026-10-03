import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:niser_mobile/app.dart';
import 'package:niser_mobile/core/api/api_client.dart';
import 'package:niser_mobile/core/api/api_exception.dart';

class _FakeApiClient extends ApiClient {
  _FakeApiClient() : super(dio: null);

  @override
  Future<T> getJson<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    throw const ApiException('offline in test');
  }
}

void main() {
  testWidgets('app shell renders five bottom destinations', (tester) async {
    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          apiClientProvider.overrideWithValue(_FakeApiClient()),
        ],
        child: const NiserApp(),
      ),
    );
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 50));

    expect(find.byType(NavigationBar), findsOneWidget);
    expect(find.text('Home'), findsOneWidget);
    expect(find.text('Research'), findsOneWidget);
    expect(find.text('People'), findsOneWidget);
    expect(find.text('Ask NISER'), findsOneWidget);
    expect(find.text('More'), findsOneWidget);
  });
}
