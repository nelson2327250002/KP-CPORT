import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class AuthProvider with ChangeNotifier {
  bool _isLoggedIn = false;
  bool _isLoading = false;

  // Pastikan IP laptop Anda tetap 192.168.18.68 dan server NestJS menyala
  final String _baseUrl = 'http://172.20.10.3:3000';

  bool get isLoggedIn => _isLoggedIn;
  bool get isLoading => _isLoading;

  Null get user => null;

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();

    // Karena kita sudah mendaftarkan AuthController, rute resminya adalah /auth/login
    final String path = '/auth/login';

    try {
      debugPrint("Mencoba Login ke: $_baseUrl$path");

      final response = await http
          .post(
            Uri.parse('$_baseUrl$path'),
            headers: {'Content-Type': 'application/json'},
            // Mengirim email dan password sesuai kebutuhan validateUser di backend
            body: jsonEncode({
              'username':
                  email, // Backend Anda menerima key 'username' di Controller
              'password': password,
            }),
          )
          .timeout(const Duration(seconds: 10));

      debugPrint("HTTP Status: ${response.statusCode}");
      debugPrint("Response Body: ${response.body}");

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        final prefs = await SharedPreferences.getInstance();

        // 1. Simpan status login
        await prefs.setBool('is_logged_in', true);

        // 2. Simpan Access Token (JWT) dari backend
        if (data['access_token'] != null) {
          await prefs.setString('auth_token', data['access_token']);
        }

        // 3. Simpan data user jika diperlukan (misal: nama sales)
        if (data['user'] != null) {
          await prefs.setString('user_data', jsonEncode(data['user']));
        }

        _isLoggedIn = true;
        notifyListeners();
        return true;
      } else {
        debugPrint("Login Gagal: Cek email atau password.");
        return false;
      }
    } on SocketException {
      debugPrint("📡 Masalah Jaringan: Server tidak terjangkau.");
      return false;
    } catch (e) {
      debugPrint("⚠️ Kesalahan: $e");
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> checkSession() async {
    final prefs = await SharedPreferences.getInstance();
    _isLoggedIn = prefs.getBool('is_logged_in') ?? false;
    notifyListeners();
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    // Menghapus seluruh sesi termasuk status absensi harian
    await prefs.clear();
    _isLoggedIn = false;
    notifyListeners();
  }
}
