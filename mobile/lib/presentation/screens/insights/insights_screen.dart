import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../data/models/enums.dart';
import '../../../data/models/insight.dart';
import '../../../data/repositories/insight_repository.dart';
import 'package:niser_mobile/l10n/generated/app_localizations.dart';
import '../../widgets/async_view.dart';
import '../../widgets/content_cards.dart';
import '../../widgets/labels.dart';

class _Filters {
  const _Filters({this.contentType});

  final InsightContentType? contentType;
}

const int _pageSize = 20;

class InsightsScreen extends ConsumerStatefulWidget {
  const InsightsScreen({super.key});

  @override
  ConsumerState<InsightsScreen> createState() => _InsightsScreenState();
}

class _InsightsScreenState extends ConsumerState<InsightsScreen> {
  final _searchController = TextEditingController();
  final _scrollController = ScrollController();
  Timer? _debounce;

  _Filters _filters = const _Filters();
  List<Insight> _items = [];
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
    _debounce?.cancel();
    _searchController.dispose();
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
          .read(insightRepositoryProvider)
          .list(
            query: _searchController.text.trim(),
            contentType: _filters.contentType,
            page: 1,
            limit: _pageSize,
          );
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
          .read(insightRepositoryProvider)
          .list(
            query: _searchController.text.trim(),
            contentType: _filters.contentType,
            page: nextPage,
            limit: _pageSize,
          );
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

  void _onSearchChanged(String value) {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 400), _load);
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);

    return Scaffold(
      appBar: AppBar(title: Text(l10n.insights)),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
            child: TextField(
              controller: _searchController,
              onChanged: _onSearchChanged,
              decoration: InputDecoration(
                hintText: l10n.searchInsights,
                prefixIcon: const Icon(Icons.search),
                isDense: true,
              ),
            ),
          ),
          SizedBox(
            height: 44,
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              child: Row(
                children: [
                  for (final type in InsightContentType.values)
                    Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: FilterChip(
                        label: Text(type.label),
                        selected: _filters.contentType == type,
                        onSelected: (_) {
                          setState(() {
                            _filters = _Filters(
                              contentType: _filters.contentType == type
                                  ? null
                                  : type,
                            );
                          });
                          _load();
                        },
                      ),
                    ),
                ],
              ),
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
      return EmptyState(icon: Icons.lightbulb_outline, message: l10n.noInsights);
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
          final i = _items[index];
          return ContentCards.insight(
            context: context,
            i: i,
            onTap: () => context.go('/insights/${i.slug}'),
          );
        },
      ),
    );
  }
}