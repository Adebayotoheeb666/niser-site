import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/repositories/contact_repository.dart';
import 'package:niser_mobile/l10n/generated/app_localizations.dart';

class ContactScreen extends ConsumerStatefulWidget {
  const ContactScreen({super.key});

  @override
  ConsumerState<ContactScreen> createState() => _ContactScreenState();
}

class _ContactScreenState extends ConsumerState<ContactScreen> {
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _organizationController = TextEditingController();
  final _messageController = TextEditingController();
  String _subject = 's0';
  bool _sending = false;

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _emailController.dispose();
    _organizationController.dispose();
    _messageController.dispose();
    super.dispose();
  }

  bool _validEmail(String value) =>
      RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$').hasMatch(value.trim());

  Future<void> _submit() async {
    final l10n = AppLocalizations.of(context);
    final firstName = _firstNameController.text.trim();
    final lastName = _lastNameController.text.trim();
    final email = _emailController.text.trim();
    final message = _messageController.text.trim();

    if (firstName.isEmpty ||
        lastName.isEmpty ||
        !_validEmail(email) ||
        message.length < 20) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(l10n.fillRequiredFields)),
      );
      return;
    }

    setState(() => _sending = true);
    try {
      await ref.read(contactRepositoryProvider).submit(
            firstName: firstName,
            lastName: lastName,
            email: email,
            subject: _subject,
            message: message,
            organization: _organizationController.text.trim(),
          );
      if (!mounted) return;
      setState(() {
        _sending = false;
        _firstNameController.clear();
        _lastNameController.clear();
        _emailController.clear();
        _organizationController.clear();
        _messageController.clear();
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(l10n.contactSuccess)),
      );
    } catch (_) {
      if (!mounted) return;
      setState(() => _sending = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(l10n.contactError)),
      );
    }
  }

  List<String> _subjectOptions(AppLocalizations l10n) {
    return [
      l10n.subjectGeneral,
      l10n.subjectPublications,
      l10n.subjectResearch,
      l10n.subjectData,
      l10n.subjectOther,
    ];
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: Text(l10n.contactUs)),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            l10n.contactTitle,
            style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _firstNameController,
                  textInputAction: TextInputAction.next,
                  decoration: InputDecoration(
                    labelText: l10n.contactFirstName,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: TextField(
                  controller: _lastNameController,
                  textInputAction: TextInputAction.next,
                  decoration: InputDecoration(labelText: l10n.contactLastName),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _emailController,
            keyboardType: TextInputType.emailAddress,
            textInputAction: TextInputAction.next,
            decoration: InputDecoration(
              labelText: l10n.contactEmail,
              prefixIcon: const Icon(Icons.mail_outline),
            ),
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _organizationController,
            textInputAction: TextInputAction.next,
            decoration: InputDecoration(
              labelText: l10n.contactOrganization,
            ),
          ),
          const SizedBox(height: 16),
          DropdownButtonFormField<String>(
            initialValue: _subject,
            decoration: InputDecoration(labelText: l10n.contactSubject),
            items: [
              for (final (i, option) in _subjectOptions(l10n).indexed)
                DropdownMenuItem(value: 's$i', child: Text(option)),
            ],
            onChanged: (v) => setState(() => _subject = v ?? 's0'),
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _messageController,
            minLines: 5,
            maxLines: 8,
            decoration: InputDecoration(
              labelText: l10n.contactMessage,
              hintText: l10n.contactMessageHint,
              alignLabelWithHint: true,
            ),
          ),
          const SizedBox(height: 16),
          FilledButton(
            onPressed: _sending ? null : _submit,
            child: _sending
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.white,
                    ),
                  )
                : Text(l10n.sendMessage),
          ),
        ],
      ),
    );
  }
}