import React, { useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';

function CartItem({ item, onIncrement, onDecrement, onRemove }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = (callback) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    callback();
  };

  const formatPrice = (price) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  return (
    <Animated.View style={[styles.cartItem, { transform: [{ scale: scaleAnim }] }]}>
      <Image source={{ uri: item.imagem }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>{item.nome}</Text>
        <Text style={styles.itemPrice}>{formatPrice(item.preco)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handlePress(() => onDecrement(item.id))}
          >
            <Ionicons name="remove" size={18} color="#FF6B00" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handlePress(() => onIncrement(item.id))}
          >
            <Ionicons name="add" size={18} color="#FF6B00" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => onRemove(item.id)}
      >
        <Ionicons name="skull-outline" size={24} color="#ef4444" />
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function CartScreen({ navigation }) {
  const { cartItems, removeFromCart, incrementQuantity, decrementQuantity, getTotalPrice, clearCart } = useCart();

  const formatPrice = (price) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  const handleCheckout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('🎃 Confirmar compra assombrada?')) {
        clearCart();
        window.alert('👻 Compra realizada com sucesso! Feliz Halloween!');
        navigation.goBack();
      }
    } else {
      import('react-native').then(({ Alert }) => {
        Alert.alert(
          '🎃 Confirmar Compra',
          'Deseja finalizar sua compra assombrada?',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Confirmar',
              onPress: () => {
                clearCart();
                Alert.alert('👻 Sucesso', 'Compra realizada! Feliz Halloween!');
                navigation.goBack();
              },
            },
          ]
        );
      });
    }
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>👻</Text>
        <Text style={styles.emptyTitle}>Carrinho Vazio</Text>
        <Text style={styles.emptyText}>Nenhum item assombrado ainda!</Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.shopButtonText}>🦇 Voltar às Compras</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FF6B00" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🛒 Caldeirão</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onIncrement={incrementQuantity}
            onDecrement={decrementQuantity}
            onRemove={removeFromCart}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>{formatPrice(getTotalPrice())}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutText}>🎃 Finalizar Compra</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  listContent: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#9333ea',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF6B00',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#0f3460',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#9333ea',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
    color: '#FFF',
  },
  removeButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 20,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginTop: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 8,
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: '#9333ea',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF6B00',
  },
  shopButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    backgroundColor: '#16213e',
    padding: 20,
    borderTopWidth: 2,
    borderTopColor: '#FF6B00',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    color: '#9ca3af',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  checkoutButton: {
    backgroundColor: '#9333ea',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF6B00',
  },
  checkoutText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
