import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import home from '../assets/icons/home.png';
import calculate from '../assets/icons/calculate.png';
import result from '../assets/icons/result.png';
import { Home } from './screens/Home';
import { Calculator } from './screens/Calculate';
import { Result } from './screens/Results';
import { Me } from './screens/User'; // Assuming 'Me' is the Profile screen

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Image
              source={home}
              tintColor={color}
              style={{
                width: size,
                height: size,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Calculator"
        component={Calculator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={calculate}
              tintColor={color}
              style={{
                width: size,
                height: size,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Result"
        component={Result}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={result}
              tintColor={color}
              style={{
                width: size,
                height: size,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Me"
        component={Me}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../assets/icons/user.png')}
              tintColor={color}
              style={{
                width: size,
                height: size,
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeTabs;
