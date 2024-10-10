import { StyleSheet } from 'react-native';

const ProfileStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  headerSection: {
    alignItems: "center",
    backgroundColor: "#5a61c9",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#fff",
  },
  userName: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    marginBottom: 8,
  },
  actionButton: {
    backgroundColor: "#03DAC6",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    elevation: 2,
  },
  actionButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#5a61c9",
    marginBottom: 8,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    elevation: 1,
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
});

export default ProfileStyle;
