import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:la_merced_mobile/features/dashboard/dashboard_screen.dart';
import 'package:la_merced_mobile/features/products/products_screen.dart';
import 'package:la_merced_mobile/features/orders/orders_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ProviderScope(child: LaMercedApp()));
}

final _router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (_, __) => const DashboardScreen(),
    ),
    GoRoute(
      path: '/products',
      builder: (_, __) => const ProductsScreen(),
    ),
    GoRoute(
      path: '/orders',
      builder: (_, __) => const OrdersScreen(),
    ),
  ],
);

class LaMercedApp extends StatelessWidget {
  const LaMercedApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'La Merced PyK',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF1E40AF)),
        useMaterial3: true,
      ),
      routerConfig: _router,
    );
  }
}
