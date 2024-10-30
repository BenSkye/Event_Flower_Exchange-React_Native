import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Image, RefreshControl, TouchableOpacity } from 'react-native';
import { Card, Text, Button, Chip, Divider, IconButton, Menu, Portal, Dialog, SegmentedButtons } from 'react-native-paper';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { getFlowerBySellerId, deleteFlower, updateFlowerById } from '../../services/flower';
import { AUCTION_STATUS_COLORS, AUCTION_STATUS_LABELS } from '../../constant/indext';
import PostProductStyle from '../../styles/PostProductStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Product {
  _id: string;
  name: string;
  description: string;
  images: string[];
  saleType: string;
  status: string;
  freshness: string;
  createdAt: string;
}

const ManageProductScreen = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState<string | null>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saleTypeFilter, setSaleTypeFilter] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await getFlowerBySellerId();
      console.log('response ManageProductScreen', response)
      setProducts(response);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const handleEdit = (product: Product) => {
    setMenuVisible(null);
    navigation.navigate('EditProduct', { productId: product._id });
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setDeleteDialogVisible(true);
    setMenuVisible(null);
  };

  const confirmDelete = async () => {
    if (selectedProduct) {
      try {
        setIsLoading(true);
        await deleteFlower(selectedProduct._id);
        await fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      } finally {
        setIsLoading(false);
      }
    }
    setDeleteDialogVisible(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_auction':
        return AUCTION_STATUS_COLORS.in_auction;
      case 'sold':
        return AUCTION_STATUS_COLORS.sold;
      case 'auction':
        return 'Đấu giá';
      case 'available':
        return AUCTION_STATUS_COLORS.available;
      case 'unavailable':
        return AUCTION_STATUS_COLORS.unavailable;
      case 'ended':
        return AUCTION_STATUS_COLORS.ended;
      case 'pending':
        return AUCTION_STATUS_COLORS.pending;
      case 'active':
        return AUCTION_STATUS_COLORS.active;
      // case 'cancelled':
      //   return 'Đã hủy';
      default:
        return status;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_auction':
        return AUCTION_STATUS_LABELS.in_auction;
      case 'sold':
        return AUCTION_STATUS_LABELS.sold;
      case 'auction':
        return AUCTION_STATUS_LABELS.auction;
      case 'available':
        return AUCTION_STATUS_LABELS.available;
      case 'unavailable':
        return AUCTION_STATUS_LABELS.unavailable;
      case 'ended':
        return AUCTION_STATUS_LABELS.ended;
      case 'pending':
        return AUCTION_STATUS_LABELS.pending;
      case 'active':
        return AUCTION_STATUS_LABELS.active;
      default:
        return status;
    }
  };

  const getSaleTypeText = (saleType: string) => {
    switch (saleType) {
      case 'fixed_price':
        return 'Giá cố định';
      case 'auction':
        return 'Đấu giá';
      default:
        return saleType;
    }
  };

  const filteredProducts = products.filter(product => {
    if (saleTypeFilter === 'all') return true;
    return product.saleType === saleTypeFilter;
  });

  const renderProductItem = ({ item }: { item: Product }) => (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Image source={{ uri: item.images[0] }} style={styles.image} />
        <View style={styles.productInfo}>
          <Text variant="titleMedium" style={styles.title}>{item.name}</Text>
          <Text variant="bodyMedium" numberOfLines={2} style={styles.description}>
            {item.description}
          </Text>
          <View style={styles.chipContainer}>
            <Chip
              icon="tag"
              style={[styles.chip, { backgroundColor: getStatusColor(item.status) }]}
              textStyle={{ color: 'white' }}
            >
              {getStatusText(item.status)}
            </Chip>
            <Chip icon="store" style={styles.chip}>
              {getSaleTypeText(item.saleType)}
            </Chip>
            <Chip icon="clock" style={styles.chip}>
              {format(new Date(item.createdAt), 'dd/MM/yyyy')}
            </Chip>
          </View>
        </View>
        <Menu
          visible={menuVisible === item._id}
          onDismiss={() => setMenuVisible(null)}
          anchor={
            <IconButton
              icon="dots-vertical"
              onPress={() => setMenuVisible(item._id)}
            />
          }
        >
          {item.saleType === 'fixed_price' && item.status === 'available' && (
            <Menu.Item onPress={() => handleEdit(item)} title="Chỉnh sửa" />
          )}
          <Menu.Item onPress={() => handleDelete(item)} title="Xóa" />

        </Menu>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <Text variant="headlineMedium">Quản lý sản phẩm</Text> */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={PostProductStyle.backButton}>
            <Ionicons name="arrow-back" size={24} color="#5a61c9" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Quản lý bài đăng </Text>
        </View>

      </View>
      <Button
        mode="contained"
        icon="plus"
        onPress={() => navigation.navigate('SellProduct')}
        style={styles.addButton}
        loading={isLoading}
        disabled={isLoading}
      >
        Đăng bài bán
      </Button>
      <SegmentedButtons
        value={saleTypeFilter}
        onValueChange={setSaleTypeFilter}
        buttons={[
          {
            value: 'all',
            label: `Tất cả (${products.length})`
          },
          {
            value: 'fixed_price',
            label: `Giá cố định (${products.filter(p => p.saleType === 'fixed_price').length})`
          },
          {
            value: 'auction',
            label: `Đấu giá (${products.filter(p => p.saleType === 'auction').length})`
          },
        ]}
        style={styles.segmentedButtons}
      />

      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={item => item._id}
        ItemSeparatorComponent={() => <Divider />}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Xác nhận xóa</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Bạn có chắc chắn muốn xóa sản phẩm "{selectedProduct?.name}"?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)} disabled={isLoading}>Hủy</Button>
            <Button onPress={confirmDelete} loading={isLoading} disabled={isLoading}>Xóa</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    // padding: 16,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // elevation: 2,
  },
  addButton: {
    margin: 16,
    width: '40%',
    alignSelf: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  listContainer: {
    padding: 8,
  },
  card: {
    marginVertical: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    color: '#666',
  },
  chipContainer: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 8,
    marginBottom: 4,
  },
  segmentedButtons: {
    margin: 16,
  },
});

export default ManageProductScreen;