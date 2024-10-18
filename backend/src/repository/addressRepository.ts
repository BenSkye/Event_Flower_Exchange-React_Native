import Address from "~/models/addressModel";


class AddressRepository {
  async createAddress(address: any) {
    return Address.create(address)
  }

  async addAddress(userId: string, address: any) {
    return Address.findOneAndUpdate({ userId }, { $push: { information: address } }, { new: true })
  }

  async getAddressByUserId(userId: string) {
    return Address.findOne({ userId })
  }

}

export default new AddressRepository()