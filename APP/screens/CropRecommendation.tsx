import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LineChart, PieChart, BarChart } from "react-native-chart-kit";

const theme = {
  primary: "#2E7D32",
  secondary: "#81C784",
  accent: "#43A047",
  background: "#F1F8E9",
  cardBg: "#FFFFFF",
  text: "#1B5E20",
  chartGradientFrom: "#66BB6A",
  chartGradientTo: "#43A047",
};

const CropRecommendation = ({ route }) => {
  const { url } = route.params || {};
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [focusedInput, setFocusedInput] = useState(null);
  const screenWidth = Dimensions.get("window").width;

  const [inputValues, setInputValues] = useState({
    n: "14.5",
    p: "8.2",
    k: "20.1",
    ph: "6.8",
    soil_moisture: "40",
    water_level: "78.2",
  });

  const [sensorData, setSensorData] = useState({
    "-O4au0_OKuJStajyzN5a": {
      benzin: 0.2,
      co2: 415.3,
      humidity: 22.4,
      temperature: 25.3,
      no2: 0.03,
      lpg: 0.5,
      water_level: 78.2,
      n: 14.5,
      p: 8.2,
      k: 20.1,
      ph: 6.8,
      soil_moisture: 40,
    },
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        speed: 12,
        bounciness: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const updateSensorValue = (key, value) => {
    // Update the input values state
    setInputValues(prev => ({
      ...prev,
      [key]: value
    }));

    // Update the sensor data with parsed float value
    setSensorData(prevData => ({
      "-O4au0_OKuJStajyzN5a": {
        ...prevData["-O4au0_OKuJStajyzN5a"],
        [key]: parseFloat(value) || 0,
      },
    }));
  };

  const airQualityData = {
    labels: ["NO2", "CO2", "LPG", "Benzene"],
    data: [
      sensorData["-O4au0_OKuJStajyzN5a"].no2,
      sensorData["-O4au0_OKuJStajyzN5a"].co2 / 1000,
      sensorData["-O4au0_OKuJStajyzN5a"].lpg,
      sensorData["-O4au0_OKuJStajyzN5a"].benzin,
    ],
    colors: [theme.primary, theme.secondary, theme.accent, theme.chartGradientFrom],
  };

  const chartConfig = {
    backgroundColor: theme.cardBg,
    backgroundGradientFrom: theme.chartGradientFrom,
    backgroundGradientTo: theme.chartGradientTo,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    strokeWidth: 3,
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: theme.accent,
    },
  };

  const EditableDataBlock = ({ title, valueKey, unit = "" }) => (
    <Animated.View
      style={[
        styles.block,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
        focusedInput === valueKey && styles.focusedBlock,
      ]}
    >
      <Text style={[styles.blockTitle, { color: theme.text }]}>{title}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            { color: theme.primary },
            focusedInput === valueKey && styles.focusedInput,
          ]}
          value={inputValues[valueKey]}
          onChangeText={(value) => {
            if (/^\d*\.?\d*$/.test(value)) {
              updateSensorValue(valueKey, value);
            }
          }}
          onFocus={() => setFocusedInput(valueKey)}
          onBlur={() => setFocusedInput(null)}
          keyboardType="numeric"
          returnKeyType="done"
          placeholder={`Enter ${title}`}
          placeholderTextColor="#999"
          selectTextOnFocus
        />
        {unit && <Text style={[styles.unitText, { color: theme.text }]}>{unit}</Text>}
      </View>
    </Animated.View>
  );

  const handlePredictClick = async () => {
    setLoading(true);
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    try {
      const response = await fetch(
        `${url}/crop_recommendation?n=${sensorData["-O4au0_OKuJStajyzN5a"].n}&p=${sensorData["-O4au0_OKuJStajyzN5a"].p}&k=${sensorData["-O4au0_OKuJStajyzN5a"].k}&temperature=${sensorData["-O4au0_OKuJStajyzN5a"].temperature}&humidity=${sensorData["-O4au0_OKuJStajyzN5a"].humidity}&ph=${sensorData["-O4au0_OKuJStajyzN5a"].ph}&rainfall=100`
      );
      const result = await response.json();
      
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
      
      setRecommendation(result);
    } catch (error) {
      console.error("Error fetching recommendation:", error);
    } finally {
      setLoading(false);
      rotateAnim.setValue(0);
    }
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView 
        style={[styles.container, { backgroundColor: theme.background }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              backgroundColor: theme.cardBg,
            },
          ]}
        >
          <Image
            source={{
              uri: "https://ik.imagekit.io/j9wgmlnwk/image-removebg-preview.png",
            }}
            style={{ width: 290, height: 230 }}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: theme.text }]}>Overall Strategy</Text>
        </Animated.View>

        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              backgroundColor: theme.cardBg,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Temperature</Text>
          <View style={styles.temperatureContainer}>
            <Text style={[styles.temperatureText, { color: theme.primary }]}>
              {sensorData["-O4au0_OKuJStajyzN5a"].temperature} °C
            </Text>
          </View>
        </Animated.View>

        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              backgroundColor: theme.cardBg,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Air Quality</Text>
          <PieChart
            data={airQualityData.labels.map((label, index) => ({
              name: label,
              value: airQualityData.data[index],
              color: airQualityData.colors[index],
              legendFontColor: theme.text,
              legendFontSize: 12,
            }))}
            width={screenWidth - 60}
            height={200}
            chartConfig={chartConfig}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="15"
          />
        </Animated.View>

        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              backgroundColor: theme.cardBg,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Soil and Water Data</Text>
          <View style={styles.blockContainer}>
            <EditableDataBlock title="N" valueKey="n" />
            <EditableDataBlock title="P" valueKey="p" />
            <EditableDataBlock title="K" valueKey="k" />
            <EditableDataBlock title="PH" valueKey="ph" />
            <EditableDataBlock title="Soil Moisture" valueKey="soil_moisture" unit="%" />
            <EditableDataBlock title="Water Level" valueKey="water_level" unit="%" />
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              loading && styles.buttonDisabled,
              { backgroundColor: theme.primary },
            ]}
            onPress={handlePredictClick}
            disabled={loading}
          >
            {loading ? (
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <Text style={styles.buttonText}>Processing...</Text>
              </Animated.View>
            ) : (
              <Text style={styles.buttonText}>Predict Crop</Text>
            )}
          </TouchableOpacity>

          {recommendation && (
            <Animated.View 
              style={[
                styles.recommendation,
                {
                  opacity: fadeAnim,
                  backgroundColor: theme.cardBg,
                },
              ]}
            >
              <Text style={[styles.recommendationTitle, { color: theme.text }]}>
                Recommended Crops:
              </Text>
              {recommendation.map((item, index) => (
                <Text 
                  key={index} 
                  style={[styles.recommendationItem, { color: theme.primary }]}
                >
                  {item.crop}: {Math.round(item.probability * 100)}%
                </Text>
              ))}
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderRadius: 16,
    margin: 10,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  section: {
    margin: 10,
    padding: 15,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
  },
  temperatureContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  temperatureText: {
    fontSize: 36,
    fontWeight: "bold",
  },
  blockContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  block: {
    width: "48%",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    backgroundColor: "#fff",
  },
  blockTitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  blockValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    fontSize: 20,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: '#2E7D32',
    paddingVertical: 4,
    marginTop: 5,
  },
  unitText: {
    fontSize: 14,
    marginTop: 2,
  },
  button: {
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  recommendation: {
    marginTop: 20,
    padding: 15,
    borderRadius: 12,
    elevation: 2,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  recommendationItem: {
    fontSize: 16,
    marginBottom: 5,
    paddingVertical: 5,
  },
});

export default CropRecommendation;