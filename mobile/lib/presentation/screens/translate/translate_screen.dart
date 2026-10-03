import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/repositories/translate_repository.dart';
import '../../../data/repositories/language_prefs.dart';
import 'package:niser_mobile/l10n/generated/app_localizations.dart';
import '../../widgets/section_header.dart';

class TranslateScreen extends ConsumerStatefulWidget {
  const TranslateScreen({super.key});

  @override
  ConsumerState<TranslateScreen> createState() => _TranslateScreenState();
}

class _TranslateScreenState extends ConsumerState<TranslateScreen> {
  final _sourceController = TextEditingController();
  String? _targetLang;
  TranslationResult? _result;
  bool _translating = false;
  bool _copied = false;

  @override
  void initState() {
    super.initState();
    // Default target follows the content-language preference from Settings
    final preferred = ref.read(contentLanguageProvider);
    _targetLang = preferred == 'en' ? null : preferred;
  }

  @override
  void dispose() {
    _sourceController.dispose();
    super.dispose();
  }

  Future<void> _translate() async {
    final text = _sourceController.text.trim();
    final target = _targetLang;
    if (text.isEmpty || target == null || _translating) return;

    setState(() {
      _translating = true;
      _result = null;
      _copied = false;
    });
    try {
      final result = await ref
          .read(translateRepositoryProvider)
          .translate(text: text, targetLang: target);
      if (!mounted) return;
      setState(() {
        _result = result;
        _translating = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() => _translating = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(AppLocalizations.of(context).translateError)),
      );
    }
  }

  Future<void> _copyResult() async {
    final text = _result?.translatedText;
    if (text == null || text.isEmpty) return;
    await Clipboard.setData(ClipboardData(text: text));
    if (!mounted) return;
    setState(() => _copied = true);
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: Text(l10n.translateTitle)),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          TextField(
            controller: _sourceController,
            minLines: 4,
            maxLines: 8,
            decoration: InputDecoration(
              hintText: l10n.translateSource,
              alignLabelWithHint: true,
            ),
          ),
          const SizedBox(height: 20),
          Text(
            l10n.selectTargetLanguage,
            style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              for (final (code, label) in [
                ('yo', l10n.yoruba),
                ('ha', l10n.hausa),
                ('ig', l10n.igbo),
              ])
                Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    label: Text(label),
                    selected: _targetLang == code,
                    onSelected: (_) => setState(() => _targetLang = code),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 20),
          FilledButton.icon(
            onPressed: _translating ? null : _translate,
            icon: const Icon(Icons.translate),
            label: _translating
                ? const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.white,
                    ),
                  )
                : Text(l10n.translateButton),
          ),
          if (_result != null && _result!.translatedText.isNotEmpty) ...[
            const SizedBox(height: 24),
            SectionHeader(title: l10n.translateResult),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    SelectableText(
                      _result!.translatedText,
                      style: theme.textTheme.bodyLarge,
                    ),
                    const SizedBox(height: 12),
                    Align(
                      alignment: Alignment.centerRight,
                      child: TextButton.icon(
                        onPressed: _copyResult,
                        icon: Icon(
                          _copied ? Icons.check : Icons.copy,
                          size: 18,
                        ),
                        label: Text(
                          _copied ? l10n.copied : l10n.copyTranslation,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}