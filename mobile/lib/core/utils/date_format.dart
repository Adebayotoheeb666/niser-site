/// Lightweight date formatting (no intl dependency).
library;

const List<String> _months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/// Formats [date] as `12 Aug 2026`. Returns [fallback] when parsing fails.
String formatDate(DateTime? date, {String fallback = ''}) {
  if (date == null) return fallback;
  return '${date.day} ${_months[date.month - 1]} ${date.year}';
}

/// Formats [date] as `Aug 2026` for compact labels.
String formatMonthYear(DateTime? date, {String fallback = ''}) {
  if (date == null) return fallback;
  return '${_months[date.month - 1]} ${date.year}';
}
