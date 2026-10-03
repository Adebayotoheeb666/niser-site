# Codegen — freezed + json_serializable

Per `NISER_Mobile_App_Flutter_Implementation_Plan.md:164` the Dart models mirror
`types/cms.ts`. The initial implementation uses hand-written `fromJson`/`toJson`
with null-safe defaults so a codegen step is optional.

From this release the tooling for `freezed` + `json_serializable` is wired
(`pubspec.yaml` dev_dependencies + `build.yaml`). New models should use:

```dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'my_model.freezed.dart';
part 'my_model.g.dart';

@freezed
class MyModel with _$MyModel {
  const factory MyModel({required String id, required String title}) = _MyModel;
  factory MyModel.fromJson(Map<String, dynamic> json) => _$MyModelFromJson(json);
}
```

Generate with:

```sh
cd mobile
dart run build_runner build --delete-conflicting-outputs
# or watch
dart run build_runner watch --delete-conflicting-outputs
```

CI will check `dart run build_runner build --dry-run` in the coverage gate.
Existing hand-written models (`publication.dart`, `insight.dart`, etc.) remain
and can be migrated incrementally; keeping them avoids a single large churn PR.
