import { Link, Stack } from "expo-router";
import { View } from "react-native";

export default function NotFoundScreen() {
    return(
        <>
            <Stack.Screen options={{ title: 'Oops! Not found.' }} />
            <View>
                <Link href="/App">Go Home!</Link>
            </View>
        </>
    );
}