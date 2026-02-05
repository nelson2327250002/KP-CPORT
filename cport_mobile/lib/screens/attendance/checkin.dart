import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:provider/provider.dart';
import '../../providers/attendance_provider.dart';

class CheckInPage extends StatefulWidget {
  const CheckInPage({super.key});

  @override
  State<CheckInPage> createState() => _CheckInPageState();
}

class _CheckInPageState extends State<CheckInPage> {
  bool _isLocating = false;
  String _statusMessage = "Anda belum melakukan absensi hari ini.";

  Future<void> _handleCheckIn() async {
    setState(() {
      _isLocating = true;
      _statusMessage = "Sedang memproses absensi...";
    });

    try {
      // 1. Validasi GPS (Izin dan Layanan)
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied)
          throw "Izin lokasi ditolak.";
      }

      // 2. Kirim Data ke Provider (Yang kini terhubung ke NestJS)
      // Catatan: salesId dan salesName biasanya diambil dari AuthProvider atau SharedPreferences
      await Provider.of<AttendanceProvider>(context, listen: false).checkIn(
        salesId: "S001", // Ganti dengan ID asli dari login
        salesName: "Budi Sales", // Ganti dengan Nama asli dari login
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text("Absensi Berhasil! Lokasi terkirim ke Boss."),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      setState(() => _statusMessage = "Gagal Absen: $e");
    } finally {
      if (mounted) setState(() => _isLocating = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 30),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Ilustrasi Lokasi
              Container(
                padding: const EdgeInsets.all(20),
                decoration: const BoxDecoration(
                  color: Color(0xFFEFF6FF),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.my_location_rounded,
                  size: 80,
                  color: Color(0xFF2563EB),
                ),
              ),
              const SizedBox(height: 32),

              const Text(
                "Konfirmasi Kehadiran",
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),
              Text(
                _statusMessage,
                textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.grey, fontSize: 16),
              ),

              const SizedBox(height: 48),

              // Tombol Check-in
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: _isLocating ? null : _handleCheckIn,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF2563EB),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    elevation: 0,
                  ),
                  child: _isLocating
                      ? const SizedBox(
                          height: 24,
                          width: 24,
                          child: CircularProgressIndicator(
                            color: Colors.white,
                            strokeWidth: 3,
                          ),
                        )
                      : const Text(
                          "KIRIM LOKASI & CHECK-IN",
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                ),
              ),

              const SizedBox(height: 16),
              const Text(
                "Aplikasi akan mengirimkan titik koordinat GPS Anda ke sistem pusat.",
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 12, color: Colors.grey),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
