import 'package:add_2_calendar/add_2_calendar.dart' as cal;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/utils/date_format.dart';
import '../../../data/models/cms_event.dart';
import '../../../data/repositories/event_repository.dart';
import 'package:niser_mobile/l10n/generated/app_localizations.dart';
import '../../widgets/app_launcher.dart';
import '../../widgets/async_view.dart';
import '../../widgets/labels.dart';
import '../../widgets/section_header.dart';

final eventDetailProvider =
    FutureProvider.autoDispose.family<CMSEvent?, String>((ref, slug) async {
  return (await ref.watch(eventRepositoryProvider).bySlug(slug)).value;
});

class EventDetailScreen extends ConsumerWidget {
  const EventDetailScreen({super.key, required this.slug});

  final String slug;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final async = ref.watch(eventDetailProvider(slug));

    return Scaffold(
      appBar: AppBar(title: Text(l10n.events)),
      body: AsyncView<CMSEvent?>(
        async: async,
        onRetry: () => ref.invalidate(eventDetailProvider(slug)),
        data: (event) {
          if (event == null) {
            return EmptyState(icon: Icons.event_outlined, message: l10n.noEvents);
          }
          return _EventBody(event: event);
        },
      ),
    );
  }
}

class _EventBody extends ConsumerWidget {
  const _EventBody({required this.event});

  final CMSEvent event;

  String _dateRange() {
    final start = event.startDateTime;
    final end = event.endDateTime;
    if (start == null) return '';
    final startFmt = formatDate(start);
    if (end == null || end.isBefore(start)) return startFmt;
    if (end.year == start.year && end.month == start.month && end.day == start.day) {
      return '$startFmt · ${_time(end)}';
    }
    return '$startFmt – ${formatDate(end)}';
  }

  static String _time(DateTime d) {
    final h = d.hour == 0 ? 12 : (d.hour > 12 ? d.hour - 12 : d.hour);
    final minute = d.minute.toString().padLeft(2, '0');
    final ampm = d.hour >= 12 ? 'PM' : 'AM';
    return '$h:$minute $ampm';
  }

  Future<void> _addToCalendar(BuildContext context) async {
    final start = event.startDateTime;
    if (start == null) return;
    final end = event.endDateTime ?? start.add(const Duration(hours: 2));
    final calEvent = cal.Event(
      title: event.title,
      description: event.summary ?? '',
      location: event.isOnline ? 'Online' : (event.location ?? ''),
      startDate: start,
      endDate: end,
      allDay: false,
    );
    await cal.Add2Calendar.addEvent2Cal(calEvent);
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context);
    final when = _dateRange();
    final where = event.isOnline ? l10n.onlineEvent : (event.location ?? '');

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            MetaTag(label: event.eventType.label),
            if (event.isOnline) MetaTag(label: l10n.onlineEvent, icon: Icons.videocam_outlined),
          ],
        ),
        const SizedBox(height: 12),
        Text(
          event.title,
          style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
        ),
        if (when.isNotEmpty || where.isNotEmpty) ...[
          const SizedBox(height: 16),
          Card(
            child: Column(
              children: [
                if (when.isNotEmpty)
                  ListTile(
                    leading: const Icon(Icons.calendar_today_outlined),
                    title: Text(l10n.upcomingEvents),
                    subtitle: Text(when),
                  ),
                if (where.isNotEmpty)
                  ListTile(
                    leading: const Icon(Icons.place_outlined),
                    title: Text(l10n.location),
                    subtitle: Text(where),
                  ),
              ],
            ),
          ),
        ],
        if (event.registrationUrl != null && event.registrationUrl!.isNotEmpty) ...[
          const SizedBox(height: 20),
          FilledButton.icon(
            onPressed: () => AppLauncher.open(event.registrationUrl!),
            icon: const Icon(Icons.event_available_outlined),
            label: Text(l10n.register),
          ),
        ],
        const SizedBox(height: 8),
        OutlinedButton.icon(
          onPressed: () => _addToCalendar(context),
          icon: const Icon(Icons.calendar_month_outlined),
          label: Text(l10n.addToCalendar),
        ),
        if (event.recordingUrl != null && event.recordingUrl!.isNotEmpty) ...[
          const SizedBox(height: 8),
          OutlinedButton.icon(
            onPressed: () => AppLauncher.open(event.recordingUrl!),
            icon: const Icon(Icons.play_circle_outline),
            label: Text('Watch recording'),
          ),
        ],
        if (event.summary != null && event.summary!.isNotEmpty) ...[
          const SizedBox(height: 20),
          SectionHeader(title: 'About'),
          SelectableText(event.summary!, style: theme.textTheme.bodyMedium),
        ],
        if (event.speakers != null && event.speakers!.isNotEmpty) ...[
          const SizedBox(height: 20),
          SectionHeader(title: 'Speakers'),
          for (final speaker in event.speakers!)
            Card(
              child: ListTile(
                leading: const Icon(Icons.person_outline),
                title: Text(speaker.displayName),
                subtitle: speaker.position?.isNotEmpty == true
                    ? Text(speaker.position!)
                    : null,
              ),
            ),
        ],
        const SizedBox(height: 24),
      ],
    );
  }
}
