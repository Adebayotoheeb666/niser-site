import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pdfrx/pdfrx.dart';

/// Builds the native PDF view; overridable in widget tests because pdfium
/// requires a real device/emulator.
final pdfViewBuilderProvider = Provider<Widget Function(String path)>(
  (ref) => (path) => PdfViewer.file(path),
);

/// Payload passed through the `/viewer` route.
class PdfDoc {
  const PdfDoc({required this.title, required this.filePath});

  final String title;
  final String filePath;
}

/// In-app PDF reader used for publications saved for offline reading.
class PdfViewerScreen extends ConsumerWidget {
  const PdfViewerScreen({super.key, required this.doc});

  final PdfDoc doc;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          doc.title,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
      ),
      body: ref.watch(pdfViewBuilderProvider)(doc.filePath),
    );
  }
}
