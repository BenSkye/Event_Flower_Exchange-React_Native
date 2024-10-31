import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, RefreshControl } from 'react-native';
import { Card, Divider, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getAuctionByFlowerId } from '../../services/auction';
import { format } from 'date-fns-tz';
import { formatPrice } from '../../utils';

interface Bid {
    _id: string;
    bidder: {
        userName: string;
    };
    amount: number;
    time: string;
}

interface Auction {
    startTime: string;
    endTime: string;
    bids: Bid[];
}

const AuctionDetail = ({ flowerId }: { flowerId: string }) => {
    const [auction, setAuction] = useState<Auction | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAuction = async () => {
        try {
            setError(null);
            const data = await getAuctionByFlowerId(flowerId);
            setAuction(data);
        } catch (error) {
            console.error('Error fetching auction:', error);
            setError('Không thể tải thông tin đấu giá. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuction();
    }, [flowerId]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchAuction();
        setRefreshing(false);
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#2e7d32" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                style={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#2e7d32']}
                    />
                }
            >
                <Card style={styles.auctionInfoCard}>
                    <Card.Title
                        title="Thông tin đấu giá"
                        titleStyle={styles.cardTitle}
                        left={(props) => <Icon name="gavel" size={24} color="#2e7d32" {...props} />}
                    />
                    <Card.Content>
                        <View style={styles.infoRow}>
                            <Icon name="clock-start" size={20} color="#666" />
                            <Text style={styles.infoText}>
                                Bắt đầu: {auction?.startTime
                                    ? format(new Date(auction.startTime), 'dd/MM/yyyy HH:mm:ss', { timeZone: 'UTC' })
                                    : 'N/A'}
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Icon name="clock-end" size={20} color="#666" />
                            <Text style={styles.infoText}>
                                Kết thúc: {auction?.endTime
                                    ? format(new Date(auction.endTime), 'dd/MM/yyyy HH:mm:ss', { timeZone: 'UTC' })
                                    : 'N/A'}
                            </Text>
                        </View>
                    </Card.Content>
                </Card>

                <Card style={styles.bidsCard}>
                    <Card.Title
                        title="Lịch sử đấu giá"
                        titleStyle={styles.cardTitle}
                        left={(props) => <Icon name="history" size={24} color="#2e7d32" {...props} />}
                    />
                    <Card.Content>
                        {auction && auction.bids && auction.bids.length > 0 ? (
                            auction.bids.slice().reverse().map((bid: Bid, index: number) => (
                                <View key={bid._id}>
                                    <View style={styles.bidContainer}>
                                        <View style={styles.bidHeader}>
                                            <Icon name="account" size={20} color="#666" />
                                            <Text style={styles.bidderText}>{bid.bidder.userName}</Text>
                                            {index === 0 && (
                                                <View style={styles.highestBidBadge}>
                                                    <Text style={styles.highestBidText}>Cao nhất</Text>
                                                </View>
                                            )}
                                        </View>
                                        <View style={styles.bidDetails}>
                                            <Text style={styles.amountText}>{formatPrice(bid.amount)}</Text>
                                            <Text style={styles.timeText}>
                                                {format(new Date(bid.time), 'dd/MM/yyyy HH:mm:ss')}
                                            </Text>
                                        </View>
                                    </View>
                                    {index < auction.bids.length - 1 && <Divider style={styles.divider} />}
                                </View>
                            ))
                        ) : (
                            <View style={styles.noBidsContainer}>
                                <Icon name="alert-circle-outline" size={40} color="#666" />
                                <Text style={styles.noBidsText}>Chưa có lượt đấu giá nào</Text>
                            </View>
                        )}
                    </Card.Content>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
        padding: 10,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    errorText: {
        color: '#d32f2f',
        textAlign: 'center',
        fontSize: 16,
        padding: 20,
    },
    auctionInfoCard: {
        marginBottom: 15,
        elevation: 2,
        borderRadius: 8,
    },
    bidsCard: {
        elevation: 2,
        borderRadius: 8,
        marginBottom: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    infoText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    bidContainer: {
        padding: 10,
    },
    bidHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    bidderText: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        flex: 1,
    },
    bidDetails: {
        marginLeft: 30,
    },
    amountText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2e7d32',
        marginBottom: 5,
    },
    timeText: {
        fontSize: 14,
        color: '#666',
    },
    divider: {
        marginVertical: 10,
    },
    noBidsContainer: {
        alignItems: 'center',
        padding: 20,
    },
    noBidsText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        fontStyle: 'italic',
        marginTop: 10,
    },
    highestBidBadge: {
        backgroundColor: '#2e7d32',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 10,
    },
    highestBidText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default AuctionDetail;