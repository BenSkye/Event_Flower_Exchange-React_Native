import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import addressData from '../constant/vietnamAddress.json'; // JSON dữ liệu địa chỉ

const AddressPicker = ({ route, navigation }: { route: any, navigation: any }) => {
    const { onSelect } = route.params;
    const [listData, setListData] = useState(addressData);
    const [filteredData, setFilteredData] = useState(addressData);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [currentStep, setCurrentStep] = useState(1);

    const handleSelectCity = (city: any) => {
        setSelectedCity(city.Name);
        setListData(city.Districts);
        setFilteredData(city.Districts);
        setCurrentStep(2);
        setSearchQuery('');
    };

    const handleSelectDistrict = (district: any) => {
        setSelectedDistrict(district.Name);
        setListData(district.Wards);
        setFilteredData(district.Wards);
        setCurrentStep(3);
        setSearchQuery('');
    };

    const handleSelectWard = (ward: any) => {
        setSelectedWard(ward.Name);
        onSelect(`${selectedCity}, ${selectedDistrict}, ${ward.Name}`);
        navigation.goBack();
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query) {
            const filtered = listData.filter((item: any) =>
                item.Name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredData(filtered);
        } else {
            setFilteredData(listData);
        }
    };

    const renderListItem = (item: any) => {
        return (
            <TouchableOpacity style={styles.itemContainer} onPress={() => {
                if (currentStep === 1) handleSelectCity(item);
                else if (currentStep === 2) handleSelectDistrict(item);
                else if (currentStep === 3) handleSelectWard(item);
            }}>
                <Text style={styles.item}>{item.Name}</Text>
                <Icon name="right" size={20} color="#000" />
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.selectedText}>
                {selectedCity && <Text>{selectedCity}{"\n"}</Text>}
                {selectedDistrict && <Text>{selectedDistrict}{"\n"}</Text>}
                {selectedWard && <Text>{selectedWard}</Text>}
            </Text>
            <TextInput
                style={styles.searchBar}
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChangeText={handleSearch}
            />
            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.Id.toString()}
                renderItem={({ item }) => renderListItem(item)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
        height: '100%',
    },
    selectedText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    searchBar: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 16,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    item: {
        fontSize: 16,
    },
});

export default AddressPicker;