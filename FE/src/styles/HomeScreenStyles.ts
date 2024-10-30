import { StyleSheet, Dimensions } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    padding: 16,
    paddingTop: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
},

title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
},

searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Màu trong suốt hơn
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)', // Viền mỏng để tạo độ nổi
},

searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#FFF', // Màu chữ trắng để dễ đọc
    //    : 'rgba(255, 255, 255, 0.7)', // Màu placeholder nhẹ nhàng hơn
},
  endMessage: {
    textAlign: 'center',
    padding: 10,
    color: '#666',
  },
  loadingText: {
        marginTop: 12,
        color: '#666',
        fontSize: 16,
    },
});