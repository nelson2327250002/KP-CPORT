import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';

// Import Providers
import 'providers/auth_provider.dart';
import 'providers/attendance_provider.dart';

// Import Screens
import 'screens/auth/login_screen.dart';
import 'screens/dashboard/home_page.dart';
import 'screens/attendance/checkin.dart';

void main() {
  // Memastikan binding Flutter terinisialisasi sebelum menjalankan app
  WidgetsFlutterBinding.ensureInitialized();

  runApp(
    MultiProvider(
      providers: [
        // checkSession() akan berjalan otomatis saat app dibuka
        ChangeNotifierProvider(create: (_) => AuthProvider()..checkSession()),
        // loadStatus() akan memuat status absensi terakhir dari storage
        ChangeNotifierProvider(
          create: (_) => AttendanceProvider()..loadStatus(),
        ),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Cport Sales App',
      theme: ThemeData(
        useMaterial3: true,
        textTheme: GoogleFonts.interTextTheme(),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF2563EB),
          primary: const Color(0xFF2563EB),
        ),
      ),

      // 1. REGISTRASI ROUTES
      // Sangat penting untuk fungsi Navigator.pushNamedAndRemoveUntil('/login', ...)
      routes: {
        '/login': (context) => const LoginScreen(),
        '/home': (context) => const HomePage(),
        '/checkin': (context) => const CheckInPage(),
      },

      // 2. LOGIKA PENENTU HALAMAN (ROOT NAVIGATION)
      // Consumer ini akan "mendengarkan" perubahan di AuthProvider & AttendanceProvider
      home: Consumer2<AuthProvider, AttendanceProvider>(
        builder: (context, auth, attendance, child) {
          // STEP 1: Cek Autentikasi
          // Jika tidak login, tampilkan halaman Login
          if (!auth.isLoggedIn) {
            return const LoginScreen();
          }

          // STEP 2: Cek Status Absensi (Gatekeeper)
          // Jika sudah login tapi belum absen hari ini, paksa ke halaman Check-In
          if (!attendance.isCheckedIn) {
            return const CheckInPage();
          }

          // STEP 3: Akses Dashboard
          // Jika sudah login DAN sudah absen, baru arahkan ke Dashboard
          return const HomePage();
        },
      ),
    );
  }
}
