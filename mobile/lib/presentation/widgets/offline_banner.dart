import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/network/connectivity.dart';
import 'package:niser_mobile/l10n/generated/app_localizations.dart';

/// Shows a slim banner whenever the device is offline.
class OfflineBanner extends ConsumerWidget {
  const OfflineBanner({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final online = ref.watch(connectivityProvider).value ?? true;
    if (online) return const SizedBox.shrink();

    return Material(
      color: const Color(0xFFFFF3D6),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: Row(
          children: [
            const Icon(Icons.cloud_off, size: 16, color: Color(0xFF8A6D00)),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                AppLocalizations.of(context).offline,
                style: const TextStyle(fontSize: 13, color: Color(0xFF8A6D00)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}