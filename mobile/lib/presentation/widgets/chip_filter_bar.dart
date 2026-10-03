import 'package:flutter/material.dart';

/// Horizontal, scrollable row of choice chips for list filters.
class ChipFilterBar<T> extends StatelessWidget {
  const ChipFilterBar({
    super.key,
    required this.options,
    required this.selected,
    required this.onSelected,
    this.labelOf,
  });

  final List<T> options;

  /// Index of the selected option (or null when none is selected).
  final int? selected;
  final ValueChanged<int?> onSelected;
  final String Function(T option)? labelOf;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 48,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: options.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final option = options[index];
          final isSelected = selected == index;
          final label = labelOf?.call(option) ?? option.toString();
          return ChoiceChip(
            label: Text(label),
            selected: isSelected,
            onSelected: (_) => onSelected(isSelected ? null : index),
          );
        },
      ),
    );
  }
}
