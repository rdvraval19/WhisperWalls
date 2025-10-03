// src/screens/HomeScreen.js
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

import { useApp } from '../context/AppContext';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import WhisperCard from '../components/WhisperCard';
import MoodSelector from '../components/MoodSelector';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const {
    location,
    selectedMood,
    setSelectedMood,
    getFilteredWhispers,
    likeWhisper,
    requestLocationPermission
  } = useApp();

  const [refreshing, setRefreshing] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const filteredWhispers = getFilteredWhispers();

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // You can add any refresh logic here
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleLocationPress = async () => {
    setLoadingLocation(true);
    await requestLocationPermission();
    setLoadingLocation(false);
  };

  const handleAddWhisper = () => {
    navigation.navigate('AddWhisper');
  };

  const handleNotifications = () => {
    navigation.navigate('Notifications');
  };

  const capitalizeFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <LinearGradient
        colors={[COLORS.primaryLight, COLORS.primary]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoEmoji}>🏮</Text>
            </View>
            <Text style={styles.logoText}>Whisper Walls</Text>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleNotifications}
            >
              <Text style={styles.headerButtonText}>🔔</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Location Section */}
      <View style={styles.locationSection}>
        <Text style={styles.sectionTitle}>Your Location</Text>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={handleLocationPress}
          disabled={loadingLocation}
        >
          <LinearGradient
            colors={[COLORS.primaryLight, COLORS.primary]}
            style={styles.locationButtonGradient}
          >
            {loadingLocation ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.locationButtonText}>
                📍 {location ? location.city : 'Use My Location'}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Mood Filter Section */}
      <View style={styles.moodSection}>
        <Text style={styles.sectionTitle}>Filter by Mood</Text>
        <MoodSelector
          selectedMood={selectedMood}
          onMoodSelect={setSelectedMood}
        />
      </View>

      {/* Whispers Feed */}
      <View style={styles.feedHeader}>
        <Text style={styles.feedTitle}>
          Whispers Near You ({capitalizeFirst(selectedMood)} Mood)
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredWhispers.length > 0 ? (
          filteredWhispers.map((whisper) => (
            <WhisperCard
              key={whisper.id}
              whisper={whisper}
              onLike={likeWhisper}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIcon}>
              <Text style={styles.emptyStateEmoji}>💭</Text>
            </View>
            <Text style={styles.emptyStateTitle}>No whispers here yet</Text>
            <Text style={styles.emptyStateDescription}>
              Be the first to share your thoughts in this area!
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={handleAddWhisper}
            >
              <LinearGradient
                colors={[COLORS.primaryLight, COLORS.primary]}
                style={styles.emptyStateButtonGradient}
              >
                <Text style={styles.emptyStateButtonText}>
                  ✨ Add First Whisper
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleAddWhisper}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[COLORS.primaryLight, COLORS.primary]}
          style={styles.floatingButtonGradient}
        >
          <Text style={styles.floatingButtonText}>+</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: SIZES.medium,
    paddingHorizontal: SIZES.large,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.small,
  },
  logoEmoji: {
    fontSize: 18,
  },
  logoText: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: 'white',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    fontSize: 18,
  },
  locationSection: {
    backgroundColor: 'white',
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.large,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  sectionTitle: {
    fontSize: SIZES.h5,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  locationButton: {
    borderRadius: SIZES.radiusXLarge,
    overflow: 'hidden',
  },
  locationButtonGradient: {
    paddingVertical: SIZES.medium,
    alignItems: 'center',
  },
  locationButtonText: {
    color: 'white',
    fontSize: SIZES.body,
    fontWeight: '500',
  },
  moodSection: {
    backgroundColor: 'white',
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.large,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  feedHeader: {
    backgroundColor: 'white',
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
  },
  feedTitle: {
    fontSize: SIZES.h5,
    fontWeight: '600',
    color: COLORS.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    paddingBottom: 100, // Space for floating button
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: SIZES.radiusLarge,
    padding: SIZES.xlarge,
    marginTop: SIZES.xlarge,
    ...SHADOWS.medium,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  emptyStateEmoji: {
    fontSize: 40,
  },
  emptyStateTitle: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.small,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: SIZES.body,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SIZES.large,
  },
  emptyStateButton: {
    borderRadius: SIZES.radiusXLarge,
    overflow: 'hidden',
  },
  emptyStateButtonGradient: {
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.xlarge,
    alignItems: 'center',
  },
  emptyStateButtonText: {
    color: 'white',
    fontSize: SIZES.body,
    fontWeight: '600',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    ...SHADOWS.large,
  },
  floatingButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default HomeScreen;