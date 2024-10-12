// userController.ts
import UserService from '~/services/userService'
import AppError from '~/utils/appError'
import catchAsync from '~/utils/catchAsync'

class UserController {
  static getPersonal = catchAsync(async (req: any, res: any, next: any) => {
    const userId = req.user.id
    const personal = await UserService.getUserById(userId)
    if (!personal) {
      throw new AppError('khong tim thay user', 401)
    }
    res.status(200).json({
      status: 'success',
      data: {
        personal
      }
    })
  })
  static updateUser = catchAsync(async (req: any, res: any, next: any) => {
    const userId = req.user.id
    const { userName, avatar, userPhone, userAddress } = req.body

    const { newuser } = await UserService.updateUser(userId, { userName, avatar, userPhone, userAddress })

    res.status(201).json({
      status: 'success',
      data: {
        user: newuser
        // token: token,
      }
    })
  })
  static updatePhone = catchAsync(async (req: any, res: any, next: any) => {
    const userId = req.user.id
    const { phone } = req.body
    const { newuser } = await UserService.updatePhone(userId, phone)
    res.status(201).json({
      status: 'success',
      data: {
        user: newuser
      }
    })
  })
  static getAllUser = catchAsync(async (req: any, res: any, next: any) => {
    try {
      const users = await UserService.getAllUser()
      res.status(200).json(users)
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error })
    }
  })
  static checkEmailExist = catchAsync(async (req: any, res: any, next: any) => {
    const { email } = req.body
    console.log('email', email)
    const user = await UserService.getUserByEmail(email)
    if (user) {
      res.status(201).json({
        status: 'success',
        data: {
          user
        }
      })
    } else {
      res.status(201).json({
        status: 'success',
        data: {
          user: null
        }
      })
    }
  })
  static checkPhoneExist = catchAsync(async (req: any, res: any, next: any) => {
    const userId = req.user.id
    const result = await UserService.checkPhoneExist(userId)
    res.status(200).json({
      status: 'success',
      data: {
        result
      }
    })
  })
  static updatePushToken = catchAsync(async (req: any, res: any, next: any) => {
    const userId = req.user.id
    const { pushToken } = req.body
    await UserService.updatePushToken(userId, pushToken)
  })
}

export default UserController
