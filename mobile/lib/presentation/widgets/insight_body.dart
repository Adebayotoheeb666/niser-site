import 'package:flutter/material.dart';
import 'package:flutter_html/flutter_html.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../data/models/insight.dart';

/// Renders an Insight's body richly.
///
/// Priority:
/// 1. `body` HTML (Lexical -> HTML from CMS) - rendered via `flutter_html`.
/// 2. `bodyPlaintext` fallback - rendered as markdown when it looks like markdown,
///    else selectable plain text. This preserves existing API contracts.
///
/// Images inside HTML are loaded with a plain `NetworkImage` today; the global
/// `cached_network_image` disk cache will still be used via the HTTP cache
/// layer where possible. A future step can provide a custom `Image.network` ->
/// `CachedNetworkImage` extension on Html.
class InsightBody extends StatelessWidget {
  const InsightBody({super.key, required this.insight});

  final Insight insight;

  bool get _looksLikeHtml {
    final b = insight.body;
    if (b == null || b.isEmpty) return false;
    return b.contains('<') && b.contains('>');
  }

  bool get _looksLikeMarkdown {
    final t = insight.bodyPlaintext ?? '';
    return RegExp(r'(^#{1,6}\s|^-\s|^\*\s|\*\*|`|__|\[.*\]\(.*\))',
            multiLine: true)
        .hasMatch(t);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    // 1) Rich HTML body preferred.
    if (_looksLikeHtml) {
      return Html(
        data: insight.body!,
        style: {
          'body': Style(
            margin: Margins.zero,
            padding: HtmlPaddings.zero,
            fontSize: FontSize(theme.textTheme.bodyMedium?.fontSize ?? 14),
            lineHeight: LineHeight(theme.textTheme.bodyMedium?.height ?? 1.5),
            color: theme.colorScheme.onSurface,
          ),
          'a': Style(color: theme.colorScheme.primary, textDecoration: TextDecoration.underline),
          'h1': Style(fontSize: FontSize.large, fontWeight: FontWeight.bold),
          'h2': Style(fontSize: FontSize.large, fontWeight: FontWeight.bold),
          'h3': Style(fontSize: FontSize.medium, fontWeight: FontWeight.bold),
          'blockquote': Style(
            border: Border(left: BorderSide(color: theme.colorScheme.primary, width: 3)),
            padding: HtmlPaddings.only(left: 12),
            margin: Margins.symmetric(vertical: 12),
            fontStyle: FontStyle.italic,
            color: theme.colorScheme.onSurfaceVariant,
          ),
          'code': Style(
            backgroundColor: theme.colorScheme.surfaceContainerHighest,
            padding: HtmlPaddings.symmetric(horizontal: 4, vertical: 2),
            fontFamily: 'monospace',
          ),
          'pre': Style(
            backgroundColor: theme.colorScheme.surfaceContainerHighest,
            padding: HtmlPaddings.all(12),
          ),
          'img': Style(margin: Margins.symmetric(vertical: 12)),
        },
        onLinkTap: (url, _, __) {
          if (url == null) return;
          final uri = Uri.tryParse(url);
          if (uri != null) launchUrl(uri, mode: LaunchMode.externalApplication);
        },
        extensions: const [],
      );
    }

    final plaintext = insight.bodyPlaintext ?? insight.body ?? '';
    if (plaintext.isEmpty) return const SizedBox.shrink();

    // 2) Markdown detection for plaintext that contains markdown syntax.
    if (_looksLikeMarkdown) {
      return MarkdownBody(
        data: plaintext,
        selectable: true,
        styleSheet: MarkdownStyleSheet.fromTheme(theme).copyWith(
          p: theme.textTheme.bodyMedium,
          a: TextStyle(color: theme.colorScheme.primary, decoration: TextDecoration.underline),
          blockquoteDecoration: BoxDecoration(
            border: Border(left: BorderSide(color: theme.colorScheme.primary, width: 3)),
          ),
        ),
        onTapLink: (text, href, title) {
          if (href == null) return;
          final uri = Uri.tryParse(href);
          if (uri != null) launchUrl(uri, mode: LaunchMode.externalApplication);
        },
      );
    }

    // 3) Plain selectable text fallback.
    return SelectableText(plaintext, style: theme.textTheme.bodyMedium);
  }
}
