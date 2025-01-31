import { Button, Text } from '@react-navigation/elements';
import { StyleSheet, View ,ImageBackground} from 'react-native';

export function Home() {
  return (
    <ImageBackground 
              source={require('../../assets/images/home.jpg')} // Adjust the path if needed
              style={styles.background}
              
            >
 <View style={styles.container}>
      <view style={styles.nav}>
      <view> <Button screen="Profile" params={{ user: 'jane' }}>
        Go to Profile
      </Button></view>
      <view> <Button screen="Registration">
        Go to Profile
      </Button></view>
      <view><Button screen="Settings">Go to Settings</Button></view>
      </view>
     
      
    </View>
            </ImageBackground>
   
  );
}

const styles = StyleSheet.create({
  container: {
    
  },
  background: {
    flex: 1,
    width:"100%",
    resizeMode: 'cover',  // Ensures the background image covers the screen
    height:'auto',
  },
  nav: {
    display:"flex",
  },
});
