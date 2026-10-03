import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

import '../theme/app_theme.dart';

/// Cached network image with consistent placeholder, error fallback and
/// fade-in. Uses `cached_network_image` so images survive offline via the
/// HTTP disk cache and do not re-download on scroll.
class NiserCachedImage extends StatelessWidget {
  const NiserCachedImage({
    super.key,
    required this.url,
    this.width,
    this.height,
    this.fit = BoxFit.cover,
    this.borderRadius,
    this.placeholderIcon = Icons.image_outlined,
  });

  final String? url;
  final double? width;
  final double? height;
  final BoxFit fit;
  final BorderRadius? borderRadius;
  final IconData placeholderIcon;

  @override
  Widget build(BuildContext context) {
    if (url == null || url!.isEmpty) return _fallback(context);
    final image = CachedNetworkImage(
      imageUrl: url!,
      width: width,
      height: height,
      fit: fit,
      placeholder: (_, __) => _placeholder(context),
      errorWidget: (_, __, ___) => _fallback(context),
      fadeInDuration: const Duration(milliseconds: 180),
      fadeOutDuration: const Duration(milliseconds: 120),
      memCacheWidth: width != null ? (width! * 2).round() : null,
      memCacheHeight: height != null ? (height! * 2).round() : null,
      // Do not re-fetch if offline; show cached file via disk cache.
      // `cached_network_image` honours HTTP cache headers + local disk cache.
    );
    if (borderRadius == null) return image;
    return ClipRRect(borderRadius: borderRadius!, child: image);
  }

  Widget _placeholder(BuildContext context) {
    return Container(
      width: width,
      height: height,
      color: NiserColors.primary.withValues(alpha: 0.06),
      child: const Center(
        child: SizedBox(
          width: 20,
          height: 20,
          child: CircularProgressIndicator(strokeWidth: 2),
        ),
      ),
    );
  }

  Widget _fallback(BuildContext context) {
    return Container(
      width: width,
      height: height,
      color: NiserColors.primary.withValues(alpha: 0.08),
      child: Icon(placeholderIcon, color: NiserColors.primary, size: 24),
    );
  }
}

/// Circle avatar that loads via disk cache.
class NiserCachedAvatar extends StatelessWidget {
  const NiserCachedAvatar({
    super.key,
    required this.url,
    this.radius = 32,
    this.fallbackIcon = Icons.person,
  });

  final String? url;
  final double radius;
  final IconData fallbackIcon;

  @override
  Widget build(BuildContext context) {
    if (url == null || url!.isEmpty) {
      return CircleAvatar(
        radius: radius,
        backgroundColor: NiserColors.primary.withValues(alpha: 0.1),
        child: Icon(fallbackIcon, size: radius, color: NiserColors.primary),
      );
    }
    return CircleAvatar(
      radius: radius,
      backgroundColor: NiserColors.primary.withValues(alpha: 0.1),
      foregroundImage: CachedNetworkImageProvider(url!),
      onForegroundImageError: (_, __) {},
      child: Icon(fallbackIcon, size: radius * 0.9, color: NiserColors.primary),
    );
  }
}
