
import AddressService from "~/services/addressService"
import catchAsync from "~/utils/catchAsync"

class AddressController {
  static addAddress = catchAsync(async (req: any, res: any, next: any) => {
    const updateAddress = await AddressService.addAddress(req.user.id, req.body)
    res.status(200).json(updateAddress)
  })
  static getAddressByUserId = catchAsync(async (req: any, res: any, next: any) => {
    const address = await AddressService.getAddressByUserId(req.user.id)
    console.log('address', address)
    res.status(200).json(address)
  })
}
export default AddressController