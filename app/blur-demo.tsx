import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BlurDemo() {
  const [blurIntensity, setBlurIntensity] = useState(50);
  const [blurType, setBlurType] = useState<'light' | 'dark' | 'default'>('light');

  const intensityOptions = [10, 30, 50, 80, 100];
  const typeOptions: ('light' | 'dark' | 'default')[] = ['light', 'dark', 'default'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>BlurView Demo</Text>
        
        {/* Background Image Container */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/cake.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
          />
          
          {/* Blur Overlay Examples */}
          
          {/* Example 1: Simple Blur Overlay */}
          <BlurView
            intensity={blurIntensity}
            tint={blurType}
            style={styles.blurOverlay1}
          >
            <Text style={styles.overlayText}>
              Simple Blur Overlay
            </Text>
            <Text style={styles.overlaySubtext}>
              Intensity: {blurIntensity} | Type: {blurType}
            </Text>
          </BlurView>

          {/* Example 2: Card with Blur Background */}
          <BlurView
            intensity={80}
            tint="light"
            style={styles.blurCard}
          >
            <Text style={styles.cardTitle}>Blur Card</Text>
            <Text style={styles.cardText}>
              This is a card with a blurred background. Perfect for overlays and modals.
            </Text>
          </BlurView>

          {/* Example 3: Bottom Sheet Style */}
          <BlurView
            intensity={60}
            tint="dark"
            style={styles.bottomSheet}
          >
            <Text style={styles.bottomSheetTitle}>Bottom Sheet</Text>
            <Text style={styles.bottomSheetText}>
              Dark blur effect for bottom sheets
            </Text>
          </BlurView>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <Text style={styles.controlTitle}>Blur Intensity</Text>
          <View style={styles.buttonRow}>
            {intensityOptions.map((intensity) => (
              <TouchableOpacity
                key={intensity}
                style={[
                  styles.controlButton,
                  blurIntensity === intensity && styles.activeButton
                ]}
                onPress={() => setBlurIntensity(intensity)}
              >
                <Text style={[
                  styles.buttonText,
                  blurIntensity === intensity && styles.activeButtonText
                ]}>
                  {intensity}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.controlTitle}>Blur Type</Text>
          <View style={styles.buttonRow}>
            {typeOptions.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.controlButton,
                  blurType === type && styles.activeButton
                ]}
                onPress={() => setBlurType(type)}
              >
                <Text style={[
                  styles.buttonText,
                  blurType === type && styles.activeButtonText
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Usage Examples */}
        <View style={styles.usageSection}>
          <Text style={styles.sectionTitle}>Common Use Cases:</Text>
          
          {/* Modal Example */}
          <View style={styles.exampleContainer}>
            <Image
              source={require('../assets/images/brownies.png')}
              style={styles.exampleImage}
            />
            <BlurView intensity={40} tint="light" style={styles.modalExample}>
              <Text style={styles.modalTitle}>Modal Overlay</Text>
              <Text style={styles.modalText}>Perfect for modals and popups</Text>
            </BlurView>
          </View>

          {/* Navigation Bar Example */}
          <View style={styles.exampleContainer}>
            <Image
              source={require('../assets/images/macaron.png')}
              style={styles.exampleImage}
            />
            <BlurView intensity={70} tint="default" style={styles.navExample}>
              <Text style={styles.navText}>Navigation Bar</Text>
              <Text style={styles.navSubtext}>Translucent navigation</Text>
            </BlurView>
          </View>
        </View>

        {/* Code Examples */}
        <View style={styles.codeSection}>
          <Text style={styles.sectionTitle}>Basic Usage:</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>
{`<BlurView
  intensity={50}
  tint="light"
  style={styles.blurContainer}
>
  <Text>Your content here</Text>
</BlurView>`}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  imageContainer: {
    height: 400,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 30,
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  blurOverlay1: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  overlayText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  overlaySubtext: {
    fontSize: 14,
    color: '#666',
  },
  blurCard: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    padding: 20,
    borderRadius: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomSheetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  bottomSheetText: {
    fontSize: 14,
    color: '#ccc',
  },
  controls: {
    marginBottom: 30,
  },
  controlTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  controlButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    minWidth: 60,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 14,
    color: '#333',
    textTransform: 'capitalize',
  },
  activeButtonText: {
    color: '#fff',
  },
  usageSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  exampleContainer: {
    height: 150,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
    position: 'relative',
  },
  exampleImage: {
    width: '100%',
    height: '100%',
  },
  modalExample: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -75 }, { translateY: -30 }],
    width: 150,
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  modalText: {
    fontSize: 12,
    color: '#666',
  },
  navExample: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  navText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  navSubtext: {
    fontSize: 12,
    color: '#666',
  },
  codeSection: {
    marginBottom: 20,
  },
  codeBlock: {
    backgroundColor: '#2d2d2d',
    borderRadius: 10,
    padding: 15,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#f8f8f2',
    lineHeight: 18,
  },
});