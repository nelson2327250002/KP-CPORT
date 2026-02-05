// lib/providers/attendance_provider.dart
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:geolocator/geolocator.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class AttendanceProvider with ChangeNotifier {
  bool _isCheckedIn = false;
  bool _isLoading = true;

  bool get isCheckedIn => _isCheckedIn;
  bool get isLoading => _isLoading;

  // IP Server sesuai laptop Anda
  final String _baseUrl = 'http://172.20.10.3:3000';

  Future<void> loadStatus() async {
    _isLoading = true;
    notifyListeners();

    final prefs = await SharedPreferences.getInstance();
    String? lastCheckInDate = prefs.getString('last_checkin_date');
    String today = DateTime.now().toString().split(' ')[0];

    if (lastCheckInDate == today) {
      _isCheckedIn = true;
    } else {
      _isCheckedIn = false;
      await prefs.setBool('is_checked_in', false);
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> checkIn({
    required String salesId,
    required String salesName,
  }) async {
    try {
      _isLoading = true;
      notifyListeners();

      Position position = await _determinePosition();

      final response = await http.post(
        Uri.parse('$_baseUrl/attendance/check-in'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'salesId': salesId,
          'salesName': salesName,
          'lokasiCheckIn': 'Lokasi GPS Terdeteksi',
          'lat': position.latitude,
          'lng': position.longitude,
        }),
      );

      if (response.statusCode == 201) {
        final prefs = await SharedPreferences.getInstance();
        String today = DateTime.now().toString().split(' ')[0];
        await prefs.setBool('is_checked_in', true);
        await prefs.setString('last_checkin_date', today);
        _isCheckedIn = true;
      } else {
        throw Exception('Gagal Check-in ke server');
      }
    } catch (e) {
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> prosesLogout(String salesId) async {
    try {
      // 1. Panggil API ini dulu agar checkOutTime di DB terisi
      final response = await http.post(
        Uri.parse('http://172.20.10.3:3000/attendance/logout-cleanup/$salesId'),
      );

      if (response.statusCode == 201 || response.statusCode == 200) {
        print("Berhasil membersihkan lokasi di server");
      }

      // 2. Baru bersihkan SharedPreferences
      final prefs = await SharedPreferences.getInstance();
      await prefs.clear();
      _isCheckedIn = false;
      notifyListeners();
    } catch (e) {
      print("Error logout: $e");
    }
  }

  Future<Position> _determinePosition() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) return Future.error('GPS non-aktif.');

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        return Future.error('Izin GPS ditolak.');
      }
    }
    return await Geolocator.getCurrentPosition();
  }

  Future<void> resetAttendance() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('is_checked_in');
    await prefs.remove('last_checkin_date');
    _isCheckedIn = false;
    notifyListeners();
  }
}
