import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/logger/sentry.dart';
import '../../../core/storage/secure_store.dart';
import '../../../data/repositories/chatbot_repository.dart';
import 'package:niser_mobile/l10n/generated/app_localizations.dart';

class _ChatMessage {
  const _ChatMessage({
    required this.fromUser,
    required this.text,
    this.sources = const [],
  });

  final bool fromUser;
  final String text;
  final List<Map<String, dynamic>> sources;
}

class ChatScreen extends ConsumerStatefulWidget {
  const ChatScreen({super.key});

  @override
  ConsumerState<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends ConsumerState<ChatScreen> {
  final _controller = TextEditingController();
  final _scrollController = ScrollController();

  List<_ChatMessage> _messages = [];
  bool _streaming = false;
  bool _loadingHistory = true;
  bool _clearing = false;

  @override
  void initState() {
    super.initState();
    _init();
  }

  @override
  void dispose() {
    _controller.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _init() async {
    try {
      await ref.read(chatbotRepositoryProvider).init();
    } catch (_) {}
    await _loadHistory();
  }

  Future<void> _loadHistory() async {
    try {
      final entries = await ref.read(chatbotRepositoryProvider).history();
      if (!mounted) return;
      setState(() {
        _messages = [
          for (final entry in entries)
            _ChatMessage(
              fromUser: entry['role'] == 'user',
              text: (entry['content'] as String?) ?? '',
            ),
        ];
        _loadingHistory = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() => _loadingHistory = false);
    }
  }

  Future<void> _clearHistory() async {
    setState(() => _clearing = true);
    try {
      await ref.read(chatbotRepositoryProvider).clearHistory();
      if (!mounted) return;
      setState(() {
        _messages = [];
        _clearing = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(AppLocalizations.of(context).chatHistoryCleared)),
      );
    } catch (_) {
      if (!mounted) return;
      setState(() => _clearing = false);
    }
  }

  Future<String> _fingerprint() async {
    final store = ref.read(secureStoreProvider);
    final existing = await store.readChatFingerprint();
    if (existing != null && existing.isNotEmpty) return existing;
    final random = Random();
    final fp = List.generate(
      32,
      (_) => random.nextInt(36).toRadixString(36),
    ).join();
    await store.writeChatFingerprint(fp);
    return fp;
  }

  Future<void> _send() async {
    final text = _controller.text.trim();
    if (text.isEmpty || _streaming) return;

    final l10n = AppLocalizations.of(context);
    _controller.clear();

    setState(() {
      _messages = [
        ..._messages,
        _ChatMessage(fromUser: true, text: text),
        const _ChatMessage(fromUser: false, text: ''),
      ];
      _streaming = true;
    });
    _scrollToBottom();

    var assistantIndex = _messages.length - 1;
    var buffer = '';

    try {
      final fingerprint = await _fingerprint();
      final stream = ref.read(chatbotRepositoryProvider).sendMessage(
            message: text,
            history: [
              for (final m in _messages.take(assistantIndex))
                {'role': m.fromUser ? 'user' : 'assistant', 'content': m.text},
            ],
            fingerprint: fingerprint,
          );

      await for (final event in stream) {
        if (!mounted) return;
        if (event.token != null) {
          buffer += event.token!;
          setState(() {
            _messages[assistantIndex] = _ChatMessage(
              fromUser: false,
              text: buffer,
              sources: _messages[assistantIndex].sources,
            );
          });
          _scrollToBottom();
        }
        if (event.sources != null) {
          setState(() {
            _messages[assistantIndex] = _ChatMessage(
              fromUser: false,
              text: buffer,
              sources: event.sources!,
            );
          });
        }
        if (event.error != null) {
          throw Exception(event.error);
        }
      }
    } catch (e) {
      CrashLogger.captureError(e, context: 'chat-stream');
      if (!mounted) return;
      setState(() {
        _messages[assistantIndex] = _ChatMessage(
          fromUser: false,
          text: buffer.isEmpty ? l10n.chatFailed : buffer,
        );
      });
    } finally {
      if (mounted) {
        setState(() => _streaming = false);
      }
    }
    _scrollToBottom();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!_scrollController.hasClients) return;
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: const Duration(milliseconds: 200),
        curve: Curves.easeOut,
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.chatTitle),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_outline),
            tooltip: l10n.clearSession,
            onPressed: _clearing ? null : _clearHistory,
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(child: _buildMessages(l10n)),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 4),
            child: Text(
              l10n.chatConsent,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: Theme.of(context).colorScheme.outline,
                  ),
            ),
          ),
          _ChatInput(
            controller: _controller,
            streaming: _streaming,
            onSend: _send,
            hint: l10n.chatHint,
            sendLabel: l10n.chatSend,
          ),
        ],
      ),
    );
  }

  Widget _buildMessages(AppLocalizations l10n) {
    if (_loadingHistory) {
      return const Center(child: CircularProgressIndicator());
    }
    if (_messages.isEmpty && !_streaming) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Text(
            l10n.chatWelcome,
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Theme.of(context).colorScheme.outline,
                ),
          ),
        ),
      );
    }

    return ListView.builder(
      controller: _scrollController,
      padding: const EdgeInsets.all(16),
      itemCount: _messages.length,
      itemBuilder: (context, index) {
        final message = _messages[index];
        return _MessageBubble(message: message);
      },
    );
  }
}

class _ChatInput extends StatelessWidget {
  const _ChatInput({
    required this.controller,
    required this.streaming,
    required this.onSend,
    required this.hint,
    required this.sendLabel,
  });

  final TextEditingController controller;
  final bool streaming;
  final VoidCallback onSend;
  final String hint;
  final String sendLabel;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      top: false,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 8, 8, 8),
        child: Row(
          children: [
            Expanded(
              child: TextField(
                controller: controller,
                minLines: 1,
                maxLines: 4,
                textInputAction: TextInputAction.send,
                onSubmitted: (_) => onSend(),
                decoration: InputDecoration(
                  hintText: hint,
                  isDense: true,
                  contentPadding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                ),
              ),
            ),
            const SizedBox(width: 8),
            IconButton.filled(
              icon: streaming
                  ? const SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: Colors.white,
                      ),
                    )
                  : const Icon(Icons.send),
              onPressed: streaming ? null : onSend,
              tooltip: sendLabel,
            ),
          ],
        ),
      ),
    );
  }
}

class _MessageBubble extends StatelessWidget {
  const _MessageBubble({required this.message});

  final _ChatMessage message;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final alignment =
        message.fromUser ? Alignment.centerRight : Alignment.centerLeft;

    return Align(
      alignment: alignment,
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        constraints: const BoxConstraints(maxWidth: 320),
        decoration: BoxDecoration(
          color: message.fromUser
              ? theme.colorScheme.primary
              : theme.colorScheme.surfaceContainerHighest,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(16),
            topRight: const Radius.circular(16),
            bottomLeft: Radius.circular(message.fromUser ? 16 : 4),
            bottomRight: Radius.circular(message.fromUser ? 4 : 16),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              message.text,
              style: TextStyle(
                color: message.fromUser ? Colors.white : theme.colorScheme.onSurface,
              ),
            ),
            if (message.text.isEmpty)
              Padding(
                padding: const EdgeInsets.all(4),
                child: Text(
                  AppLocalizations.of(context).chatThinking,
                  style: TextStyle(
                    fontSize: 13,
                    fontStyle: FontStyle.italic,
                    color: message.fromUser
                        ? Colors.white.withValues(alpha: 0.9)
                        : theme.colorScheme.onSurfaceVariant,
                  ),
                ),
              ),
            if (message.sources.isNotEmpty) ...[
              const SizedBox(height: 8),
              _SourcesPanel(
                sources: message.sources,
                onUserBubble: message.fromUser,
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _SourcesPanel extends StatelessWidget {
  const _SourcesPanel({required this.sources, required this.onUserBubble});

  final List<Map<String, dynamic>> sources;
  final bool onUserBubble;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context);
    final textColor =
        onUserBubble ? Colors.white70 : theme.colorScheme.onSurfaceVariant;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          l10n.chatSources,
          style: theme.textTheme.labelSmall?.copyWith(
            color: theme.colorScheme.primary,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 4),
        for (final source in sources.take(5))
          Padding(
            padding: const EdgeInsets.only(bottom: 2),
            child: Text(
              '• ${(source['title'] as String?) ?? 'Source'}',
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style:
                  theme.textTheme.bodySmall?.copyWith(color: textColor),
            ),
          ),
      ],
    );
  }
}