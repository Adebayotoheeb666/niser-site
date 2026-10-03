import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/api/api_exception.dart';
import '../../../data/models/search_hit.dart';
import '../../../data/repositories/search_repository.dart';
import 'package:niser_mobile/l10n/generated/app_localizations.dart';
import '../../widgets/app_launcher.dart';
import '../../widgets/async_view.dart';

class _Filters {
  const _Filters({this.type = 'all'});

  final String type;
}

class SearchScreen extends ConsumerStatefulWidget {
  const SearchScreen({super.key});

  @override
  ConsumerState<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends ConsumerState<SearchScreen> {
  final _searchController = TextEditingController();
  final _scrollController = ScrollController();
  Timer? _debounce;
  CancelToken? _cancelToken;

  _Filters _filters = const _Filters();
  List<String> _recent = [];
  SearchResponse? _response;
  bool _loading = false;
  bool _loadingMore = false;
  bool _hasSearched = false;
  Object? _error;
  int _page = 1;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
    _loadRecent();
  }

  void _onScroll() {
    if (_scrollController.position.extentAfter < 300) {
      _loadMore();
    }
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _cancelToken?.cancel('disposed');
    _searchController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _loadRecent() async {
    final recent = await ref.read(searchRepositoryProvider).recentQueries();
    if (!mounted) return;
    setState(() => _recent = recent);
  }

  Future<void> _search() async {
    final query = _searchController.text.trim();
    if (query.isEmpty) {
      _cancelToken?.cancel('empty query');
      _cancelToken = null;
      setState(() {
        _hasSearched = false;
        _response = null;
        _error = null;
      });
      return;
    }
    _debounce?.cancel();
    // Cancel any in-flight search before starting a new one (plan §8).
    _cancelToken?.cancel('new search');
    final token = CancelToken();
    _cancelToken = token;
    setState(() {
      _loading = true;
      _hasSearched = true;
      _error = null;
      _page = 1;
    });
    await ref.read(searchRepositoryProvider).persistQuery(query);
    try {
      final response = await ref.read(searchRepositoryProvider).search(
            query: query,
            type: _filters.type,
            page: 1,
            limit: 20,
            cancelToken: token,
          );
      if (!mounted) return;
      // Ignore if this request was superseded by a newer search.
      if (_cancelToken != token) return;
      setState(() {
        _response = response;
        _loading = false;
        _page = response.page;
      });
      _loadRecent();
    } catch (e) {
      // Swallow cancellations silently; they are intentional.
      if (e is ApiException && e.message == 'Request cancelled') return;
      if (e is DioException && e.type == DioExceptionType.cancel) return;
      if (!mounted) return;
      if (_cancelToken != token) return;
      setState(() {
        _error = e;
        _loading = false;
      });
    }
  }

  Future<void> _loadMore() async {
    if (_loading || _loadingMore || _response == null) return;
    if (_page >= _response!.totalPages) return;
    setState(() => _loadingMore = true);
    final nextPage = _page + 1;
    final query = _searchController.text.trim();
    if (query.isEmpty) {
      setState(() => _loadingMore = false);
      return;
    }
    try {
      final more = await ref.read(searchRepositoryProvider).search(
            query: query,
            type: _filters.type,
            page: nextPage,
            limit: 20,
          );
      if (!mounted) return;
      setState(() {
        _response = SearchResponse(
          hits: [..._response!.hits, ...more.hits],
          total: more.total,
          page: more.page,
          totalPages: more.totalPages,
          mode: more.mode,
        );
        _page = more.page;
        _loadingMore = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() => _loadingMore = false);
    }
  }

  void _onSearchChanged(String value) {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 400), _search);
  }

  void _onSubmit(String value) {
    _debounce?.cancel();
    _search();
  }

  void _openHit(SearchHit hit) {
    final url = hit.url;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      AppLauncher.open(url);
      return;
    }
    if (url.startsWith('/')) {
      context.go(url);
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.searchTitle),
        actions: [
          IconButton(
            icon: const Icon(Icons.close),
            tooltip: l10n.closeSearch,
            onPressed: () => context.go('/home'),
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
            child: TextField(
              controller: _searchController,
              autofocus: true,
              onChanged: _onSearchChanged,
              onSubmitted: _onSubmit,
              textInputAction: TextInputAction.search,
              decoration: InputDecoration(
                hintText: l10n.searchHint,
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
                          _search();
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
                  for (final (value, label) in _typeOptions(l10n))
                    Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: FilterChip(
                        label: Text(label),
                        selected: _filters.type == value,
                        onSelected: (_) {
                          setState(() => _filters = _Filters(type: value));
                          _search();
                        },
                      ),
                    ),
                ],
              ),
            ),
          ),
          const Divider(height: 8),
          Expanded(child: _buildBody(l10n)),
        ],
      ),
    );
  }

  List<(String, String)> _typeOptions(AppLocalizations l10n) {
    return [
      ('all', l10n.allContent),
      ('publication', l10n.onlyPublications),
      ('researcher', l10n.onlyResearchers),
      ('insight', l10n.onlyInsights),
      ('event', l10n.onlyEvents),
      ('news', l10n.onlyNews),
    ];
  }

  Widget _buildBody(AppLocalizations l10n) {
    if (_loading) return const Center(child: CircularProgressIndicator());
    if (_error != null) {
      return AsyncView<Object?>(
        async: AsyncError(_error!, StackTrace.empty),
        data: (_) => const SizedBox.shrink(),
        onRetry: _search,
      );
    }
    if (!_hasSearched) {
      return _RecentSearches(
        recent: _recent,
        onTap: (q) {
          _searchController.text = q;
          _searchController.selection =
              TextSelection.collapsed(offset: q.length);
          _search();
        },
        onClear: () async {
          await ref
              .read(searchRepositoryProvider)
              .clearRecentQueries();
          _loadRecent();
        },
      );
    }
    if (_response == null || _response!.hits.isEmpty) {
      return EmptyState(icon: Icons.search_off, message: l10n.noResults);
    }
    return _ResultsView(
      response: _response!,
      onOpen: _openHit,
      controller: _scrollController,
      isLoadingMore: _loadingMore,
    );
  }
}

class _RecentSearches extends StatelessWidget {
  const _RecentSearches({
    required this.recent,
    required this.onTap,
    required this.onClear,
  });

  final List<String> recent;
  final ValueChanged<String> onTap;
  final VoidCallback onClear;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context);
    if (recent.isEmpty) {
      return Center(
        child: Text(
          l10n.searchHint,
          style: theme.textTheme.bodyMedium
              ?.copyWith(color: theme.colorScheme.outline),
        ),
      );
    }
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Row(
          children: [
            Expanded(
              child: Text(
                l10n.recentSearches,
                style: theme.textTheme.titleMedium
                    ?.copyWith(fontWeight: FontWeight.bold),
              ),
            ),
            TextButton(onPressed: onClear, child: Text(l10n.clearRecent)),
          ],
        ),
        for (final query in recent)
          ListTile(
            leading: const Icon(Icons.history),
            title: Text(query),
            onTap: () => onTap(query),
          ),
      ],
    );
  }
}

class _GroupedSection {
  const _GroupedSection(this.type, this.hits);

  final String type;
  final List<SearchHit> hits;
}

class _ResultsView extends StatelessWidget {
  const _ResultsView({
    required this.response,
    required this.onOpen,
    required this.controller,
    this.isLoadingMore = false,
  });

  final SearchResponse response;
  final ValueChanged<SearchHit> onOpen;
  final ScrollController controller;
  final bool isLoadingMore;

  Map<String, List<SearchHit>> get _grouped {
    final map = <String, List<SearchHit>>{};
    for (final hit in response.hits) {
      map.putIfAbsent(hit.type, () => []).add(hit);
    }
    return map;
  }

  String _typeTitle(String type, AppLocalizations l10n) {
    switch (type) {
      case 'publication':
        return l10n.publications;
      case 'researcher':
        return l10n.researchers;
      case 'insight':
        return l10n.insights;
      case 'event':
        return l10n.events;
      case 'news':
        return l10n.news;
      default:
        return type;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context);
    final grouped = _grouped;

    final flat = <_GroupedSection>[];
    for (final entry in grouped.entries) {
      flat.add(_GroupedSection(entry.key, entry.value));
    }

    return ListView.builder(
      controller: controller,
      padding: const EdgeInsets.all(16),
      itemCount: flat.length + (isLoadingMore ? 2 : 1),
      itemBuilder: (context, index) {
        if (index == 0) {
          return Text(
            '${response.total} ${l10n.searchResults.toLowerCase()}',
            style: theme.textTheme.bodySmall
                ?.copyWith(color: theme.colorScheme.outline),
          );
        }
        if (isLoadingMore && index == flat.length + 1) {
          return const Padding(
            padding: EdgeInsets.symmetric(vertical: 16),
            child: Center(child: SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))),
          );
        }
        final section = flat[index - 1];
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.only(top: 8, bottom: 4),
              child: Text(
                _typeTitle(section.type, l10n),
                style: theme.textTheme.titleMedium
                    ?.copyWith(fontWeight: FontWeight.bold),
              ),
            ),
            for (final hit in section.hits)
              Card(
                margin: const EdgeInsets.only(bottom: 8),
                child: ListTile(
                  leading: Icon(_typeIcon(section.type)),
                  title: Text(hit.title, maxLines: 2),
                  subtitle: hit.excerpt.isEmpty
                      ? null
                      : Text(hit.excerpt, maxLines: 2),
                  trailing: const ExcludeSemantics(
                    child: Icon(Icons.chevron_right),
                  ),
                  onTap: () => onOpen(hit),
                ),
              ),
          ],
        );
      },
    );
  }

  IconData _typeIcon(String type) {
    switch (type) {
      case 'publication':
        return Icons.menu_book_outlined;
      case 'researcher':
        return Icons.person_outline;
      case 'insight':
        return Icons.lightbulb_outline;
      case 'event':
        return Icons.event_outlined;
      case 'news':
        return Icons.newspaper_outlined;
      default:
        return Icons.search;
    }
  }
}