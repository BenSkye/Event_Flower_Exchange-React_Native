import CategoryService from "~/services/categoryService"
import catchAsync from "~/utils/catchAsync"

class CategoryController {
  static createCategory = catchAsync(async (req: any, res: any, next: any) => {
    const { categoryName } = req.body
    const category = await CategoryService.createCategory(categoryName)
    res.status(200).json(category)
  })
  static getCategory = catchAsync(async (req: any, res: any, next: any) => {
    const category = await CategoryService.getCategory()
    res.status(200).json(category)
  })
}
export default CategoryController