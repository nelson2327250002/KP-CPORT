import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';

class CheckoutShopPage extends StatefulWidget {
  final List<dynamic> selectedItems;
  const CheckoutShopPage({super.key, required this.selectedItems});

  @override
  State<CheckoutShopPage> createState() => _CheckoutShopPageState();
}

class _CheckoutShopPageState extends State<CheckoutShopPage> {
  final String _baseUrl = 'http://172.20.10.3:3000';
  final _namaTokoController = TextEditingController();
  final _catatanController = TextEditingController();
  final currency = NumberFormat.currency(
    locale: 'id_ID',
    symbol: 'Rp ',
    decimalDigits: 0,
  );
  bool _isLoading = false;

  final Map<int, TextEditingController> _qtyControllers = {};

  @override
  void initState() {
    super.initState();
    for (var item in widget.selectedItems) {
      _qtyControllers[item['id']] = TextEditingController(
        text: item['jumlahBeli'].toString(),
      );
    }
  }

  @override
  void dispose() {
    for (var controller in _qtyControllers.values) {
      controller.dispose();
    }
    _namaTokoController.dispose();
    _catatanController.dispose();
    super.dispose();
  }

  num _parseNumber(dynamic value) {
    if (value is num) return value;
    if (value is String) return num.tryParse(value) ?? 0;
    return 0;
  }

  double get _totalHarga {
    double total = 0.0;
    for (var item in widget.selectedItems) {
      double harga = _parseNumber(item['harga']).toDouble();
      int qty = int.tryParse(_qtyControllers[item['id']]?.text ?? '0') ?? 0;
      total += (harga * qty);
    }
    return total;
  }

  Future<void> _submitOrder() async {
    if (_namaTokoController.text.isEmpty) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("Nama Toko wajib diisi")));
      return;
    }

    setState(() => _isLoading = true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final salesName = prefs.getString('user_name') ?? "Sales";

      final response = await http.post(
        Uri.parse('$_baseUrl/orders'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          "namaToko": _namaTokoController.text,
          "namaSales": salesName,
          "note": _catatanController.text,
          "items": widget.selectedItems.map((item) {
            return {
              "productId": item['id'],
              "namaProduk": item['nama'],
              "kuantitas":
                  int.tryParse(_qtyControllers[item['id']]?.text ?? '0') ?? 0,
              "hargaSatuan": _parseNumber(item['harga']),
            };
          }).toList(),
        }),
      );

      if (response.statusCode == 201 && mounted) {
        Navigator.of(context).popUntil((route) => route.isFirst);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Pesanan Berhasil Disimpan!")),
        );
      } else {
        throw Exception(jsonDecode(response.body)['message']);
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Error: $e")));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
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
            _buildHeaderTable(),
            const SizedBox(height: 8),
            ...widget.selectedItems.map((item) => _buildItemCard(item)),
            const SizedBox(height: 40),
            _buildInputs(),
            const SizedBox(height: 32),
            _buildTotalCard(),
            const SizedBox(height: 32),
            _buildSubmitButton(),
          ],
        ),
      ),
    );
  }

  Widget _buildHeaderTable() {
    return const Padding(
      padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      child: Row(
        children: [
          Expanded(
            flex: 3,
            child: Text(
              "Produk",
              style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey),
            ),
          ),
          Expanded(
            flex: 1,
            child: Center(
              child: Text(
                "Qty",
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: Colors.grey,
                ),
              ),
            ),
          ),
          Expanded(
            flex: 2,
            child: Align(
              alignment: Alignment.centerRight,
              child: Text(
                "Subtotal",
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: Colors.grey,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildItemCard(dynamic item) {
    // 1. Ambil harga dan pastikan bertipe num agar bisa dikalikan
    final double harga = _parseNumber(item['harga']).toDouble();

    // 2. Ambil nilai dari controller, jika kosong atau bukan angka, anggap 0
    final String qtyText = _qtyControllers[item['id']]?.text ?? '0';
    final int currentQty = int.tryParse(qtyText) ?? 0;

    // 3. Hitung subtotal secara langsung di dalam build
    final double subtotal = harga * currentQty;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          // KOLOM PRODUK (KIRI)
          Expanded(
            flex: 3,
            child: Text(
              item['nama'] ?? "-",
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
            ),
          ),

          // KOLOM QTY (TENGAH)
          Expanded(
            flex: 1,
            child: TextField(
              controller: _qtyControllers[item['id']],
              keyboardType: TextInputType.number,
              textAlign: TextAlign.center,
              decoration: const InputDecoration(
                isDense: true,
                contentPadding: EdgeInsets.symmetric(vertical: 4),
                enabledBorder: UnderlineInputBorder(
                  borderSide: BorderSide(color: Colors.grey),
                ),
              ),
              onChanged: (value) {
                // Trigger build ulang agar subtotal & total akhir dihitung kembali
                setState(() {});
              },
            ),
          ),

          // KOLOM SUB TOTAL (KANAN)
          Expanded(
            flex: 2,
            child: Text(
              currency.format(
                subtotal,
              ), // Harga yang tadinya hilang muncul di sini
              textAlign: TextAlign.right,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInputs() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Nama Toko",
          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey),
        ),
        TextField(
          controller: _namaTokoController,
          decoration: const InputDecoration(
            hintText: "Masukkan nama toko",
            enabledBorder: UnderlineInputBorder(
              borderSide: BorderSide(color: Colors.grey),
            ),
          ),
        ),
        const SizedBox(height: 24),
        const Text(
          "Catatan ",
          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey),
        ),
        TextField(
          controller: _catatanController,
          decoration: const InputDecoration(
            hintText: "Masukkan catatan tambahan...",
            enabledBorder: UnderlineInputBorder(
              borderSide: BorderSide(color: Colors.grey),
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
        color: const Color(0xFFF3F4F6).withOpacity(0.5),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                "Total Barang",
                style: TextStyle(color: Colors.grey, fontSize: 16),
              ),
              Text(
                currency.format(_totalHarga),
                style: const TextStyle(
                  fontWeight: FontWeight.w500,
                  fontSize: 16,
                ),
              ),
            ],
          ),
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 12),
            child: Divider(),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                "Total Akhir",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              Text(
                _totalHarga.toStringAsFixed(2),
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                  color: Colors.black,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSubmitButton() {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: _isLoading ? null : _submitOrder,
        style: ElevatedButton.styleFrom(
          padding: const EdgeInsets.all(18),
          backgroundColor: Colors.white,
          foregroundColor: const Color(0xFF6366F1),
          elevation: 0,
          side: BorderSide(color: Colors.grey.shade300),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(30),
          ),
        ),
        child: _isLoading
            ? const SizedBox(
                height: 20,
                width: 20,
                child: CircularProgressIndicator(strokeWidth: 2),
              )
            : const Text(
                "Simpan Pesanan",
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
      ),
    );
  }
}
