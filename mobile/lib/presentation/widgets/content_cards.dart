import 'package:flutter/material.dart';

import '../../core/utils/date_format.dart';
import '../../data/models/cms_event.dart';
import '../../data/models/insight.dart';
import '../../data/models/news_item.dart';
import '../../data/models/publication.dart';
import '../../data/models/researcher.dart';
import '../theme/app_theme.dart';
import 'labels.dart';

/// Reusable list cards for the five content types.
///
/// Each card shows an icon, a two-line title/subtitle and a chevron, keeping
/// the list screens visually consistent.
abstract class ContentCards {
  static Widget publication({
    required BuildContext context,
    required Publication p,
    required VoidCallback onTap,
  }) {
    final subtitle = <String>[
      if (p.publishedYear > 0) p.publishedYear.toString(),
      p.publicationType.label,
    ].join(' · ');
    return _card(
      context: context,
      icon: Icons.menu_book_outlined,
      title: p.title,
      subtitle: subtitle,
      badge: p.isOpenAccess ? 'OA' : null,
      onTap: onTap,
    );
  }

  static Widget event({
    required BuildContext context,
    required CMSEvent e,
    required VoidCallback onTap,
  }) {
    final when = formatDate(e.startDateTime);
    final where = e.isOnline ? 'Online' : (e.location ?? '');
    return _card(
      context: context,
      icon: Icons.event_outlined,
      title: e.title,
      subtitle: [if (when.isNotEmpty) when, if (where.isNotEmpty) where]
          .join(' · '),
      onTap: onTap,
    );
  }

  static Widget insight({
    required BuildContext context,
    required Insight i,
    required VoidCallback onTap,
  }) {
    final subtitle = <String>[
      i.contentType.label,
      if (i.author != null && i.author!.displayName.isNotEmpty)
        i.author!.displayName,
    ].join(' · ');
    return _card(
      context: context,
      icon: Icons.lightbulb_outline,
      title: i.title,
      subtitle: subtitle,
      onTap: onTap,
    );
  }

  static Widget news({
    required BuildContext context,
    required NewsItem n,
    required VoidCallback onTap,
  }) {
    final when = formatDate(n.publishedDateTime);
    return _card(
      context: context,
      icon: Icons.newspaper_outlined,
      title: n.title,
      subtitle: [n.category.label, if (when.isNotEmpty) when].join(' · '),
      onTap: onTap,
    );
  }

  static Widget researcher({
    required BuildContext context,
    required Researcher r,
    required VoidCallback onTap,
  }) {
    return _card(
      context: context,
      icon: Icons.person_outline,
      title: r.displayName,
      subtitle: [if (r.position.isNotEmpty) r.position, r.division.label]
          .join(' · '),
      onTap: onTap,
    );
  }

  static Widget _card({
    required BuildContext context,
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
    String? badge,
  }) {
    final theme = Theme.of(context);
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: NiserColors.primary.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: NiserColors.primary, size: 22),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      subtitle,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: theme.textTheme.bodySmall
                          ?.copyWith(color: theme.colorScheme.onSurfaceVariant),
                    ),
                  ],
                ),
              ),
              if (badge != null) ...[
                const SizedBox(width: 8),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: NiserColors.primary.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    badge,
                    style: const TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: NiserColors.primary,
                    ),
                  ),
                ),
              ],
              const ExcludeSemantics(
                child: Icon(Icons.chevron_right, color: Colors.grey),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
