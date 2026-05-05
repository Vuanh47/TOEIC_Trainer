package org.example.backend.entity;

import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tests")
@Getter
@Setter
public class Test extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "test_type", length = 30)
    private String testType; // FULL_TEST, READING_ONLY, LISTENING_ONLY, PRACTICE

    @Column(name = "total_duration_minutes")
    private Integer totalDurationMinutes = 120;

    @Column(name = "target_score")
    private Integer targetScore; // Điểm mục tiêu (10-990)

    @Column(nullable = false)
    private Boolean published = false;

    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<TestPart> parts = new ArrayList<>();
}

