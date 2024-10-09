import Category from "~/models/categoryModel"

class categoryRepository {
  async createCategory(categoryName: string) {
    return Category.create({ name: categoryName })
  }
  async getCategory() {
    return Category.find()
  }
}
export default new categoryRepository()