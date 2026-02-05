import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ListProdukPage extends StatefulWidget {
  const ListProdukPage({super.key});

  @override
  State<ListProdukPage> createState() => _ListProdukPageState();
}

class _ListProdukPageState extends State<ListProdukPage> {
  final String _baseUrl = 'http://172.20.10.3:3000';
  final currencyFormat = NumberFormat.currency(
    locale: 'id_ID',
    symbol: 'Rp ',
    decimalDigits: 0,
  );

  // State untuk Pencarian dan Filter
  List<dynamic> allProducts = [];
  List<dynamic> filteredProducts = [];
  List<String> categories = ["Semua"];
  String selectedCategory = "Semua";
  TextEditingController searchController = TextEditingController();
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  // Fungsi helper konversi tipe data
  num _parseNumber(dynamic value) {
    if (value is num) return value;
    if (value is String) return num.tryParse(value) ?? 0;
    return 0;
  }

  Future<void> _loadData() async {
    setState(() => isLoading = true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      final response = await http.get(
        Uri.parse('$_baseUrl/products'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        setState(() {
          allProducts = data;
          filteredProducts = data;

          // Ambil kategori unik dari API
          final uniqueCats = data
              .map((item) => item['kategori']?.toString() ?? "Umum")
              .toSet()
              .toList();
          categories = ["Semua", ...uniqueCats];
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() => isLoading = false);
      debugPrint("Error: $e");
    }
  }

  // LOGIKA SEARCH & FILTER
  void _filterProducts(String query) {
    setState(() {
      filteredProducts = allProducts.where((produk) {
        final nama = (produk['nama'] ?? "").toString().toLowerCase();
        final kategori = (produk['kategori'] ?? "Umum").toString();

        final matchesSearch = nama.contains(query.toLowerCase());
        final matchesCategory =
            selectedCategory == "Semua" || kategori == selectedCategory;

        return matchesSearch && matchesCategory;
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      appBar: AppBar(
        title: const Text(
          "Katalog Barang",
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

          // 2. Horizontal Category Filter
          _buildCategoryFilter(),

          // 3. List Produk
          Expanded(
            child: isLoading
                ? const Center(child: CircularProgressIndicator())
                : filteredProducts.isEmpty
                ? _buildEmptyState()
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: filteredProducts.length,
                    itemBuilder: (context, index) =>
                        _buildProductCard(filteredProducts[index]),
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
        controller: searchController,
        onChanged: _filterProducts,
        decoration: InputDecoration(
          hintText: "Cari nama produk...",
          prefixIcon: const Icon(Icons.search),
          filled: true,
          fillColor: const Color(0xFFF3F4F6),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide.none,
          ),
        ),
      ),
    );
  }

  Widget _buildCategoryFilter() {
    return Container(
      height: 60,
      color: Colors.white,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 12),
        itemCount: categories.length,
        itemBuilder: (context, index) {
          final cat = categories[index];
          final isSelected = selectedCategory == cat;
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 10),
            child: ChoiceChip(
              label: Text(cat),
              selected: isSelected,
              onSelected: (selected) {
                setState(() {
                  selectedCategory = cat;
                  _filterProducts(searchController.text);
                });
              },
              selectedColor: const Color(0xFF2563EB),
              labelStyle: TextStyle(
                color: isSelected ? Colors.white : Colors.black,
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildProductCard(Map<String, dynamic> produk) {
    final harga = _parseNumber(produk['harga']);
    final stok = _parseNumber(produk['stok']);

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 0,
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: const Color(0xFFEFF6FF),
            borderRadius: BorderRadius.circular(12),
          ),
          child: const Icon(
            Icons.inventory_2_outlined,
            color: Color(0xFF3B82F6),
          ),
        ),
        title: Text(
          produk['nama'] ?? "-",
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              produk['kategori'] ?? "Umum",
              style: const TextStyle(fontSize: 12, color: Colors.grey),
            ),
            const SizedBox(height: 8),
            Text(
              currencyFormat.format(harga),
              style: const TextStyle(
                color: Color(0xFF1E3A8A),
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        trailing: Text(
          "Stok: $stok",
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: stok < 5 ? Colors.red : Colors.green,
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.search_off, size: 64, color: Colors.grey),
          const SizedBox(height: 16),
          Text("Produk '${searchController.text}' tidak ditemukan."),
        ],
      ),
    );
  }
}
