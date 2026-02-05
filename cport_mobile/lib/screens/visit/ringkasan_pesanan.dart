import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class RingkasanPesananPage extends StatefulWidget {
  final List<Map<String, dynamic>> cartItems;
  final String storeName;

  const RingkasanPesananPage({
    super.key,
    required this.cartItems,
    required this.storeName,
  });

  @override
  State<RingkasanPesananPage> createState() => _RingkasanPesananPageState();
}

class _RingkasanPesananPageState extends State<RingkasanPesananPage> {
  final TextEditingController _noteController = TextEditingController();
  final currencyFormat = NumberFormat.currency(
    locale: 'id_ID',
    symbol: 'Rp ',
    decimalDigits: 0,
  );
  bool isSubmitting = false;

  double get totalHarga => widget.cartItems.fold(
    0,
    (sum, item) => sum + (item['price'] * item['qty']),
  );

  Future<void> _submitOrder() async {
    setState(() => isSubmitting = true);

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      // Ambil nama sales dari session untuk dikirim ke backend
      final String namaSales = prefs.getString('user_name') ?? "Sales Aktif";

      final response = await http
          .post(
            Uri.parse('http://172.20.10.3:3000/orders'),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer $token',
            },
            body: jsonEncode({
              // 1. Sinkronisasi dengan DTO Backend (Bahasa Indonesia)
              'namaToko': widget.storeName,
              'namaSales': namaSales,
              'items': widget.cartItems
                  .map(
                    (item) => {
                      'productId': item['id'],
                      'namaProduk': item['name'],
                      'kuantitas': item['qty'],
                      'hargaSatuan': item['price'],
                    },
                  )
                  .toList(),
              'note': _noteController.text,
            }),
          )
          .timeout(const Duration(seconds: 15));

      if (response.statusCode == 201 || response.statusCode == 200) {
        if (mounted) _showSuccessDialog();
      }
      // 2. Menangani Error Stok (ConflictException / 409)
      else if (response.statusCode == 409) {
        final errorData = jsonDecode(response.body);
        _showErrorSnackBar(errorData['message'] ?? "Stok tidak mencukupi!");
      } else {
        _showErrorSnackBar("Gagal: Status ${response.statusCode}");
      }
    } catch (e) {
      _showErrorSnackBar("Kesalahan Jaringan: $e");
    } finally {
      if (mounted) setState(() => isSubmitting = false);
    }
  }

  void _showErrorSnackBar(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: Colors.red),
    );
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Icon(Icons.check_circle, color: Colors.green, size: 60),
        content: const Text(
          "Pesanan Berhasil!\nMenunggu diproses oleh admin.",
          textAlign: TextAlign.center,
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        actions: [
          Center(
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF2563EB),
              ),
              onPressed: () =>
                  Navigator.popUntil(context, (route) => route.isFirst),
              child: const Text(
                "Kembali ke Dashboard",
                style: TextStyle(color: Colors.white),
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      appBar: AppBar(
        title: const Text(
          "Ringkasan Pesanan",
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // Container Tabel Produk
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: _buildOrderTable(),
            ),
            const SizedBox(height: 24),
            _buildNoteSection(),
            const SizedBox(height: 24),
            _buildTotalCard(),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: isSubmitting ? null : _submitOrder,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2563EB),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  elevation: 0,
                ),
                child: isSubmitting
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text(
                        "Kirim Pesanan",
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Widget pendukung (Table, Note, Total) tetap sama dengan penyesuaian gaya...
  Widget _buildOrderTable() {
    return Table(
      columnWidths: const {
        0: FlexColumnWidth(3),
        1: FlexColumnWidth(1),
        2: FlexColumnWidth(2),
      },
      children: [
        TableRow(
          children: ["Produk", "Qty", "Subtotal"]
              .map(
                (e) => Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Text(
                    e,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Colors.grey,
                    ),
                  ),
                ),
              )
              .toList(),
        ),
        ...widget.cartItems
            .map(
              (item) => TableRow(
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: Text(item['name']),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: Text("${item['qty']}", textAlign: TextAlign.center),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: Text(
                      currencyFormat.format(item['price'] * item['qty']),
                      textAlign: TextAlign.right,
                    ),
                  ),
                ],
              ),
            )
            .toList(),
      ],
    );
  }

  Widget _buildNoteSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Nama Toko",
          style: TextStyle(color: Colors.grey, fontSize: 12),
        ),
        Text(
          widget.storeName,
          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 20),
        const Text(
          "Catatan / Tambahan Barang",
          style: TextStyle(color: Colors.grey, fontSize: 12),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: _noteController,
          maxLines: 3,
          decoration: InputDecoration(
            hintText: "Contoh: Tambah Pipa 2 batang...",
            fillColor: Colors.white,
            filled: true,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Colors.grey.shade300),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildTotalCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF1E3A8A),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Text(
            "TOTAL PESANAN",
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          ),
          Text(
            currencyFormat.format(totalHarga),
            style: const TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}
