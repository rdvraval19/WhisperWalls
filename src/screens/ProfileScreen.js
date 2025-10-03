// src/screens/ProfileScreen.js
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

const ProfileScreen = ({ navigation }) => {
  const { user, whispers, location } = useApp();

  // Calculate user stats
  const userWhispers = whispers.filter(whisper => whisper.userId === user?.id);
  const totalLikes = userWhispers.reduce((sum, whisper) => sum + whisper.likes, 0);
  
  const moodStats = userWhispers.reduce((acc, whisper) => {
    acc[whisper.mood] = (acc[whisper.mood] || 0) + 1;
    return acc;
  }, {});

  const menuItems = [
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'App preferences and privacy',
      emoji: '⚙️',
      action: () => navigation.navigate('Settings')
    },
    {
      id: 'about',
      title: 'About Whisper Walls',
      subtitle: 'Learn more about our mission',
      emoji: 'ℹ️',
      action: () => navigation.navigate('About')
    },
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'FAQs and contact information',
      emoji: '❓',
      action: () => {} // We'll add this later
    },
    {
      id: 'feedback',
      title: 'Send Feedback',
      subtitle: 'Help us improve the app',
      emoji: '💬',
      action: () => {} // We'll add this later
    }
  ];

  const StatCard = ({ title, value, subtitle, emoji }) => (
    <View style={styles.statCard}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const MoodStatBar = ({ mood, count, total, emoji }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    
    return (
      <View style={styles.moodStatContainer}>
        <View style={styles.moodStatHeader}>
          <Text style={styles.moodStatEmoji}>{emoji}</Text>
          <Text style={styles.moodStatName}>{mood}</Text>
          <Text style={styles.moodStatCount}>{count}</Text>
        </View>
        <View style={styles.moodStatBar}>
          <LinearGradient
            colors={[COLORS.primaryLight, COLORS.primary]}
            style={[styles.moodStatProgress, { width: `${percentage}%` }]}
          />
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <LinearGradient
        colors={[COLORS.primaryLight, COLORS.primary]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
          <Text style={styles.headerTitle}>Anonymous User</Text>
          <Text style={styles.headerSubtitle}>
            Member since {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
          <Text style={styles.locationText}>
            📍 {location?.city || 'Location not set'}
          </Text>
        </View>
      </LinearGradient>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Your Stats</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="Whispers"
            value={userWhispers.length}
            subtitle="Total shared"
            emoji="💭"
          />
          <StatCard
            title="Likes"
            value={totalLikes}
            subtitle="Received"
            emoji="💙"
          />
          <StatCard
            title="Days"
            value="7"
            subtitle="Active"
            emoji="📅"
          />
          <StatCard
            title="Radius"
            value="2km"
            subtitle="Current"
            emoji="📍"
          />
        </View>
      </View>

      {/* Mood Analysis */}
      {userWhispers.length > 0 && (
        <View style={styles.moodSection}>
          <Text style={styles.sectionTitle}>Your Mood Distribution</Text>
          <View style={styles.moodStatsContainer}>
            <MoodStatBar
              mood="Calm"
              count={moodStats.calm || 0}
              total={userWhispers.length}
              emoji="😌"
            />
            <MoodStatBar
              mood="Love"
              count={moodStats.love || 0}
              total={userWhispers.length}
              emoji="❤️"
            />
            <MoodStatBar
              mood="Dear"
              count={moodStats.dear || 0}
              total={userWhispers.length}
              emoji="💭"
            />
            <MoodStatBar
              mood="Greed"
              count={moodStats.greed || 0}
              total={userWhispers.length}
              emoji="💰"
            />
          </View>
        </View>
      )}

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>More Options</Text>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.action}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuItemEmoji}>{item.emoji}</Text>
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
                <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <Text style={styles.menuItemChevron}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Privacy Note */}
      <View style={styles.privacyNote}>
        <Text style={styles.privacyTitle}>🔒 Privacy First</Text>
        <Text style={styles.privacyText}>
          Your whispers are completely anonymous. We don't store your personal information, 
          and your location is only used to find nearby whispers.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: SIZES.xlarge,
    paddingHorizontal: SIZES.large,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  headerTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: SIZES.base,
  },
  headerSubtitle: {
    fontSize: SIZES.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: SIZES.base,
  },
  locationText: {
    fontSize: SIZES.small,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  statsSection: {
    paddingHorizontal: SIZES.large,
    paddingTop: SIZES.large,
  },
  sectionTitle: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.medium,
    alignItems: 'center',
    width: '48%',
    marginBottom: SIZES.medium,
    ...SHADOWS.small,
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: SIZES.small,
  },
  statValue: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.base,
  },
  statTitle: {
    fontSize: SIZES.caption,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: SIZES.small,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  moodSection: {
    paddingHorizontal: SIZES.large,
    paddingTop: SIZES.large,
  },
  moodStatsContainer: {
    backgroundColor: 'white',
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.medium,
    ...SHADOWS.small,
  },
  moodStatContainer: {
    marginBottom: SIZES.medium,
  },
  moodStatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  moodStatEmoji: {
    fontSize: 16,
    marginRight: SIZES.small,
  },
  moodStatName: {
    flex: 1,
    fontSize: SIZES.caption,
    color: COLORS.text,
    fontWeight: '500',
  },
  moodStatCount: {
    fontSize: SIZES.caption,
    color: COLORS.textMuted,
  },
  moodStatBar: {
    height: 6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 3,
    overflow: 'hidden',
  },
  moodStatProgress: {
    height: '100%',
    borderRadius: 3,
  },
  menuSection: {
    paddingHorizontal: SIZES.large,
    paddingTop: SIZES.large,
  },
  menuItem: {
    backgroundColor: 'white',
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.small,
    ...SHADOWS.small,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemEmoji: {
    fontSize: 20,
    marginRight: SIZES.medium,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: SIZES.body,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: SIZES.small,
    color: COLORS.textMuted,
  },
  menuItemChevron: {
    fontSize: 20,
    color: COLORS.textMuted,
    fontWeight: '300',
  },
  privacyNote: {
    backgroundColor: 'rgba(233, 30, 99, 0.05)',
    marginHorizontal: SIZES.large,
    marginTop: SIZES.large,
    marginBottom: SIZES.xlarge,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.medium,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  privacyTitle: {
    fontSize: SIZES.caption,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SIZES.small,
  },
  privacyText: {
    fontSize: SIZES.small,
    color: COLORS.textLight,
    lineHeight: 20,
  },
});

export default ProfileScreen;