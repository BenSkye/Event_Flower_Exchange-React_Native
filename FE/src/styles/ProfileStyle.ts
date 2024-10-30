import { StyleSheet } from 'react-native';

const ProfileStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    marginBottom: 60,
  },
  headerSection: {
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  profilePicture: {
    width: 150,
    height: 120,
    borderRadius: 60,
    borderColor: "#fff",
  },
  userName: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
  },
  actionButtons: {
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    elevation: 1, // Giảm độ đổ bóng
  },
  oginButton: {
    backgroundColor: '#66BB6A', // Màu xanh nhạt hơn
  },
  registerButton: {
    backgroundColor: '#fff',
    borderWidth: 0.8, // Giảm độ dày viền
    borderColor: '#66BB6A',
  },
  actionButtonText: {
    fontSize: 15, // Giảm kích thước chữ
    fontWeight: '500', // Giảm độ đậm của chữ
    marginLeft: 8,
  },
  loginButton: {
    backgroundColor: '#66BB6A', // Màu xanh nhạt hơn
  },
  loginButtonText: {
    color: '#fff',
  },
  registerButtonText: {
    color: '#66BB6A',
  },
  buttonIcon: {
    marginRight: 6,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#4CAF50",
    marginBottom: 8,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    elevation: 1,
    marginBottom: 12,
  },
  sectionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  sectionText: {
    fontSize: 16,
    color: "#000",
    marginLeft: 16,
    flex: 1,
  },
  editIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    // backgroundColor: '#5a61c9',
    borderRadius: 15,
    padding: 5,
  },

});

export default ProfileStyle;
