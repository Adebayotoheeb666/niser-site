import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api/api_exception.dart';
import 'package:niser_mobile/l10n/generated/app_localizations.dart';

/// Standard loading / error / data switch for repository-backed content.
///
/// Pass [onRetry] to refresh the underlying provider (e.g. `ref.invalidate`).
class AsyncView<T> extends StatelessWidget {
  const AsyncView({
    super.key,
    required this.async,
    required this.data,
    this.onRetry,
    this.loading,
  });

  final AsyncValue<T> async;
  final Widget Function(T value) data;
  final VoidCallback? onRetry;
  final Widget? loading;

  @override
  Widget build(BuildContext context) {
    return async.when(
      loading: () => loading ?? const _CenteredLoading(),
      error: (error, _) => _ErrorView(error: error, onRetry: onRetry),
      data: data,
    );
  }
}

class _CenteredLoading extends StatelessWidget {
  const _CenteredLoading();

  @override
  Widget build(BuildContext context) {
    return const Padding(
      padding: EdgeInsets.symmetric(vertical: 48),
      child: Center(child: CircularProgressIndicator()),
    );
  }
}

class _ErrorView extends StatelessWidget {
  const _ErrorView({required this.error, this.onRetry});

  final Object error;
  final VoidCallback? onRetry;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final message = error is ApiException
        ? (error as ApiException).message
        : AppLocalizations.of(context).errorGeneric;

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.cloud_off_outlined,
                size: 40, color: theme.colorScheme.outline),
            const SizedBox(height: 12),
            Text(message, textAlign: TextAlign.center),
            if (onRetry != null) ...[
              const SizedBox(height: 16),
              OutlinedButton.icon(
                onPressed: onRetry,
                icon: const Icon(Icons.refresh),
                label: const Text('Retry'),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

/// Simple centered empty state with an icon + message.
class EmptyState extends StatelessWidget {
  const EmptyState({
    super.key,
    required this.icon,
    required this.message,
  });

  final IconData icon;
  final String message;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 48, horizontal: 24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 40, color: theme.colorScheme.outline),
          const SizedBox(height: 12),
          Text(
            message,
            textAlign: TextAlign.center,
            style: theme.textTheme.bodyMedium
                ?.copyWith(color: theme.colorScheme.onSurfaceVariant),
          ),
        ],
      ),
    );
  }
}

/// Pushes a [RefreshIndicator] around [child] when [onRefresh] is provided.
class Refreshable extends StatelessWidget {
  const Refreshable({
    super.key,
    required this.child,
    this.onRefresh,
    this.controller,
  });

  final Widget child;
  final Future<void> Function()? onRefresh;
  final ScrollController? controller;

  @override
  Widget build(BuildContext context) {
    final scrollable = controller != null
        ? ListView(
            controller: controller,
            physics: const AlwaysScrollableScrollPhysics(),
            children: [child],
          )
        : ListView(
            physics: const AlwaysScrollableScrollPhysics(),
            children: [child],
          );

    return RefreshIndicator(onRefresh: onRefresh ?? () async {}, child: scrollable);
  }
}
