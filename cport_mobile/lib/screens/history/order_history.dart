import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'order_detail.dart';

class OrderHistoryPage extends StatefulWidget {
  const OrderHistoryPage({super.key});

  @override
  State<OrderHistoryPage> createState() => _OrderHistoryPageState();
}

class _OrderHistoryPageState extends State<OrderHistoryPage> {
  final String _baseUrl = 'http://172.20.10.3:3000';
  final currencyFormat = NumberFormat.currency(
    locale: 'id_ID',
    symbol: 'Rp ',
    decimalDigits: 0,
  );

  // State untuk data dan filter
  List<dynamic> _allOrders = [];
  List<dynamic> _filteredOrders = [];
  bool _isLoading = true;
  String _searchQuery = "";
  String _selectedStatus = "SEMUA";

  // Daftar status untuk filter
  final List<String> _statusOptions = [
    "SEMUA",
    "MENUNGGU_DIPROSES",
    "SEDANG_DIKIRIM",
    "SUCCESS",
    "DIBATALKAN",
  ];

  @override
  void initState() {
    super.initState();
    _fetchOrderHistory();
  }

  num _parseNumber(dynamic value) {
    if (value is num) return value;
    if (value is String) return num.tryParse(value) ?? 0;
    return 0;
  }

  Future<void> _fetchOrderHistory() async {
    setState(() => _isLoading = true);
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    final String namaSales = prefs.getString('user_name') ?? "";

    try {
      final response = await http
          .get(
            Uri.parse('$_baseUrl/orders?salesName=$namaSales'),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer $token',
            },
          )
          .timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        setState(() {
          _allOrders = jsonDecode(response.body);
          _applyFilters();
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() => _isLoading = false);
      debugPrint("Error fetching history: $e");
    }
  }

  // Logika Filter dan Pencarian
  void _applyFilters() {
    setState(() {
      _filteredOrders = _allOrders.where((order) {
        final namaToko = (order['namaToko'] ?? "").toString().toLowerCase();
        final status = (order['status'] ?? "").toString().toUpperCase();

        final matchesSearch = namaToko.contains(_searchQuery.toLowerCase());
        final matchesStatus =
            _selectedStatus == "SEMUA" || status == _selectedStatus;

        return matchesSearch && matchesStatus;
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      appBar: AppBar(
        title: const Text(
          "Riwayat Pesanan",
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: Column(
        children: [
          // 1. Search Bar
          _buildSearchBar(),
          // 2. Filter Status Chips
          _buildFilterChips(),

          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : RefreshIndicator(
                    onRefresh: _fetchOrderHistory,
                    child: _filteredOrders.isEmpty
                        ? _buildEmptyState()
                        : ListView.builder(
                            padding: const EdgeInsets.all(16),
                            itemCount: _filteredOrders.length,
                            itemBuilder: (context, index) {
                              final order = _filteredOrders[index];
                              return _buildOrderListItem(order);
                            },
                          ),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchBar() {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Colors.white,
      child: TextField(
        onChanged: (value) {
          _searchQuery = value;
          _applyFilters();
        },
        decoration: InputDecoration(
          hintText: "Cari nama toko...",
          prefixIcon: const Icon(Icons.search),
          filled: true,
          fillColor: const Color(0xFFF3F4F6),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide.none,
          ),
          contentPadding: EdgeInsets.zero,
        ),
      ),
    );
  }

  Widget _buildFilterChips() {
    return Container(
      height: 60,
      color: Colors.white,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 12),
        itemCount: _statusOptions.length,
        itemBuilder: (context, index) {
          final status = _statusOptions[index];
          final isSelected = _selectedStatus == status;
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4),
            child: ChoiceChip(
              label: Text(
                status.replaceAll('_', ' '),
                style: TextStyle(
                  fontSize: 11,
                  color: isSelected ? Colors.white : Colors.black,
                ),
              ),
              selected: isSelected,
              onSelected: (selected) {
                setState(() {
                  _selectedStatus = status;
                  _applyFilters();
                });
              },
              selectedColor: const Color(0xFF1E3A8A),
              backgroundColor: const Color(0xFFF3F4F6),
            ),
          );
        },
      ),
    );
  }

  Widget _buildOrderListItem(Map<String, dynamic> order) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Material(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        elevation: 1,
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => OrderDetailPage(order: order),
              ),
            );
          },
          child: _buildOrderCard(order),
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.search_off, size: 48, color: Colors.grey.shade400),
          const SizedBox(height: 16),
          Text(
            "Pesanan tidak ditemukan",
            style: TextStyle(color: Colors.grey.shade600),
          ),
        ],
      ),
    );
  }

  // ... (Widget _buildOrderCard dan _buildStatusBadge tetap sama dengan kode Anda sebelumnya)
  Widget _buildOrderCard(Map<String, dynamic> order) {
    final total = _parseNumber(order['totalKeseluruhan']);
    DateTime date = DateTime.parse(
      order['tanggalPesanan'] ?? DateTime.now().toString(),
    );
    String formattedDate = DateFormat('dd MMM yyyy, HH:mm').format(date);
    String fakturId = order['fakturId'] ?? "-";

    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFFEFF6FF),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(
              Icons.receipt_long_outlined,
              color: Color(0xFF2563EB),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  order['namaToko'] ?? "Toko Tanpa Nama",
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
                Text(
                  "$fakturId • $formattedDate",
                  style: const TextStyle(fontSize: 11, color: Colors.grey),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                currencyFormat.format(total),
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF1E3A8A),
                ),
              ),
              const SizedBox(height: 4),
              _buildStatusBadge(order['status'] ?? 'MENUNGGU_DIPROSES'),
            ],
          ),
          const SizedBox(width: 8),
          const Icon(Icons.chevron_right, color: Colors.grey, size: 16),
        ],
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    Color bgColor;
    Color textColor;
    String label = status.replaceAll('_', ' ');
    switch (status.toUpperCase()) {
      case 'SUCCESS':
        bgColor = Colors.green.shade50;
        textColor = Colors.green.shade700;
        break;
      case 'SEDANG_DIKIRIM':
        bgColor = Colors.blue.shade50;
        textColor = Colors.blue.shade700;
        break;
      case 'MENUNGGU_DIPROSES':
        bgColor = Colors.orange.shade50;
        textColor = Colors.orange.shade700;
        break;
      case 'DIBATALKAN':
        bgColor = Colors.red.shade50;
        textColor = Colors.red.shade700;
        break;
      default:
        bgColor = Colors.grey.shade100;
        textColor = Colors.grey.shade700;
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: textColor,
          fontSize: 9,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
