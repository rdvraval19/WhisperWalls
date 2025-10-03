// src/screens/ExploreScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { COLORS, SIZES, SHADOWS, MOODS } from '../constants/theme';
import WhisperCard from '../components/WhisperCard';
import MoodSelector from '../components/MoodSelector';

const ExploreScreen = ({ navigation }) => {
  const { whispers, likeWhisper, location } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('popular');
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'popular', name: 'Popular', emoji: '🔥' },
    { id: 'recent', name: 'Recent', emoji: '⏰' },
    { id: 'nearby', name: 'Nearby', emoji: '📍' },
    { id: 'trending', name: 'Trending', emoji: '📈' }
  ];

  const getFilteredWhispers = () => {
    let filtered = [...whispers];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(whisper =>
        whisper.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    switch (selectedCategory) {
      case 'popular':
        filtered = filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'recent':
        filtered = filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        break;
      case 'nearby':
        filtered = filtered.filter(whisper => whisper.distance <= 1000)
          .sort((a, b) => a.distance - b.distance);
        break;
      case 'trending':
        // Mock trending algorithm based on likes and recency
        filtered = filtered
          .filter(whisper => {
            const hoursOld = (Date.now() - new Date(whisper.timestamp)) / (1000 * 60 * 60);
            return hoursOld <= 24; // Last 24 hours
          })
          .sort((a, b) => {
            const aScore = a.likes / Math.max(1, (Date.now() - new Date(a.timestamp)) / (1000 * 60 * 60));
            const bScore = b.likes / Math.max(1, (Date.now() - new Date(b.timestamp)) / (1000 * 60 * 60));
            return bScore - aScore;
          });
        break;
      default:
        break;
    }

    return filtered.slice(0, 20); // Limit to 20 whispers
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const getMoodStats = () => {
    const stats = whispers.reduce((acc, whisper) => {
      acc[whisper.mood] = (acc[whisper.mood] || 0) + 1;
      return acc;
    }, {});

    return MOODS.map(mood => ({
      ...mood,
      count: stats[mood.id] || 0,
      percentage: whispers.length > 0 ? ((stats[mood.id] || 0) / whispers.length * 100) : 0
    })).sort((a, b) => b.count - a.count);
  };

  const CategoryButton = ({ category, isSelected, onPress }) => (
    <TouchableOpacity
      style={[styles.categoryButton, isSelected && styles.selectedCategoryButton]}
      onPress={onPress}
    >
      <LinearGradient
        colors={isSelected ? [COLORS.primaryLight, COLORS.primary] : ['transparent', 'transparent']}
        style={styles.categoryButtonGradient}
      >
        <Text style={styles.categoryEmoji}>{category.emoji}</Text>
        <Text style={[
          styles.categoryText,
          isSelected && styles.selectedCategoryText
        ]}>
          {category.name}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const MoodStatsCard = ({ mood }) => (
    <View style={styles.moodStatCard}>
      <Text style={styles.moodStatEmoji}>{mood.emoji}</Text>
      <Text style={styles.moodStatName}>{mood.name}</Text>
      <Text style={styles.moodStatCount}>{mood.count}</Text>
      <View style={styles.moodStatBar}>
        <View
          style={[
            styles.moodStatProgress,
            { width: `${Math.min(100, mood.percentage)}%` }
          ]}
        />
      </View>
    </View>
  );

  const filteredWhispers = getFilteredWhispers();
  const moodStats = getMoodStats();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <LinearGradient
        colors={[COLORS.primaryLight, COLORS.primary]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Explore</Text>
          <Text style={styles.headerSubtitle}>
            Discover whispers from around the world
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search whispers..."
              placeholderTextColor={COLORS.textMuted}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearSearch}
                onPress={() => setSearchQuery('')}
              >
                <Text style={styles.clearSearchText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Location Info */}
        <View style={styles.locationInfo}>
          <Text style={styles.locationText}>
            📍 Exploring from: {location?.city || 'Your Location'}
          </Text>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoriesContainer}>
              {categories.map(category => (
                <CategoryButton
                  key={category.id}
                  category={category}
                  isSelected={selectedCategory === category.id}
                  onPress={() => setSelectedCategory(category.id)}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Mood Analytics */}
        <View style={styles.moodAnalyticsSection}>
          <Text style={styles.sectionTitle}>Community Mood Trends</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.moodStatsContainer}>
              {moodStats.map(mood => (
                <MoodStatsCard key={mood.id} mood={mood} />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Whispers List */}
        <View style={styles.whispersSection}>
          <View style={styles.whispersSectionHeader}>
            <Text style={styles.sectionTitle}>
              {categories.find(cat => cat.id === selectedCategory)?.name} Whispers
            </Text>
            <Text style={styles.whispersCount}>
              {filteredWhispers.length} found
            </Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading whispers...</Text>
            </View>
          ) : filteredWhispers.length > 0 ? (
            <View style={styles.whispersList}>
              {filteredWhispers.map(whisper => (
                <WhisperCard
                  key={whisper.id}
                  whisper={whisper}
                  onLike={likeWhisper}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateEmoji}>🔍</Text>
              <Text style={styles.emptyStateTitle}>No whispers found</Text>
              <Text style={styles.emptyStateDescription}>
                {searchQuery.trim() 
                  ? `No whispers match "${searchQuery}"`
                  : `No ${selectedCategory} whispers available right now`
                }
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
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
    paddingBottom: SIZES.large,
    paddingHorizontal: SIZES.large,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: SIZES.base,
  },
  headerSubtitle: {
    fontSize: SIZES.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: SIZES.large,
    paddingTop: SIZES.large,
  },
  searchBar: {
    backgroundColor: 'white',
    borderRadius: SIZES.radiusXLarge,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium,
    ...SHADOWS.small,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: SIZES.small,
  },
  searchInput: {
    flex: 1,
    fontSize: SIZES.body,
    color: COLORS.text,
  },
  clearSearch: {
    padding: SIZES.base,
  },
  clearSearchText: {
    fontSize: 20,
    color: COLORS.textMuted,
  },
  locationInfo: {
    paddingHorizontal: SIZES.large,
    paddingTop: SIZES.medium,
  },
  locationText: {
    fontSize: SIZES.small,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  categoriesSection: {
    paddingTop: SIZES.large,
  },
  sectionTitle: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.text,
    paddingHorizontal: SIZES.large,
    marginBottom: SIZES.medium,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.large,
    gap: SIZES.small,
  },
  categoryButton: {
    borderRadius: SIZES.radiusLarge,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  selectedCategoryButton: {
    borderColor: COLORS.primary,
  },
  categoryButtonGradient: {
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.medium,
    alignItems: 'center',
    flexDirection: 'row',
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: SIZES.base,
  },
  categoryText: {
    fontSize: SIZES.caption,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: 'white',
    fontWeight: '600',
  },
  moodAnalyticsSection: {
    paddingTop: SIZES.large,
  },
  moodStatsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.large,
    gap: SIZES.small,
  },
  moodStatCard: {
    backgroundColor: 'white',
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.medium,
    alignItems: 'center',
    minWidth: 100,
    ...SHADOWS.small,
  },
  moodStatEmoji: {
    fontSize: 24,
    marginBottom: SIZES.base,
  },
  moodStatName: {
    fontSize: SIZES.small,
    color: COLORS.text,
    fontWeight: '500',
    marginBottom: SIZES.base,
  },
  moodStatCount: {
    fontSize: SIZES.h4,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: SIZES.small,
  },
  moodStatBar: {
    width: 60,
    height: 4,
    backgroundColor: COLORS.lightGray,
    borderRadius: 2,
    overflow: 'hidden',
  },
  moodStatProgress: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  whispersSection: {
    paddingTop: SIZES.large,
    paddingHorizontal: SIZES.large,
    paddingBottom: SIZES.xlarge,
  },
  whispersSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  whispersCount: {
    fontSize: SIZES.small,
    color: COLORS.textMuted,
  },
  whispersList: {
    gap: SIZES.small,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: SIZES.xlarge,
  },
  loadingText: {
    marginTop: SIZES.medium,
    fontSize: SIZES.body,
    color: COLORS.textMuted,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: SIZES.radiusLarge,
    padding: SIZES.xlarge,
    marginTop: SIZES.medium,
    ...SHADOWS.small,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: SIZES.medium,
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
  },
});

export default ExploreScreen;