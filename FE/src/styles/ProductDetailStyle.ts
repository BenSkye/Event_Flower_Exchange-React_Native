import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const ProductDetailStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  carouselContainer: {
    height: 300,
  },
  carouselImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 0,
    paddingVertical: 10,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  infoContainer: {
    padding: 20,
  },
  name: {
    fontSize: 18,
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    color: '#16a085',
    marginBottom: 10,
  },
  seller: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailItem: {
    fontSize: 14,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  freshness: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    position: 'absolute',
    top: 50,
    right: 5,
  },
  fresh: {
    backgroundColor: '#e8f5e9',
    color: '#4caf50',
    borderRadius: 12,
  },
  slightly_wilted: {
    backgroundColor: '#fff3e0',
    color: '#ff9800',
    borderRadius: 12,
  },
  wilted: {
    backgroundColor: '#ffebee',
    color: '#f44336',
    borderRadius: 12,
  },
  expired: {
    backgroundColor: '#efebe9',
    color: '#795548',
    borderRadius: 12,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 10,
    padding: 5,
    paddingTop: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
  },
  backButtonText: {
    marginTop: -5,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ProductDetailStyle;
