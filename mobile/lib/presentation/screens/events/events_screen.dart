import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../data/models/cms_event.dart';
import '../../../data/repositories/event_repository.dart';
import 'package:niser_mobile/l10n/generated/app_localizations.dart';
import '../../widgets/async_view.dart';
import '../../widgets/content_cards.dart';

class _Filters {
  const _Filters({this.scope = EventScope.all});

  final EventScope scope;
}

const int _pageSize = 20;

class EventsScreen extends ConsumerStatefulWidget {
  const EventsScreen({super.key});

  @override
  ConsumerState<EventsScreen> createState() => _EventsScreenState();
}

class _EventsScreenState extends ConsumerState<EventsScreen> {
  final _scrollController = ScrollController();

  _Filters _filters = const _Filters();
  List<CMSEvent> _items = [];
  int _page = 1;
  bool _hasMore = true;
  bool _loading = false;
  Object? _error;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
    _load();
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.extentAfter < 300) {
      _loadMore();
    }
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _page = 1;
      _hasMore = true;
      _error = null;
    });
    try {
      final result = await ref
          .read(eventRepositoryProvider)
          .list(scope: _filters.scope, page: 1, limit: _pageSize);
      if (!mounted) return;
      setState(() {
        _items = result.value;
        _hasMore = result.value.length == _pageSize;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e;
        _loading = false;
      });
    }
  }

  Future<void> _loadMore() async {
    if (_loading || !_hasMore) return;
    setState(() => _loading = true);
    final nextPage = _page + 1;
    try {
      final result = await ref
          .read(eventRepositoryProvider)
          .list(scope: _filters.scope, page: nextPage, limit: _pageSize);
      if (!mounted) return;
      setState(() {
        _items = [..._items, ...result.value];
        _page = nextPage;
        _hasMore = result.value.length == _pageSize;
        _loading = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);

    return Scaffold(
      appBar: AppBar(title: Text(l10n.events)),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: SegmentedButton<EventScope>(
              segments: [
                ButtonSegment(value: EventScope.all, label: Text(l10n.events)),
                ButtonSegment(
                  value: EventScope.upcoming,
                  label: Text(l10n.upcoming),
                ),
                ButtonSegment(value: EventScope.past, label: Text(l10n.past)),
              ],
              selected: {_filters.scope},
              onSelectionChanged: (selection) {
                setState(() => _filters = _Filters(scope: selection.first));
                _load();
              },
            ),
          ),
          const Divider(height: 8),
          Expanded(
            child: _error != null
                ? AsyncView<Object?>(
                    async: AsyncError(_error!, StackTrace.empty),
                    data: (_) => const SizedBox.shrink(),
                    onRetry: _load,
                  )
                : _buildList(l10n),
          ),
        ],
      ),
    );
  }

  Widget _buildList(AppLocalizations l10n) {
    if (_loading && _items.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }
    if (_items.isEmpty) {
      return EmptyState(icon: Icons.event_outlined, message: l10n.noEvents);
    }

    return RefreshIndicator(
      onRefresh: _load,
      child: ListView.builder(
        controller: _scrollController,
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        itemCount: _items.length + (_hasMore ? 1 : 0),
        itemBuilder: (context, index) {
          if (index == _items.length) {
            return const Padding(
              padding: EdgeInsets.symmetric(vertical: 16),
              child: Center(
                child: SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(strokeWidth: 2),
                ),
              ),
            );
          }
          final e = _items[index];
          return ContentCards.event(
            context: context,
            e: e,
            onTap: () => context.go('/events/${e.slug}'),
          );
        },
      ),
    );
  }
}