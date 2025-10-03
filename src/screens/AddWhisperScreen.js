// src/screens/AddWhisperScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { validateWhisperText, containsBadWords } from '../utils/helpers';
import MoodSelector from '../components/MoodSelector';

const AddWhisperScreen = ({ navigation }) => {
  const { selectedMood, addWhisper, location } = useApp();
  const [text, setText] = useState('');
  const [currentMood, setCurrentMood] = useState(selectedMood);
  const [isPosting, setIsPosting] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const textInputRef = useRef(null);

  useEffect(() => {
    // Auto focus on text input when screen loads
    setTimeout(() => {
      textInputRef.current?.focus();
    }, 300);

    // Keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const handleClose = () => {
    if (text.trim().length > 0) {
      Alert.alert(
        'Discard Whisper?',
        'Are you sure you want to discard this whisper?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const handlePost = async () => {
    // Validate text
    const validation = validateWhisperText(text);
    if (!validation.isValid) {
      Alert.alert('Invalid Whisper', validation.errors[0]);
      return;
    }

    // Check for bad words (basic filter)
    if (containsBadWords(text)) {
      Alert.alert(
        'Content Warning',
        'Your whisper contains inappropriate content. Please revise it.'
      );
      return;
    }

    setIsPosting(true);
    
    try {
      const success = await addWhisper(text, currentMood);
      
      if (success) {
        Alert.alert(
          'Success! 🎉',
          'Your whisper has been shared anonymously.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to post whisper. Please try again.');
      }
    } catch (error) {
      console.error('Post whisper error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const getCharacterCountColor = () => {
    const length = text.length;
    if (length > 350) return COLORS.primary;
    if (length > 300) return '#FF9800';
    return COLORS.textMuted;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <LinearGradient
        colors={[COLORS.primaryLight, COLORS.primary]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleClose}
          >
            <Text style={styles.headerButtonText}>×</Text>
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Share Your Whisper</Text>
          
          <TouchableOpacity
            style={[
              styles.headerButton,
              styles.postHeaderButton,
              (!text.trim() || isPosting) && styles.disabledHeaderButton
            ]}
            onPress={handlePost}
            disabled={!text.trim() || isPosting}
          >
            {isPosting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={[
                styles.postButtonText,
                (!text.trim() || isPosting) && styles.disabledPostButtonText
              ]}>
                Post
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Content */}
      <View style={styles.content}>
        {/* Location Info */}
        <View style={styles.locationInfo}>
          <Text style={styles.locationText}>
            📍 Sharing in: {location?.city || 'Current Location'}
          </Text>
          <Text style={styles.anonymousText}>
            🔒 Posted anonymously
          </Text>
        </View>

        {/* Mood Selection */}
        {!keyboardVisible && (
          <View style={styles.moodSection}>
            <Text style={styles.sectionTitle}>Select Mood</Text>
            <MoodSelector
              selectedMood={currentMood}
              onMoodSelect={setCurrentMood}
            />
          </View>
        )}

        {/* Text Input */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Your Whisper</Text>
          <View style={styles.inputContainer}>
            <TextInput
              ref={textInputRef}
              style={styles.textInput}
              placeholder="What's on your mind? Share your thoughts..."
              placeholderTextColor={COLORS.textMuted}
              multiline
              maxLength={400}
              value={text}
              onChangeText={setText}
              textAlignVertical="top"
              autoCorrect
              autoCapitalize="sentences"
            />
            
            {/* Character count */}
            <View style={styles.characterCountContainer}>
              <Text style={[
                styles.characterCount,
                { color: getCharacterCountColor() }
              ]}>
                {text.length}/400
              </Text>
            </View>
          </View>

          {/* Guidelines */}
          <View style={styles.guidelines}>
            <Text style={styles.guidelinesTitle}>Guidelines:</Text>
            <Text style={styles.guidelineItem}>• Be respectful and kind</Text>
            <Text style={styles.guidelineItem}>• No hate speech or harassment</Text>
            <Text style={styles.guidelineItem}>• Keep it anonymous and safe</Text>
          </View>
        </View>
      </View>

      {/* Bottom Action Button (visible when keyboard is open) */}
      {keyboardVisible && text.trim() && (
        <View style={styles.keyboardActions}>
          <TouchableOpacity
            style={styles.keyboardPostButton}
            onPress={handlePost}
            disabled={isPosting}
          >
            <LinearGradient
              colors={[COLORS.primaryLight, COLORS.primary]}
              style={styles.keyboardPostButtonGradient}
            >
              {isPosting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.keyboardPostButtonText}>
                  ✨ Post Whisper
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
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
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postHeaderButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: SIZES.medium,
    width: 'auto',
    minWidth: 60,
  },
  disabledHeaderButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: 'white',
    fontSize: SIZES.h4,
    fontWeight: '600',
  },
  postButtonText: {
    color: 'white',
    fontSize: SIZES.body,
    fontWeight: '600',
  },
  disabledPostButtonText: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.large,
    paddingTop: SIZES.large,
  },
  locationInfo: {
    backgroundColor: 'white',
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.medium,
    marginBottom: SIZES.large,
    ...SHADOWS.small,
  },
  locationText: {
    fontSize: SIZES.caption,
    color: COLORS.textLight,
    marginBottom: SIZES.base,
  },
  anonymousText: {
    fontSize: SIZES.small,
    color: COLORS.primary,
    fontWeight: '500',
  },
  moodSection: {
    marginBottom: SIZES.large,
  },
  sectionTitle: {
    fontSize: SIZES.h5,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  inputSection: {
    flex: 1,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    ...SHADOWS.small,
  },
  textInput: {
    fontSize: SIZES.body,
    color: COLORS.text,
    lineHeight: 24,
    minHeight: 150,
    maxHeight: 250,
  },
  characterCountContainer: {
    alignItems: 'flex-end',
    marginTop: SIZES.small,
  },
  characterCount: {
    fontSize: SIZES.small,
    fontWeight: '500',
  },
  guidelines: {
    backgroundColor: 'rgba(233, 30, 99, 0.05)',
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.medium,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  guidelinesTitle: {
    fontSize: SIZES.caption,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SIZES.small,
  },
  guidelineItem: {
    fontSize: SIZES.small,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  keyboardActions: {
    backgroundColor: 'white',
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  keyboardPostButton: {
    borderRadius: SIZES.radiusXLarge,
    overflow: 'hidden',
  },
  keyboardPostButtonGradient: {
    paddingVertical: SIZES.medium,
    alignItems: 'center',
  },
  keyboardPostButtonText: {
    color: 'white',
    fontSize: SIZES.body,
    fontWeight: '600',
  },
});

export default AddWhisperScreen;