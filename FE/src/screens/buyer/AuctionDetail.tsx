import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getAuctionByFlowerId } from '../../services/auction';
import { styles } from '../../styles/AuctionDetailStyles';
import { format } from 'date-fns-tz';
import { formatPrice } from '../../utils';

const AuctionDetail = ({ flowerId }: { flowerId: any }) => {
    console.log('flowerId', flowerId);
    const [auction, setAuction] = useState<any>(null);
    useEffect(() => {
        const fetchAuction = async () => {
            try {
                const data = await getAuctionByFlowerId(flowerId);
                console.log('data', data);
                setAuction(data);
            } catch (error) {
                console.error('Error fetching auction:', error);
            }
        };
        fetchAuction();
    }, [flowerId]);

    return (
        <View style={styles.container}>
            <View>
                <Text>Thông tin đấu giá</Text>
                <Text>Bắt đầu : {auction?.startTime ? format(new Date(auction.startTime), 'yyyy-MM-dd HH:mm:ss', { timeZone: 'UTC' }) : 'N/A'}</Text>
                <Text>Kết thúc : {auction?.endTime ? format(new Date(auction.endTime), 'yyyy-MM-dd HH:mm:ss', { timeZone: 'UTC' }) : 'N/A'}</Text>
            </View>
            {auction && auction.bids && auction.bids.length > 0 ? (
                auction.bids.slice().reverse().map((bid: any) => (
                    <View key={bid._id} style={styles.bidContainer}>
                        <Text style={styles.bidderText}>Người đấu giá: {bid.bidder.userName}</Text>
                        <Text style={styles.amountText}>Số tiền: {formatPrice(bid.amount)}</Text>
                        <Text style={styles.timeText}>Thời gian đấu giá: {new Date(bid.time).toLocaleString()}</Text>
                    </View>
                ))
            ) : (
                <Text>Không có đấu giá nào</Text>
            )}
        </View>
    );
}

export default AuctionDetail;
