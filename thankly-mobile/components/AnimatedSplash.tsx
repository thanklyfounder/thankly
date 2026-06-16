import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";

type Props = {
  onFinish: () => void;
};

const stars = [
  { top: "9%", left: "18%" },
  { top: "12%", left: "44%" },
  { top: "15%", left: "78%" },
  { top: "22%", left: "26%" },
  { top: "25%", left: "64%" },
  { top: "31%", left: "12%" },
  { top: "36%", left: "84%" },
  { top: "43%", left: "22%" },
  { top: "48%", left: "72%" },
  { top: "53%", left: "38%" },
  { top: "58%", left: "88%" },
  { top: "64%", left: "16%" },
  { top: "69%", left: "55%" },
  { top: "74%", left: "80%" },
  { top: "81%", left: "30%" },
  { top: "86%", left: "66%" },
  { top: "90%", left: "46%" },
  { top: "94%", left: "22%" },
  { top: "18%", left: "6%" },
  { top: "7%", left: "70%" },
];

export default function AnimatedSplash({ onFinish }: Props) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.92)).current;

  const glowOpacity = useRef(new Animated.Value(0.12)).current;
  const glowScale = useRef(new Animated.Value(0.75)).current;

  const starAnimations = stars.map(
    () => useRef(new Animated.Value(Math.random() * 0.7 + 0.25)).current
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 70,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(glowOpacity, {
            toValue: 0.32,
            duration: 550,
            useNativeDriver: true,
          }),
          Animated.timing(glowScale, {
            toValue: 1.25,
            duration: 550,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(glowOpacity, {
            toValue: 0.08,
            duration: 550,
            useNativeDriver: true,
          }),
          Animated.timing(glowScale, {
            toValue: 0.8,
            duration: 550,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    starAnimations.forEach((star, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 55),
          Animated.timing(star, {
            toValue: 1,
            duration: 450,
            useNativeDriver: true,
          }),
          Animated.timing(star, {
            toValue: 0.15,
            duration: 450,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    const timer = setTimeout(() => {
      Animated.timing(logoOpacity, {
        toValue: 0,
        duration: 650,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {stars.map((star, index) => (
        <Animated.View
          key={index}
          style={[
            styles.star,
            {
              top: star.top,
              left: star.left,
              opacity: starAnimations[index],
            },
          ]}
        />
      ))}

      <Animated.View
        style={[
          styles.glowOuter,
          {
            opacity: glowOpacity,
            transform: [{ scale: glowScale }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.glowInner,
          {
            opacity: glowOpacity,
            transform: [{ scale: glowScale }],
          },
        ]}
      />

      <Animated.Image
        source={require("../assets/splash/thankly-splash.png")}
        style={[
          styles.logo,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B3D91",
    alignItems: "center",
    justifyContent: "center",
  },

  scene: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  glowOuter: {
    position: "absolute",
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: "rgba(56,189,248,0.05)",
  },

  glowInner: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(125,211,252,0.07)",
  },

  logo: {
    width: 240,
    height: 240,
  },

  star: {
    position: "absolute",
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
    shadowColor: "#FFFFFF",
    shadowOpacity: 0.9,
    shadowRadius: 4,
  },
});
