import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../data/models/enums.dart';
import '../../../data/models/publication.dart';
import '../../../data/repositories/publication_repository.dart';
import 'package:niser_mobile/l10n/generated/app_localizations.dart';
import '../../widgets/async_view.dart';
import '../../widgets/content_cards.dart';
import '../../widgets/labels.dart';

class _Filters {
  const _Filters({this.type, this.division, this.year});

  final PublicationType? type;
  final ResearchDivision? division;
  final int? year;

  _Filters copyWith({PublicationType? type, ResearchDivision? division, int? year}) {
    return _Filters(type: type, division: division, year: year);
  }
}

const int _pageSize = 20;

class PublicationsScreen extends ConsumerStatefulWidget {
  const PublicationsScreen({super.key});

  @override
  ConsumerState<PublicationsScreen> createState() => _PublicationsScreenState();
}

class _PublicationsScreenState extends ConsumerState<PublicationsScreen> {
  final _searchController = TextEditingController();
  final _scrollController = ScrollController();
  Timer? _debounce;

  _Filters _filters = const _Filters();
  List<Publication> _items = [];
  int _page = 1;
  bool _hasMore = true;
  bool _loading = false;
  Object? _error;

  List<int> get _yearOptions {
    final now = DateTime.now().year;
    return [for (var y = now; y >= now - 5; y--) y];
  }

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
          .read(publicationRepositoryProvider)
          .list(
            query: _searchController.text.trim(),
            type: _filters.type,
            division: _filters.division,
            year: _filters.year,
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
          .read(publicationRepositoryProvider)
          .list(
            query: _searchController.text.trim(),
            type: _filters.type,
            division: _filters.division,
            year: _filters.year,
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

  void _updateFilters(_Filters f) {
    setState(() => _filters = f);
    _load();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: Text(l10n.publications)),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
            child: TextField(
              controller: _searchController,
              onChanged: _onSearchChanged,
              decoration: InputDecoration(
                hintText: l10n.searchPublications,
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchController.text.isEmpty
                    ? null
                    : IconButton(
                        icon: const Icon(Icons.clear),
                        tooltip: l10n.clearSearch,
                        constraints: const BoxConstraints(
                          minWidth: 48,
                          minHeight: 48,
                        ),
                        onPressed: () {
                          _searchController.clear();
                          _load();
                        },
                      ),
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
                  for (final type in PublicationType.values)
                    Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: FilterChip(
                        label: Text(type.label),
                        selected: _filters.type == type,
                        onSelected: (_) => _updateFilters(
                          _filters.copyWith(
                            type: _filters.type == type ? null : type,
                          ),
                        ),
                      ),
                    ),
                ],
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
                  for (final division in ResearchDivision.values)
                    Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: FilterChip(
                        label: Text(division.label),
                        selected: _filters.division == division,
                        onSelected: (_) => _updateFilters(
                          _filters.copyWith(
                            division: _filters.division == division
                                ? null
                                : division,
                          ),
                        ),
                      ),
                    ),
                  for (final year in _yearOptions)
                    Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: FilterChip(
                        label: Text('$year'),
                        selected: _filters.year == year,
                        onSelected: (_) => _updateFilters(
                          _filters.copyWith(year: _filters.year == year ? null : year),
                        ),
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
                : _buildList(l10n, theme),
          ),
        ],
      ),
    );
  }

  Widget _buildList(AppLocalizations l10n, ThemeData theme) {
    if (_loading && _items.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }
    if (_items.isEmpty) {
      return EmptyState(icon: Icons.menu_book_outlined, message: l10n.noPublications);
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
          final p = _items[index];
          return ContentCards.publication(
            context: context,
            p: p,
            onTap: () => context.go('/publications/${p.slug}'),
          );
        },
      ),
    );
  }
}
