import Flower from "~/models/flowerModel"

class FlowerRepository {
  async createFlower(flower: any) {
    return Flower.create(flower)
  }
  async getFlowerById(flowerId: string) {
    return Flower.findById(flowerId)
  }
  async getFlowers(skip: number, limit: number, query: any) {
    return Flower.find(query).skip(skip).limit(limit).populate('sellerId', 'userName')
  }
  async updateFlower(flowerId: string, flower: any) {
    return Flower.findByIdAndUpdate(flowerId, flower)
  }
}
export default new FlowerRepository()