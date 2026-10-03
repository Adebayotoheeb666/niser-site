import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/repositories/subscription_repository.dart';
import 'package:niser_mobile/l10n/generated/app_localizations.dart';

class SubscribeScreen extends ConsumerStatefulWidget {
  const SubscribeScreen({super.key});

  @override
  ConsumerState<SubscribeScreen> createState() => _SubscribeScreenState();
}

class _SubscribeScreenState extends ConsumerState<SubscribeScreen> {
  final _emailController = TextEditingController();
  final _nameController = TextEditingController();
  bool _consent = false;
  bool _submitting = false;

  @override
  void dispose() {
    _emailController.dispose();
    _nameController.dispose();
    super.dispose();
  }

  bool _validEmail(String value) =>
      RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$').hasMatch(value.trim());

  Future<void> _submit() async {
    final l10n = AppLocalizations.of(context);
    if (!_consent) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(l10n.subscribeConsent)),
      );
      return;
    }
    if (!_validEmail(_emailController.text)) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(l10n.invalidEmail)),
      );
      return;
    }

    setState(() => _submitting = true);
    try {
      await ref.read(subscriptionRepositoryProvider).subscribe(
            email: _emailController.text.trim(),
            name: _nameController.text.trim(),
          );
      if (!mounted) return;
      setState(() {
        _submitting = false;
        _emailController.clear();
        _nameController.clear();
        _consent = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(l10n.subscribeSuccess)),
      );
    } catch (_) {
      if (!mounted) return;
      setState(() => _submitting = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(l10n.subscribeError)),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: Text(l10n.subscribe)),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            l10n.subscribeTitle,
            style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 20),
          TextField(
            controller: _emailController,
            keyboardType: TextInputType.emailAddress,
            textInputAction: TextInputAction.next,
            decoration: InputDecoration(
              labelText: l10n.subscribeEmail,
              prefixIcon: const Icon(Icons.mail_outline),
            ),
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _nameController,
            textInputAction: TextInputAction.done,
            decoration: InputDecoration(
              labelText: l10n.subscribeName,
              prefixIcon: const Icon(Icons.person_outline),
            ),
          ),
          const SizedBox(height: 8),
          CheckboxListTile(
            value: _consent,
            onChanged: (v) => setState(() => _consent = v ?? false),
            title: Text(l10n.subscribeConsent),
            contentPadding: EdgeInsets.zero,
            controlAffinity: ListTileControlAffinity.leading,
          ),
          const SizedBox(height: 16),
          FilledButton(
            onPressed: _submitting ? null : _submit,
            child: _submitting
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.white,
                    ),
                  )
                : Text(l10n.subscribe),
          ),
        ],
      ),
    );
  }
}