import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class OrderDetailPage extends StatelessWidget {
  final Map<String, dynamic> order;

  const OrderDetailPage({super.key, required this.order});

  // Fungsi pengaman untuk mengubah String dari API menjadi Angka
  num _parseNumber(dynamic value) {
    if (value is num) return value;
    if (value is String) return num.tryParse(value) ?? 0;
    return 0;
  }

  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat.currency(
      locale: 'id_ID',
      symbol: 'Rp ',
      decimalDigits: 0,
    );

    final DateTime date = DateTime.parse(
      order['tanggalPesanan'] ?? DateTime.now().toString(),
    );

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text(
          "Detail #${order['fakturId'] ?? '-'}",
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        centerTitle: true,
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildHeader(date),
            const SizedBox(height: 24),
            const Text(
              "Rincian Produk",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 12),

            // 🔥 SEKARANG DATA ITEMS TIDAK AKAN NULL KARENA SUDAH ADA 'relations' DI BACKEND
            // Tetap gunakan pengaman '?? []' untuk berjaga-jaga
            ...((order['items'] as List?) ?? [])
                .map((item) => _buildProductItem(item, currencyFormat))
                .toList(),

            const Divider(height: 40),
            _buildPaymentSummary(currencyFormat),
            const SizedBox(height: 24),
            if (order['note'] != null && order['note'].toString().isNotEmpty)
              _buildNoteSection(),
          ],
        ),
      ),
    );
  }

  Widget _buildProductItem(Map<String, dynamic> item, NumberFormat format) {
    // 1. Ambil data dengan kunci yang sesuai dengan OrderItem entity di NestJS
    final String namaProduk = item['namaProduk'] ?? "Produk Tidak Diketahui";
    final num kuantitas = _parseNumber(item['kuantitas']);
    final num hargaSatuan = _parseNumber(item['hargaSatuan']);

    // 2. Hitung total per baris (Subtotal)
    final num totalPerItem = hargaSatuan * kuantitas;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Icon kecil untuk mempercantik UI
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.grey.shade100,
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(
              Icons.inventory_2_outlined,
              size: 18,
              color: Colors.blueGrey,
            ),
          ),
          const SizedBox(width: 12),

          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  namaProduk,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  "$kuantitas x ${format.format(hargaSatuan)}",
                  style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
                ),
              ],
            ),
          ),

          Text(
            format.format(totalPerItem),
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              color: Colors.black,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentSummary(NumberFormat format) {
    final total = _parseNumber(order['totalKeseluruhan']);
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Text(
          "Total Keseluruhan",
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        Text(
          format.format(total),
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Color(0xFF1E3A8A),
          ),
        ),
      ],
    );
  }

  Widget _buildHeader(DateTime date) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFF9FAFB),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          _infoRow("Nama Toko", order['namaToko'] ?? "-"),
          _infoRow("Sales", order['namaSales'] ?? "-"),
          _infoRow("Waktu", DateFormat('dd MMMM yyyy, HH:mm').format(date)),
          _infoRow(
            "Status",
            order['status'].toString().replaceAll('_', ' '),
            isStatus: true,
          ),
        ],
      ),
    );
  }

  Widget _infoRow(String label, String value, {bool isStatus = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.grey)),
          Text(
            value,
            style: TextStyle(
              fontWeight: FontWeight.bold,
              color: isStatus ? const Color(0xFF2563EB) : Colors.black,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNoteSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Catatan:", style: TextStyle(fontWeight: FontWeight.bold)),
        const SizedBox(height: 4),
        Text(order['note'] ?? "", style: const TextStyle(color: Colors.grey)),
      ],
    );
  }
}
