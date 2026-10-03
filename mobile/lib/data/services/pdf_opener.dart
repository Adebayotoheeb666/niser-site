import 'dart:io';

import 'package:dio/dio.dart';
import 'package:open_filex/open_filex.dart';
import 'package:path_provider/path_provider.dart';

import '../../core/api/api_exception.dart';
import '../../presentation/widgets/app_launcher.dart';

/// Downloads a PDF to a temp file and opens it with the system viewer.
/// Falls back to opening the URL in a browser on any failure.
class PdfOpener {
  PdfOpener({Dio? dio}) : _dio = dio ?? Dio();

  final Dio _dio;

  Future<bool> open(String url) async {
    try {
      final dir = await getTemporaryDirectory();
      final file = File('${dir.path}/niser_${DateTime.now().millisecondsSinceEpoch}.pdf');
      await _dio.download(url, file.path);
      if (!await file.exists()) return false;
      final result = await OpenFilex.open(file.path, type: 'application/pdf');
      if (result.type == ResultType.done) return true;
      // Fall through to browser fallback on failure/cancelled.
    } catch (e) {
      if (e is ApiException) {
        return AppLauncher.open(url);
      }
      // Network/download errors also fall back to the browser.
    }
    return AppLauncher.open(url);
  }
}
