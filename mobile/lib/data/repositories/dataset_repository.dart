import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api/api_client.dart';
import '../models/dataset.dart';

/// Reads /api/data and /api/data/[id]. Dataset catalogue is always network
/// (no offline cache per the plan §4).
class DatasetRepository {
  DatasetRepository({required ApiClient api}) : _api = api;

  final ApiClient _api;

  Future<List<Dataset>> list() async {
    final json = await _api.getJson<List<dynamic>>('/api/data');
    return datasetsFromJson(json);
  }

  Future<Dataset> byId(String id) async {
    final json = await _api.getJson<Map<String, dynamic>>('/api/data/$id');
    return Dataset.fromJson(json);
  }
}

final datasetRepositoryProvider = Provider<DatasetRepository>((ref) {
  return DatasetRepository(api: ref.watch(apiClientProvider));
});
