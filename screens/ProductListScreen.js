import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const API_URL = 'https://api.jsonbin.io/v3/b/6932198043b1c97be9d86c43';
const API_KEY = '$2a$10$tVwqK33E73jnQ2BmY7aA6.wXoOC.FSWy7qHNgeUctqk3HBNjOgXgS';

export default function ProductListScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, getTotalItems } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/latest`, {
        headers: {
          'X-Access-Key': API_KEY,
        },
      });
      setProducts(response.data.record.produtos || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      if (Platform.OS === 'web') {
        window.alert('Erro ao carregar produtos. Tente novamente.');
      } else {
        Alert.alert('Erro', 'Não foi possível carregar os produtos.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const formatPrice = (price) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <View style={styles.cardGlow} />
      <Image source={{ uri: item.imagem }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.nome}</Text>
        <Text style={styles.productPrice}>{formatPrice(item.preco)}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddToCart(item)}
        >
          <Text style={styles.addButtonText}>🎃 Adicionar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const totalItems = getTotalItems();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingEmoji}>🦇</Text>
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text style={styles.loadingText}>Invocando produtos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎃 Loja Assombrada 👻</Text>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <Ionicons name="cart" size={28} color="#FF6B00" />
          {totalItems > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerText}>🕷️ Ofertas de Arrepiar! 🕸️</Text>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProduct}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  loadingEmoji: {
    fontSize: 50,
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#16213e',
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B00',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#9333ea',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  banner: {
    backgroundColor: '#0f3460',
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#9333ea',
  },
  bannerText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 12,
  },
  row: {
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    width: '48%',
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#9333ea',
  },
  cardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#FF6B00',
  },
  productImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 6,
    height: 36,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#9333ea',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF6B00',
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
