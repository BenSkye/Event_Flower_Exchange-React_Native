import FlowerService from "~/services/flowerService"
import catchAsync from "~/utils/catchAsync"

class FlowerController {
  static createFlower = catchAsync(async (req: any, res: any, next: any) => {
    const createdFlower = await FlowerService.createFlower(req.user.id, req.body)
    res.status(200).json(createdFlower)
  })
  static getListFlower = catchAsync(async (req: any, res: any, next: any) => {
    const { page, limit, search } = req.query
    const flowers = await FlowerService.getListFlower(page, limit, search)
    res.status(200).json(flowers)
  })
  static getFlowerById = catchAsync(async (req: any, res: any, next: any) => {
    const flower = await FlowerService.getFlowerById(req.params.flowerId)
    res.status(200).json(flower)
  })
  static updateFlower = catchAsync(async (req: any, res: any, next: any) => {
    const flower = await FlowerService.updateFlower(req.params.flowerId, req.body)
    res.status(200).json(flower)
  })
}
export default FlowerController