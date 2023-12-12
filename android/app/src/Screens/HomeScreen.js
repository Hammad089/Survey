import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Box, Menu, NativeBaseProvider, Pressable } from "native-base";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
export default function HomeScreen({navigation}) {
    const config = {
        dependencies: {
            'linear-gradient': LinearGradient
        }
    };
    return (
        <View style={style.container}>
            <View style={style.subContainer}>
                <NativeBaseProvider>
                    <Box flex={1} bg="#fff">

                        <Menu w="190" justifyContent='space-between' alignItems='center' trigger={triggerProps => {
                            return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                                <MaterialIcons name='menu' size={25} color='#666' style={style.MenuIcon} />
                            </Pressable>;
                        }}>
                            <Menu.Item onPress={()=>navigation.navigate('Dashboard')}>Dashboard</Menu.Item>
                            <Menu.Item onPress={()=> navigation.navigate('Survey')}>Survey</Menu.Item>
                            <Menu.Item onPress={()=>navigation.navigate('Draft')}>Draft Data</Menu.Item>
                            <Menu.Item>Published Data</Menu.Item>
                            <Menu.Item onPress={()=> navigation.navigate('Profile')}>Profile</Menu.Item>
                            <Menu.Item onPress={()=> navigation.navigate('Setting')}>Settings</Menu.Item>
                        </Menu>
                    </Box>
                </NativeBaseProvider>
            </View>
            <NativeBaseProvider>
                <Box position='relative' left={265} bottom={50} >
                    <Menu w="190" justifyContent='space-between' trigger={triggerProps => {
                        return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                            <Image source={require('../Assests/avatar.jpg')} style={style.ImageAvatar} />
                        </Pressable>;
                    }}>
                        <Menu.Item onPress={() => navigation.navigate('Profile')}>Profile</Menu.Item>
                        <Menu.Item onPress={() => navigation.navigate('Setting')}>Settings</Menu.Item>
                        <Menu.Item>My Account</Menu.Item>

                    </Menu>
                </Box>
                <NativeBaseProvider config={config}>
                    <TouchableOpacity onPress={() => navigation.navigate('DataCards')}>
                        <View style={{marginBottom:20}}>
                            <Box
                                bg={{
                                    linearGradient: {
                                        colors: ['lightBlue.300', 'violet.800'],
                                        start: [0, 0],
                                        end: [1, 0]
                                    }
                                }}
                                p="12"
                                rounded="xl"
                                _text={{
                                    fontSize: 'md',
                                    fontWeight: 'medium',
                                    color: 'warmGray.50',
                                    textAlign: 'center'
                                }}
                            >
                                <Text style={{ textAlign: 'center', color: 'white', fontSize: 25 }}>Survey 1
                                    <FeatherIcon name='chevron-right' size={20} />
                                </Text>
                            </Box>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('shopdetail')}>
                        <View>
                            <Box
                                bg={{
                                    linearGradient: {
                                        colors: ['lightBlue.300', 'violet.800'],
                                        start: [0, 0],
                                        end: [1, 0]
                                    }
                                }}
                                p="12"
                                rounded="xl"
                                _text={{
                                    fontSize: 'md',
                                    fontWeight: 'medium',
                                    color: 'warmGray.50',
                                    textAlign: 'center'
                                }}
                            >
                                <Text style={{ textAlign: 'center', color: 'white', fontSize: 25 }}>Survey2
                                    <FeatherIcon name='chevron-right' size={20} />
                                </Text>
                            </Box>
                        </View>
                    </TouchableOpacity>
                </NativeBaseProvider>
            </NativeBaseProvider>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,

    },
    subContainer: {
        backgroundColor: 'white',
        marginTop: 45,
        padding: 20,
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 10,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    ImageAvatar: {
        height: 40,
        width: 40,
        borderRadius: 5,
    },
    MenuIcon: {
        position: 'relative',
        bottom: 2
    },
});