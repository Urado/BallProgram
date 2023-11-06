import { useEffect, useState } from 'react';
import { StyleSheet, Text, SafeAreaView, View } from 'react-native';
import { requestGet } from '../services';


interface BallPlaylist {
    dances: BallDance[],
}

interface BallDance {
    name: string,
}

const DanceList = () => {
    const [ballPlaylist, setBallPlaylist] = useState<BallPlaylist>();
    useEffect(() => {
        const id = "81454b3e-c0b5-4d4b-bf0a-cc052e47f9d2";
        requestGet(`/BallPlaylist/${id}`).then((value) => {
            console.log(value);
            setBallPlaylist(value);});
    }, [])

    const danceList: BallDance[] = ballPlaylist?.dances ?? [
        { name: "Полька" },
        { name: "Вальс" }, 
        { name: "Шалость пака" }];

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