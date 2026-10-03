import 'package:flutter/material.dart';

/// NISER brand palette (mirrors the web app).
abstract class NiserColors {
  static const Color primary = Color(0xFF006B3F);
  static const Color primaryDark = Color(0xFF004D2D);
  static const Color gold = Color(0xFFFFB81C);
  static const Color surface = Color(0xFFF5F7F3);
  static const Color textPrimary = Color(0xFF1A1D1A);
  static const Color textSecondary = Color(0xFF5B635B);
  static const Color border = Color(0xFFDDE3DA);
  static const Color error = Color(0xFFBA1A1A);

  // Dark-mode counterparts.
  static const Color darkSurface = Color(0xFF111511);
  static const Color darkCard = Color(0xFF1A201A);
  static const Color darkBorder = Color(0xFF303830);
  static const Color primaryTint = Color(0xFF8CD9A5);
}

/// Material 3 theme derived from the NISER palette.
abstract class AppTheme {
  static ThemeData get light {
    final scheme = ColorScheme.fromSeed(
      seedColor: NiserColors.primary,
      primary: NiserColors.primary,
      surface: NiserColors.surface,
      brightness: Brightness.light,
    ).copyWith(
      // M4 a11y: keep helper text ≥ AA (4.5:1) on surface/white.
      outline: const Color(0xFF5A615A),
      outlineVariant: const Color(0xFFDDE3DA),
      onSurfaceVariant: const Color(0xFF3F463F),
    );

    return ThemeData(
      useMaterial3: true,
      colorScheme: scheme,
      scaffoldBackgroundColor: NiserColors.surface,
      appBarTheme: const AppBarTheme(
        backgroundColor: NiserColors.primary,
        foregroundColor: Colors.white,
        centerTitle: false,
        elevation: 0,
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: Colors.white,
        indicatorColor: const Color(0xFFD7E8DE),
        iconTheme: WidgetStateProperty.resolveWith((states) {
          final selected = states.contains(WidgetState.selected);
          return IconThemeData(
            color: selected ? NiserColors.primary : NiserColors.textSecondary,
          );
        }),
        labelTextStyle: WidgetStateProperty.resolveWith((states) {
          final selected = states.contains(WidgetState.selected);
          return TextStyle(
            fontSize: 12,
            fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
            color: selected ? NiserColors.primary : NiserColors.textSecondary,
          );
        }),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: NiserColors.primary,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: NiserColors.border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: NiserColors.border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: NiserColors.primary, width: 2),
        ),
      ),
      cardTheme: const CardThemeData(
        color: Colors.white,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(16)),
          side: BorderSide(color: NiserColors.border),
        ),
      ),
      chipTheme: ChipThemeData(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
          side: const BorderSide(color: NiserColors.border),
        ),
      ),
      dividerTheme: const DividerThemeData(color: NiserColors.border),
    );
  }

  /// Dark theme derived from the same NISER palette.
  ///
  /// Keeps brand green on the app bar (darkened) and buttons, with
  /// dark green-tinted surfaces. Text roles stay ≥ AA against surfaces.
  static ThemeData get dark {
    final scheme = ColorScheme.fromSeed(
      seedColor: NiserColors.primary,
      brightness: Brightness.dark,
    ).copyWith(
      primary: NiserColors.primaryTint,
      surface: NiserColors.darkSurface,
      // M4 a11y parity: helper text ≥ AA (4.5:1) on dark surfaces.
      outline: const Color(0xFFA9B2A9),
      outlineVariant: NiserColors.darkBorder,
      onSurfaceVariant: const Color(0xFFC6CFC6),
    );

    return ThemeData(
      useMaterial3: true,
      colorScheme: scheme,
      scaffoldBackgroundColor: NiserColors.darkSurface,
      appBarTheme: const AppBarTheme(
        backgroundColor: NiserColors.primaryDark,
        foregroundColor: Colors.white,
        centerTitle: false,
        elevation: 0,
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: NiserColors.darkCard,
        indicatorColor: const Color(0xFF1F4030),
        iconTheme: WidgetStateProperty.resolveWith((states) {
          final selected = states.contains(WidgetState.selected);
          return IconThemeData(
            color: selected ? NiserColors.primaryTint : const Color(0xFFA9B2A9),
          );
        }),
        labelTextStyle: WidgetStateProperty.resolveWith((states) {
          final selected = states.contains(WidgetState.selected);
          return TextStyle(
            fontSize: 12,
            fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
            color:
                selected ? NiserColors.primaryTint : const Color(0xFFA9B2A9),
          );
        }),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: NiserColors.primary,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: NiserColors.darkCard,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: NiserColors.darkBorder),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: NiserColors.darkBorder),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide:
              const BorderSide(color: NiserColors.primaryTint, width: 2),
        ),
      ),
      cardTheme: const CardThemeData(
        color: NiserColors.darkCard,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(16)),
          side: BorderSide(color: NiserColors.darkBorder),
        ),
      ),
      chipTheme: ChipThemeData(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
          side: const BorderSide(color: NiserColors.darkBorder),
        ),
      ),
      dividerTheme: const DividerThemeData(color: NiserColors.darkBorder),
    );
  }
}