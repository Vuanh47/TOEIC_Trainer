import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing } from '@/src/assets/styles/theme';

export default function VideoPanel() {
  return (
    <View>
      <Text style={styles.heading}>Manage Lesson Video: Hello & Goodbye</Text>

      <View style={styles.videoFrame}>
        <View style={styles.videoHero}>
          <View style={styles.heroArt}>
            <View style={styles.heroScreen}>
              <View style={styles.heroWindowBar}>
                <View style={styles.heroDot} />
                <View style={styles.heroDot} />
                <View style={styles.heroDot} />
              </View>
              <View style={styles.heroScreenBody}>
                <View style={styles.heroTeacherBlock} />
                <View style={styles.heroTextBlock}>
                  <View style={styles.heroTextLineLong} />
                  <View style={styles.heroTextLineShort} />
                  <View style={styles.heroTextLineLong} />
                </View>
              </View>
            </View>
            <View style={styles.heroAudienceRow}>
              <View style={styles.heroAudience} />
              <View style={styles.heroAudience} />
              <View style={styles.heroAudience} />
            </View>
            <View style={styles.heroPlay}>
              <Ionicons color={colors.surface} name="play" size={34} />
            </View>
          </View>
        </View>
        <View style={styles.videoToolbar}>
          <View style={styles.controls}>
            <Ionicons color={colors.surface} name="play" size={20} />
            <Ionicons color={colors.surface} name="play-skip-back" size={20} />
          </View>
          <View style={styles.progressRail}>
            <View style={styles.progressFill} />
            <View style={styles.progressThumb} />
          </View>
          <View style={styles.controls}>
            <Ionicons color={colors.surface} name="volume-high" size={18} />
            <Ionicons color={colors.surface} name="expand" size={18} />
          </View>
        </View>
      </View>

      <View style={styles.formGrid}>
        <View style={styles.inputBlock}>
          <View style={styles.input}>
            <Text style={styles.placeholder}>Video URL</Text>
          </View>
        </View>
        <View style={styles.cta}>
          <Text style={styles.ctaText}>Upload Video</Text>
        </View>
      </View>

      <View style={styles.formGrid}>
        <View style={styles.inputBlock}>
          <View style={styles.input}>
            <Text style={styles.placeholder}>Transcript Source</Text>
          </View>
        </View>
        <View style={styles.secondaryButton}>
          <Text style={styles.secondaryText}>Manage Transcript</Text>
        </View>
      </View>

      <View style={styles.formGrid}>
        <View style={styles.inputBlock}>
          <View style={styles.input}>
            <Text style={styles.placeholder}>Subtitles</Text>
          </View>
        </View>
        <View style={styles.secondaryButton}>
          <Text style={styles.secondaryText}>Manage Subtitles</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  cta: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderColor: '#1F7FDA',
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    minWidth: 132,
    paddingHorizontal: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
  },
  ctaText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  formGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: 12,
  },
  heading: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
  },
  heroArt: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 18,
  },
  heroAudience: {
    backgroundColor: 'rgba(20,32,51,0.68)',
    borderRadius: radius.pill,
    height: 36,
    width: 36,
  },
  heroAudienceRow: {
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 34,
    marginBottom: 4,
  },
  heroDot: {
    backgroundColor: 'rgba(255,255,255,0.74)',
    borderRadius: radius.pill,
    height: 6,
    width: 6,
  },
  heroPlay: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(24,28,37,0.72)',
    borderRadius: radius.pill,
    height: 74,
    justifyContent: 'center',
    left: '50%',
    marginLeft: -37,
    marginTop: -86,
    position: 'absolute',
    top: '50%',
    width: 74,
  },
  heroScreen: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderColor: 'rgba(255,255,255,0.7)',
    borderRadius: 14,
    borderWidth: 1,
    height: 154,
    marginTop: 6,
    padding: 12,
    width: 240,
  },
  heroScreenBody: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  heroTeacherBlock: {
    backgroundColor: '#4D78C7',
    borderRadius: 10,
    width: 72,
  },
  heroTextBlock: {
    flex: 1,
    justifyContent: 'center',
  },
  heroTextLineLong: {
    backgroundColor: '#D4DFEE',
    borderRadius: radius.pill,
    height: 10,
    marginBottom: 10,
    width: '100%',
  },
  heroTextLineShort: {
    backgroundColor: '#D4DFEE',
    borderRadius: radius.pill,
    height: 10,
    marginBottom: 10,
    width: '70%',
  },
  heroWindowBar: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  input: {
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderColor: '#CDD7E3',
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: 14,
  },
  inputBlock: {
    flex: 1,
  },
  placeholder: {
    color: '#6E7B90',
    fontSize: 15,
  },
  progressFill: {
    backgroundColor: '#9D9D9D',
    borderRadius: radius.pill,
    height: 4,
    width: '82%',
  },
  progressRail: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
  },
  progressThumb: {
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    height: 14,
    marginLeft: -12,
    width: 14,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#F6F7F9',
    borderColor: '#D3DAE4',
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    minWidth: 172,
    paddingHorizontal: spacing.md,
  },
  secondaryText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  videoFrame: {
    backgroundColor: colors.surface,
    borderColor: '#D4DFEA',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    overflow: 'hidden',
  },
  videoHero: {
    alignItems: 'center',
    backgroundColor: '#2E87C6',
    height: 242,
    justifyContent: 'center',
  },
  videoToolbar: {
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
});
