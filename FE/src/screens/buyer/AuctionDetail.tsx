import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getAuctionByFlowerId } from '../../services/auction';

const AuctionDetail = ({ flowerId }: { flowerId: any }) => {

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
        <View>
            {auction && auction.bids && auction.bids.length > 0 ? (
                auction.bids.map((bid: any) => (
                    <View key={bid._id}>
                        <Text>Bidder: {bid.bidder.userName}</Text>
                        <Text>Amount: {bid.amount}</Text>
                        <Text>Time: {new Date(bid.time).toLocaleString()}</Text>
                    </View>
                ))
            ) : (
                <Text>No bids available</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({})

export default AuctionDetail;
