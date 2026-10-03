import 'package:dio/dio.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../config/app_config.dart';
import 'api_exception.dart';

/// Shared Dio wrapper for the whole app.
final apiClientProvider = Provider<ApiClient>((ref) {
  return ApiClient();
});
/// Thin Dio wrapper used by every repository.
///
/// Adds:
/// - base URL from [AppConfig.apiBaseUrl]
/// - reasonable timeouts
/// - a `x-client` header so the backend can identify native traffic
/// - normalised error mapping into [ApiException]
class ApiClient {
  ApiClient({Dio? dio}) : dio = dio ?? _createDio() {
    this.dio.interceptors.add(
          InterceptorsWrapper(
            onRequest: (options, handler) async {
              final online = await _isOnline();
              if (!online) {
                handler.reject(
                  DioException.connectionError(
                    requestOptions: options,
                    reason: 'offline',
                  ),
                );
                return;
              }
              handler.next(options);
            },
            onError: (e, handler) {
              handler.next(e);
            },
          ),
        );
  }

  final Dio dio;

  static Dio _createDio() {
    final options = BaseOptions(
      baseUrl: AppConfig.apiBaseUrl,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 30),
      sendTimeout: const Duration(seconds: 15),
      headers: {
        'x-client': 'niser-mobile',
        'accept': 'application/json',
      },
    );
    return Dio(options);
  }

  Future<bool> _isOnline() async {
    try {
      final results = await Connectivity().checkConnectivity();
      return results.any((r) => r != ConnectivityResult.none);
    } catch (_) {
      return true;
    }
  }

  Future<T> getJson<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      final response = await dio.get<dynamic>(
        path,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
      return _decode<T>(response);
    } on DioException catch (e) {
      if (e.type == DioExceptionType.cancel) {
        throw const ApiException('Request cancelled');
      }
      throw _mapError(e);
    }
  }

  Future<T> postJson<T>(
    String path, {
    Object? data,
    Options? options,
  }) async {
    try {
      final response = await dio.post<dynamic>(path, data: data, options: options);
      return _decode<T>(response);
    } on DioException catch (e) {
      throw _mapError(e);
    }
  }

  Future<T> deleteJson<T>(
    String path, {
    Object? data,
    Options? options,
  }) async {
    try {
      final response =
          await dio.delete<dynamic>(path, data: data, options: options);
      return _decode<T>(response);
    } on DioException catch (e) {
      throw _mapError(e);
    }
  }

  T _decode<T>(Response<dynamic> response) {
    final body = response.data;
    if (body == null) {
      throw const ApiException('Empty response from server');
    }
    if (body is T) {
      return body;
    }
    if (T == String) {
      return body.toString() as T;
    }
    throw ApiException(
      'Unexpected response type: ${body.runtimeType}',
      statusCode: response.statusCode,
    );
  }

  ApiException _mapError(DioException e) {
    final status = e.response?.statusCode;
    final data = e.response?.data;

    String message;
    if (e.type == DioExceptionType.connectionError ||
        e.type == DioExceptionType.connectionTimeout ||
        e.type == DioExceptionType.receiveTimeout ||
        e.type == DioExceptionType.sendTimeout) {
      message = 'You appear to be offline. Showing saved content where available.';
    } else if (e.type == DioExceptionType.badResponse) {
      if (data is Map && data['error'] is String) {
        message = data['error'] as String;
      } else {
        message = 'Server error (${status ?? 'unknown'})';
      }
    } else {
      message = 'Request failed: ${e.message ?? 'unknown error'}';
    }

    debugPrint('[ApiClient] ${e.requestOptions.method} '
        '${e.requestOptions.path} -> ${e.type} ${status ?? ''}');
    return ApiException(message, statusCode: status, data: data);
  }
}
