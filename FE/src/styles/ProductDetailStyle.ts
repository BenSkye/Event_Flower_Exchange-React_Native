import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const ProductDetailStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 16,
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
  infoContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
    marginHorizontal: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  price: {
    fontSize: 22,
    color: '#16a085',
    marginBottom: 10,
    fontWeight: '600',
  },
  seller: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
    color: '#555',
  },
  detailsContainer: {
    marginBottom: 20,
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
  },
  detailItem: {
    fontSize: 15,
    marginBottom: 8,
    color: '#444',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    marginHorizontal: 20,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  auctionInfo: {
    marginTop: 10,
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bde0fe',
  },
  auctionInfoText: {
    fontSize: 15,
    marginBottom: 8,
    color: '#333',
  },
  freshness: {
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
});

export default ProductDetailStyle;
