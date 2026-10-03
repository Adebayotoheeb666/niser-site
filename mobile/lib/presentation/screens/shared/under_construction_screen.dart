import 'package:flutter/material.dart';

/// Shared placeholder for screens not yet implemented (Phase M1).
class UnderConstructionScreen extends StatelessWidget {
  const UnderConstructionScreen({super.key, required this.icon, required this.title});

  final IconData icon;
  final String title;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 56, color: Theme.of(context).colorScheme.primary),
            const SizedBox(height: 16),
            Text(title, style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            const Text('Coming soon'),
          ],
        ),
      ),
    );
  }
}
