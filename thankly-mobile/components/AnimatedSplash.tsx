import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

type Props = {
  onFinish: () => void;
};

const stars = [
  { top: "9%", left: "18%", size: 3 },
  { top: "12%", left: "44%", size: 2 },
  { top: "15%", left: "78%", size: 4 },
  { top: "22%", left: "26%", size: 2 },
  { top: "25%", left: "64%", size: 3 },
  { top: "31%", left: "12%", size: 4 },
  { top: "36%", left: "84%", size: 2 },
  { top: "43%", left: "22%", size: 3 },
  { top: "48%", left: "72%", size: 4 },
  { top: "53%", left: "38%", size: 2 },
  { top: "58%", left: "88%", size: 3 },
  { top: "64%", left: "16%", size: 4 },
  { top: "69%", left: "55%", size: 2 },
  { top: "74%", left: "80%", size: 3 },
  { top: "81%", left: "30%", size: 4 },
  { top: "86%", left: "66%", size: 2 },
  { top: "90%", left: "46%", size: 3 },
  { top: "94%", left: "22%", size: 2 },
  { top: "18%", left: "6%", size: 4 },
  { top: "7%", left: "70%", size: 3 },
];

export default function AnimatedSplash({ onFinish }: Props) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;

  // Sustained corona — sits behind logo at full intensity
  const coronaOpacity = useRef(new Animated.Value(0)).current;
  const coronaScale = useRef(new Animated.Value(0.6)).current;

  // Outer corona ring
  const coronaOuterOpacity = useRef(new Animated.Value(0)).current;
  const coronaOuterScale = useRef(new Animated.Value(0.5)).current;

  // Pulse ring — fires once on logo arrival, expands and fades
  const pulseOpacity = useRef(new Animated.Value(0)).current;
  const pulseScale = useRef(new Animated.Value(0.4)).current;

  // Second pulse ring — slight delay for depth
  const pulse2Opacity = useRef(new Animated.Value(0)).current;
  const pulse2Scale = useRef(new Animated.Value(0.4)).current;

  const starAnimations = stars.map(
    () => useRef(new Animated.Value(0)).current
  );

  useEffect(() => {
    // 1 — Corona blooms in as logo arrives
    Animated.parallel([
      Animated.timing(coronaOpacity, {
        toValue: 0.55,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(coronaScale, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(coronaOuterOpacity, {
        toValue: 0.25,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(coronaOuterScale, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();

    // 2 — Logo bounces in
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    // 3 — Pulse ring 1 fires after logo lands
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(pulseOpacity, {
          toValue: 0.7,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(pulseScale, {
          toValue: 2.2,
          duration: 900,
          useNativeDriver: true,
        }),
      ]).start();
      Animated.timing(pulseOpacity, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }).start();
    }, 380);

    // 4 — Pulse ring 2 fires slightly after ring 1
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(pulse2Opacity, {
          toValue: 0.45,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(pulse2Scale, {
          toValue: 2.8,
          duration: 1100,
          useNativeDriver: true,
        }),
      ]).start();
      Animated.timing(pulse2Opacity, {
        toValue: 0,
        duration: 1100,
        useNativeDriver: true,
      }).start();
    }, 520);

    // 5 — Corona breathes gently after initial bloom
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(coronaOpacity, {
            toValue: 0.65,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(coronaOpacity, {
            toValue: 0.45,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, 700);

    // 6 — Stars stagger in with varied timing and sizes
    starAnimations.forEach((star, index) => {
      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(star, {
              toValue: 1,
              duration: 400 + Math.random() * 300,
              useNativeDriver: true,
            }),
            Animated.timing(star, {
              toValue: 0.1,
              duration: 400 + Math.random() * 300,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }, index * 60 + Math.random() * 100);
    });

    // 7 — Exit fade
    const timer = setTimeout(() => {
      Animated.timing(logoOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => onFinish());
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Stars */}
      {stars.map((star, index) => (
        <Animated.View
          key={index}
          style={[
            styles.star,
            {
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              borderRadius: star.size / 2,
              opacity: starAnimations[index],
            },
          ]}
        />
      ))}

      {/* Outer corona */}
      <Animated.View
        style={[
          styles.coronaOuter,
          {
            opacity: coronaOuterOpacity,
            transform: [{ scale: coronaOuterScale }],
          },
        ]}
      />

      {/* Inner corona */}
      <Animated.View
        style={[
          styles.corona,
          {
            opacity: coronaOpacity,
            transform: [{ scale: coronaScale }],
          },
        ]}
      />

      {/* Pulse ring 1 */}
      <Animated.View
        style={[
          styles.pulseRing,
          {
            opacity: pulseOpacity,
            transform: [{ scale: pulseScale }],
          },
        ]}
      />

      {/* Pulse ring 2 */}
      <Animated.View
        style={[
          styles.pulseRing,
          {
            opacity: pulse2Opacity,
            transform: [{ scale: pulse2Scale }],
          },
        ]}
      />

      {/* Logo */}
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
  coronaOuter: {
    position: "absolute",
    width: 480,
    height: 480,
    borderRadius: 240,
    backgroundColor: "rgba(56,189,248,0.12)",
  },
  corona: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(125,211,252,0.22)",
  },
  pulseRing: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: "rgba(125,211,252,0.6)",
    backgroundColor: "transparent",
  },
  logo: {
    width: 240,
    height: 240,
  },
  star: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    shadowColor: "#FFFFFF",
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
});