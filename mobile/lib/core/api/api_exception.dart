/// Base class for all API failures surfaced to the UI.
class ApiException implements Exception {
  const ApiException(this.message, {this.statusCode, this.data});

  final String message;
  final int? statusCode;
  final Object? data;

  bool get isNetworkError => statusCode == null;

  bool get isNotFound => statusCode == 404;

  bool get isRateLimited => statusCode == 429;

  @override
  String toString() => message;
}
