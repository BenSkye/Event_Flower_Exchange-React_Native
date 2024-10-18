import addressRepository from "~/repository/addressRepository"

class AddressService {
  static async addAddress(userId: string, address: any) {
    return addressRepository.addAddress(userId, address)
  }
  static async getAddressByUserId(userId: string) {
    return addressRepository.getAddressByUserId(userId)
  }
}
export default AddressService