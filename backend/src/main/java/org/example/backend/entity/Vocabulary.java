package org.example.backend.entity;

import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.*;

@Entity
@Table(name = "vocabularies")
@Getter
@Setter
public class Vocabulary extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String word;

    @Column(length = 255)
    private String ipa;

    @Column(name = "audio_url")
    private String audioUrl;

    @Column(name = "meaning_vi", nullable = false, columnDefinition = "TEXT")
    private String meaningVi;

    @Column(name = "meaning_en", columnDefinition = "TEXT")
    private String meaningEn;

    @Column(name = "example_sentence", columnDefinition = "TEXT")
    private String exampleSentence;

    @Column(name = "example_translation", columnDefinition = "TEXT")
    private String exampleTranslation;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "part_of_speech", length = 50)
    private String partOfSpeech;

    @Column(name = "difficulty_level", length = 50)
    private String difficultyLevel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id")
    private VocabularyTopic topic;
}
