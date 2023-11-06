import { StyleSheet, Text, SafeAreaView, View } from 'react-native';

enum BallDanceStatus {
    ongoing,
    waiting,
    pass,
}

interface BallDance {
    name: string,
    status: BallDanceStatus
}

const DanceList = () => {
    const danceList: BallDance[] = [
        { name: "Полька", status: BallDanceStatus.pass },
        { name: "Вальс", status: BallDanceStatus.ongoing }, 
        { name: "Шалость пака", status: BallDanceStatus.waiting }];
    return <View style={styles.container}>
        <Text>All About</Text>
        {danceList.map((value) =>
            <Text>{value.name}</Text>
        )}
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});


export default DanceList;