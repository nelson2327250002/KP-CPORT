import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:geolocator/geolocator.dart';
import 'package:share_plus/share_plus.dart';
import 'package:intl/intl.dart';

class CameraWAPage extends StatefulWidget {
  final String storeName;
  final String storePhone;

  const CameraWAPage({
    super.key,
    required this.storeName,
    required this.storePhone,
  });

  @override
  State<CameraWAPage> createState() => _CameraWAPageState();
}

class _CameraWAPageState extends State<CameraWAPage> {
  File? _image;
  final ImagePicker _picker = ImagePicker();
  bool _isProcessing =
      false; // Loading state agar user tahu aplikasi sedang bekerja

  Future<void> _takePhotoAndSend() async {
    try {
      // 1. Cek & Minta Izin Lokasi Terlebih Dahulu
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          _showError("Izin lokasi ditolak.");
          return;
        }
      }

      // 2. Ambil Foto via Kamera
      final XFile? photo = await _picker.pickImage(
        source: ImageSource.camera,
        imageQuality: 70, // Kompres sedikit agar proses share lebih ringan
      );

      if (photo == null) return;

      setState(() {
        _image = File(photo.path);
        _isProcessing = true; // Mulai loading setelah foto diambil
      });

      // 3. Ambil Lokasi GPS (Gunakan timeout agar tidak menunggu selamanya)
      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      ).timeout(const Duration(seconds: 10));

      // 4. Format Pesan Teks
      String message =
          "📸 *BUKTI KUNJUNGAN TOKO*\n"
          "---------------------------\n"
          "Toko: ${widget.storeName}\n"
          "Lokasi: https://www.google.com/maps/search/?api=1&query=${position.latitude},${position.longitude}\n"
          "Waktu: ${DateFormat('dd MMM yyyy, HH:mm').format(DateTime.now())}\n"
          "---------------------------\n"
          "Sent via CPORT Mobile";

      // 5. Eksekusi Share.shareXFiles
      final result = await Share.shareXFiles(
        [XFile(photo.path)],
        text: message,
        subject: 'Kunjungan ${widget.storeName}',
      );

      if (mounted && result.status == ShareResultStatus.success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Berhasil membagikan bukti kunjungan!")),
        );
      }
    } catch (e) {
      debugPrint("Error Sharing: $e");
      _showError("Gagal membagikan: $e");
    } finally {
      if (mounted) setState(() => _isProcessing = false);
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Kunjungan: ${widget.storeName}")),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _image != null
                  ? ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: Image.file(
                        _image!,
                        height: 300,
                        fit: BoxFit.cover,
                      ),
                    )
                  : Icon(
                      Icons.storefront,
                      size: 100,
                      color: Colors.grey.shade300,
                    ),
              const SizedBox(height: 32),

              _isProcessing
                  ? const CircularProgressIndicator()
                  : ElevatedButton.icon(
                      onPressed: _takePhotoAndSend,
                      icon: const Icon(Icons.camera_alt),
                      label: const Text("Ambil Foto & Bagikan"),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 32,
                          vertical: 16,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),

              const SizedBox(height: 24),
              const Text(
                "Foto dan data lokasi akan dibagikan ke WhatsApp sebagai bukti kunjungan tervalidasi.",
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey, fontSize: 12),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
