import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../data/repositories/saved_content_repository.dart';

/// Lists content saved for offline reading via the "Save" action on
/// recommendation and content cards.
class SavedContentScreen extends ConsumerStatefulWidget {
  const SavedContentScreen({super.key});

  @override
  ConsumerState<SavedContentScreen> createState() => _SavedContentScreenState();
}

class _SavedContentScreenState extends ConsumerState<SavedContentScreen> {
  late List<SavedItem> _items;

  @override
  void initState() {
    super.initState();
    _reload();
  }

  void _reload() {
    setState(() {
      _items = ref.read(savedContentRepositoryProvider).list();
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Saved for offline')),
      body: _items.isEmpty
          ? Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.bookmark_border, size: 48, color: theme.colorScheme.outline),
                  const SizedBox(height: 12),
                  Text(
                    'Nothing saved yet',
                    style: theme.textTheme.titleMedium,
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Tap Save on any content card to read it offline later.',
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            )
          : ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: _items.length,
              separatorBuilder: (_, __) => const SizedBox(height: 8),
              itemBuilder: (context, index) {
                final item = _items[index];
                return Card(
                  child: ListTile(
                    leading: const Icon(Icons.bookmark),
                    title: Text(item.title, maxLines: 2, overflow: TextOverflow.ellipsis),
                    subtitle: Text(item.type),
                    trailing: IconButton(
                      icon: const Icon(Icons.delete_outline),
                      tooltip: 'Remove',
                      onPressed: () async {
                        await ref
                            .read(savedContentRepositoryProvider)
                            .remove(type: item.type, slug: item.slug);
                        _reload();
                      },
                    ),
                    onTap: () => context.go(item.routePath),
                  ),
                );
              },
            ),
    );
  }
}
