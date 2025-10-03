// src/screens/SettingsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Switch,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

const SettingsScreen = ({ navigation }) => {
  const { locationRadius, setLocationRadius } = useApp();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoLocation, setAutoLocation] = useState(true);

  const radiusOptions = [
    { value: 500, label: '500m', description: 'Very close' },
    { value: 1000, label: '1km', description: 'Walking distance' },
    { value: 2000, label: '2km', description: 'Neighborhood' },
    { value: 5000, label: '5km', description: 'City area' }
  ];

  const handleRadiusChange = (value) => {
    setLocationRadius(value);
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your whispers and reset the app. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: () => {
            // Implementation for clearing data
            Alert.alert('Success', 'All data has been cleared.');
          }
        }
      ]
    );
  };

  const SettingSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const SettingItem = ({ title, subtitle, rightComponent, onPress, disabled = false }) => (
    <TouchableOpacity
      style={[styles.settingItem, disabled && styles.disabledSettingItem]}
      onPress={onPress}
      disabled={disabled || !onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.settingItemLeft}>
        <Text style={[styles.settingItemTitle, disabled && styles.disabledText]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.settingItemSubtitle, disabled && styles.disabledText]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  const RadioOption = ({ selected, onPress, label, description }) => (
    <TouchableOpacity
      style={[styles.radioOption, selected && styles.selectedRadioOption]}
      onPress={onPress}
    >
      <View style={styles.radioOptionContent}>
        <View style={styles.radioButton}>
          {selected && <View style={styles.radioButtonSelected} />}
        </View>
        <View style={styles.radioOptionText}>
          <Text style={[styles.radioOptionLabel, selected && styles.selectedRadioLabel]}>
            {label}
          </Text>
          {description && (
            <Text style={[styles.radioOptionDescription, selected && styles.selectedRadioDescription]}>
              {description}
            </Text>
          )}
        </View>
      </View>
      {selected && <Text style={styles.checkmark}>✓</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <LinearGradient
        colors={[COLORS.primaryLight, COLORS.primary]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Location Settings */}
        <SettingSection title="Location">
          <SettingItem
            title="Auto-detect Location"
            subtitle="Automatically use your current location"
            rightComponent={
              <Switch
                value={autoLocation}
                onValueChange={setAutoLocation}
                trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
                thumbColor={autoLocation ? COLORS.primary : COLORS.gray}
              />
            }
          />
          
          <View style={styles.radiusSection}>
            <Text style={styles.radiusTitle}>Search Radius</Text>
            <Text style={styles.radiusSubtitle}>
              Choose how far to search for whispers around you
            </Text>
            
            <View style={styles.radiusOptions}>
              {radiusOptions.map(option => (
                <RadioOption
                  key={option.value}
                  selected={locationRadius === option.value}
                  onPress={() => handleRadiusChange(option.value)}
                  label={option.label}
                  description={option.description}
                />
              ))}
            </View>
          </View>
        </SettingSection>

        {/* Notifications */}
        <SettingSection title="Notifications">
          <SettingItem
            title="Push Notifications"
            subtitle="Get notified about nearby whispers"
            rightComponent={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
                thumbColor={notifications ? COLORS.primary : COLORS.gray}
              />
            }
          />
          
          <SettingItem
            title="Notification Radius"
            subtitle="Same as search radius"
            disabled={!notifications}
          />
        </SettingSection>

        {/* Appearance */}
        <SettingSection title="Appearance">
          <SettingItem
            title="Dark Mode"
            subtitle="Coming soon"
            disabled={true}
            rightComponent={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                disabled={true}
                trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
                thumbColor={COLORS.gray}
              />
            }
          />
        </SettingSection>

        {/* Privacy & Safety */}
        <SettingSection title="Privacy & Safety">
          <SettingItem
            title="Content Filtering"
            subtitle="Automatically filter inappropriate content"
            rightComponent={
              <Switch
                value={true}
                onValueChange={() => {}}
                disabled={true}
                trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
                thumbColor={COLORS.primary}
              />
            }
          />
          
          <SettingItem
            title="Anonymous Mode"
            subtitle="Always enabled for your privacy"
            disabled={true}
            rightComponent={
              <Text style={styles.enabledBadge}>Enabled</Text>
            }
          />
        </SettingSection>

        {/* Data Management */}
        <SettingSection title="Data Management">
          <SettingItem
            title="Export My Data"
            subtitle="Download all your whispers"
            onPress={() => Alert.alert('Coming Soon', 'Data export feature will be available soon.')}
            rightComponent={<Text style={styles.chevron}>›</Text>}
          />
          
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleClearData}
          >
            <Text style={styles.dangerButtonText}>Clear All Data</Text>
            <Text style={styles.dangerButtonSubtext}>
              Delete all whispers and reset app
            </Text>
          </TouchableOpacity>
        </SettingSection>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoTitle}>Whisper Walls</Text>
          <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
          <Text style={styles.appInfoDescription}>
            Share your thoughts anonymously with people around you
          </Text>
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
    paddingBottom: SIZES.medium,
    paddingHorizontal: SIZES.large,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: 'white',
    fontSize: SIZES.h3,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.large,
  },
  section: {
    marginTop: SIZES.large,
  },
  sectionTitle: {
    fontSize: SIZES.h5,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  settingItem: {
    backgroundColor: 'white',
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.small,
    ...SHADOWS.small,
  },
  disabledSettingItem: {
    backgroundColor: '#f8f8f8',
  },
  settingItemLeft: {
    flex: 1,
  },
  settingItemTitle: {
    fontSize: SIZES.body,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 2,
  },
  settingItemSubtitle: {
    fontSize: SIZES.small,
    color: COLORS.textMuted,
  },
  disabledText: {
    color: COLORS.textMuted,
  },
  radiusSection: {
    backgroundColor: 'white',
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.medium,
    marginBottom: SIZES.small,
    ...SHADOWS.small,
  },
  radiusTitle: {
    fontSize: SIZES.body,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  radiusSubtitle: {
    fontSize: SIZES.small,
    color: COLORS.textMuted,
    marginBottom: SIZES.medium,
  },
  radiusOptions: {
    gap: SIZES.small,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.medium,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.background,
  },
  selectedRadioOption: {
    backgroundColor: COLORS.primary,
  },
  radioOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.gray,
    marginRight: SIZES.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  radioOptionText: {
    flex: 1,
  },
  radioOptionLabel: {
    fontSize: SIZES.caption,
    fontWeight: '500',
    color: COLORS.text,
  },
  selectedRadioLabel: {
    color: 'white',
  },
  radioOptionDescription: {
    fontSize: SIZES.small,
    color: COLORS.textMuted,
  },
  selectedRadioDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  enabledBadge: {
    backgroundColor: COLORS.primary,
    color: 'white',
    paddingHorizontal: SIZES.small,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
    fontSize: SIZES.small,
    fontWeight: '500',
  },
  chevron: {
    fontSize: 20,
    color: COLORS.textMuted,
  },
  dangerButton: {
    backgroundColor: 'white',
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.medium,
    marginTop: SIZES.small,
    borderLeftWidth: 3,
    borderLeftColor: '#FF5252',
    ...SHADOWS.small,
  },
  dangerButtonText: {
    fontSize: SIZES.body,
    fontWeight: '500',
    color: '#FF5252',
    marginBottom: 2,
  },
  dangerButtonSubtext: {
    fontSize: SIZES.small,
    color: COLORS.textMuted,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: SIZES.xlarge,
    marginTop: SIZES.large,
  },
  appInfoTitle: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  appInfoVersion: {
    fontSize: SIZES.caption,
    color: COLORS.textMuted,
    marginBottom: SIZES.small,
  },
  appInfoDescription: {
    fontSize: SIZES.small,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SettingsScreen;