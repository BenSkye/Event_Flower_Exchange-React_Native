import mongoose from "mongoose"
import Auction from "~/models/auctionModel"

class AuctionRepository {
  async createAuction(auction: any) {
    return await Auction.create(auction)
  }

  async getAuctions(query: any) {
    return await Auction.find(query)
  }

  async getAuctionByFlowerId(flowerId: string) {
    return await Auction.findOne({ flowerId })
  }

  async getAuctionById(id: string) {
    return await Auction.findById(id)
  }

  async updateAuction(id: string, auction: any) {
    return await Auction.findByIdAndUpdate(id, auction, { new: true })
  }

  async addBidToAuction(id: string, bid: any) {
    return await Auction.findByIdAndUpdate(id, { $push: { bids: bid } })
  }

  async getPersonalBid(userId: string) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const auctions = await Auction.aggregate([
      { $match: { 'bids.bidder': userObjectId } },
      {
        $addFields: {
          highestPersonalBid: {
            $reduce: {
              input: {
                $filter: {
                  input: '$bids',
                  as: 'bid',
                  cond: { $eq: ['$$bid.bidder', userObjectId] }
                }
              },
              initialValue: { amount: 0, time: null },
              in: {
                $cond: [
                  { $gt: ['$$this.amount', '$$value.amount'] },
                  '$$this',
                  '$$value'
                ]
              }
            }
          }
        }
      },
      { $sort: { 'endTime': -1 } },
      {
        $project: {
          _id: 0,
          auctionId: '$_id',
          flowerId: 1,
          startingPrice: 1,
          currentPrice: 1,
          startTime: 1,
          endTime: 1,
          status: 1,
          highestPersonalBid: '$highestPersonalBid.amount',
          lastPersonalBidTime: '$highestPersonalBid.time'
        }
      }
    ])
    await Auction.populate(auctions, { path: 'flowerId' });
    return auctions
  }
}

export default new AuctionRepository()