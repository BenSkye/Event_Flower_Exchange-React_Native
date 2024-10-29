import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundLinearGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 60, // Thêm dòng này để bo tròn logo
  },
  slogan: {
    fontSize: 18,
    color: '#FFFFFF', // Đổi màu chữ slogan thành trắng để tương phản với nền
    textAlign: 'center',
    marginBottom: 30,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Tăng độ đục của nền input
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#bfc9ca', // Black color for login button
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#FFFFFF', // Đảm bảo màu chữ là trắng
    fontSize: 14,
  },
  footerLink: {
    color: '#FFFFFF', // Đảm bảo màu chữ là trắng
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
    textDecorationLine: 'underline',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: 20,
  },
  backButtonText: {
    fontSize: 24,
    color: '#006400',
  },
});
