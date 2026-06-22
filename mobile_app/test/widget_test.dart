import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:la_merced_mobile/main.dart';

void main() {
  testWidgets('muestra el panel móvil', (WidgetTester tester) async {
    await tester.pumpWidget(const ProviderScope(child: LaMercedApp()));
    await tester.pumpAndSettle();

    expect(find.text('La Merced PyK'), findsOneWidget);
    expect(find.text('Panel móvil'), findsOneWidget);
    expect(find.text('Productos'), findsOneWidget);
  });
}
