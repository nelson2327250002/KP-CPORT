import 'dart:convert';
import 'dart:io';
import 'package:cport_mobile/providers/auth_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../katalog/list_produk.dart';
import '../history/order_history.dart';
import '../order/order_form.dart'; // 1. Aktifkan import ini sekarang

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  // IP API sesuai laptop Anda
  final String _baseUrl = 'http://172.20.10.3:3000';

  // Mengambil data Pengumuman
  Future<List<dynamic>> _getAnnouncements() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');

    try {
      final response = await http
          .get(
            Uri.parse('$_baseUrl/announcements'),
            headers: {
              'Authorization': 'Bearer $token', // Kirim token JWT
            },
          )
          .timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  // Mengambil jumlah Pesanan untuk subtitle menu
  Future<int> _getOrderCount() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');

    try {
      final response = await http.get(
        Uri.parse('$_baseUrl/orders'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200) {
        List data = jsonDecode(response.body);
        return data.length;
      }
      return 0;
    } catch (e) {
      return 0;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      appBar: AppBar(
        title: const Text(
          "Dashboard",
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        backgroundColor: Colors.white,
        elevation: 0,
        foregroundColor: Colors.black,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.redAccent),
            onPressed: () => _handleLogout(context),
          ),
        ],
      ),
      // 2. Tarik ke bawah untuk memperbarui Pengumuman & Angka Riwayat
      body: RefreshIndicator(
        onRefresh: () async => setState(() {}),
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                "Pengumuman Terbaru",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),

              // Daftar Pengumuman dari API
              FutureBuilder<List<dynamic>>(
                future: _getAnnouncements(),
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: LinearProgressIndicator());
                  }
                  if (!snapshot.hasData || snapshot.data!.isEmpty) {
                    return _buildEmptyState("Belum ada pengumuman baru.");
                  }

                  return Column(
                    children: snapshot.data!.map((item) {
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: _buildAnnouncementCard(
                          // 1. Ubah 'title' menjadi statis atau ambil dari pembuat
                          title: "Info dari ${item['pembuat'] ?? 'Admin'}",
                          // 2. SESUAIKAN: Ubah 'content' menjadi 'pesan' sesuai DTO NestJS
                          desc: item['pesan'] ?? "",
                          // 3. SESUAIKAN: Ubah 'createdAt' menjadi 'tanggal'
                          date:
                              item['tanggal']?.toString().substring(0, 10) ??
                              "-",
                        ),
                      );
                    }).toList(),
                  );
                },
              ),

              const SizedBox(height: 32),
              const Text(
                "Menu Utama",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),

              _menuItem(
                icon: Icons.inventory_2_outlined,
                title: "Katalog Barang",
                subtitle: "Lihat stok produk tanpa harga",
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const ListProdukPage(),
                  ),
                ),
              ),

              _menuItem(
                icon: Icons.shopping_cart_outlined,
                title: "Buat Pesanan",
                subtitle: "Input pesanan toko langsung",
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                    // 2. Arahkan langsung ke OrderFormPage tanpa melalui proses foto
                    // Jika butuh data barang dari katalog, kirim list kosong [] terlebih dahulu
                    builder: (context) => const OrderFormPage(),
                  ),
                ),
              ),

              // 3. Hubungkan ke OrderHistoryPage
              FutureBuilder<int>(
                future: _getOrderCount(),
                builder: (context, snapshot) {
                  return _menuItem(
                    icon: Icons.history_outlined,
                    title: "Riwayat Pesanan",
                    subtitle: "${snapshot.data ?? 0} pesanan berhasil dibuat",
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const OrderHistoryPage(),
                      ),
                    ),
                  );
                },
              ),

              const SizedBox(height: 40),
              const Center(
                child: Text(
                  "Cport Sales App",
                  style: TextStyle(color: Colors.grey, fontSize: 12),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _handleLogout(BuildContext context) async {
    // Ambil data User dari AuthProvider untuk mendapatkan salesId
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final String? salesId =
        authProvider.user?.id; // Pastikan model User Anda punya field 'id'

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          title: const Text("Konfirmasi"),
          content: const Text(
            "Sesi Anda akan dihapus, lokasi pada peta akan dibersihkan, dan aplikasi akan ditutup.",
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text("Batal"),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
              onPressed: () async {
                try {
                  // 1. Beritahu backend untuk hapus titik di peta
                  // Gunakan IP yang sudah Anda definisikan di _baseUrl
                  if (salesId != null) {
                    await http
                        .post(
                          Uri.parse(
                            '$_baseUrl/attendance/logout-cleanup/$salesId',
                          ),
                        )
                        .timeout(const Duration(seconds: 5));
                  }

                  // 2. Hapus data di SharedPreferences (Sesi lokal)
                  final prefs = await SharedPreferences.getInstance();
                  await prefs.clear();

                  // 3. Tutup Aplikasi secara total
                  if (Platform.isAndroid) {
                    SystemNavigator.pop();
                  } else {
                    exit(0);
                  }
                } catch (e) {
                  // Jika API gagal (misal tidak ada internet), tetap logout lokal demi keamanan
                  final prefs = await SharedPreferences.getInstance();
                  await prefs.clear();
                  exit(0);
                }
              },
              child: const Text(
                "Keluar Aplikasi",
                style: TextStyle(color: Colors.white),
              ),
            ),
          ],
        );
      },
    );
  }

  // --- UI Reusable Widgets ---
  Widget _buildEmptyState(String message) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Center(
        child: Text(message, style: const TextStyle(color: Colors.grey)),
      ),
    );
  }

  Widget _buildAnnouncementCard({
    required String title,
    required String desc,
    required String date,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFEFF6FF),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFDBEAFE)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(
                Icons.campaign_outlined,
                color: Color(0xFF3B82F6),
                size: 20,
              ),
              const SizedBox(width: 8),
              Text(
                title,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF1E3A8A),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            desc,
            style: const TextStyle(color: Color(0xFF1D4ED8), fontSize: 14),
          ),
          const SizedBox(height: 12),
          Align(
            alignment: Alignment.centerRight,
            child: Text(
              date,
              style: const TextStyle(color: Color(0xFF60A5FA), fontSize: 11),
            ),
          ),
        ],
      ),
    );
  }

  Widget _menuItem({
    required IconData icon,
    required String title,
    required String subtitle,
    VoidCallback? onTap,
  }) {
    return Card(
      elevation: 0,
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: Color(0xFFF3F4F6)),
      ),
      child: ListTile(
        onTap: onTap,
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: const Color(0xFFF9FAFB),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: const Color(0xFF374151)),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(subtitle, style: const TextStyle(fontSize: 12)),
        trailing: const Icon(Icons.chevron_right, size: 20),
      ),
    );
  }
}
