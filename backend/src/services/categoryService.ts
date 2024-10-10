import categoryRepository from '../repository/categoryRepository'

class CategoryService {
  static async createCategory(categoryName: string) {
    return categoryRepository.createCategory(categoryName);
  }
  static async getCategory() {
    return categoryRepository.getCategory()
  }
}
export default CategoryService