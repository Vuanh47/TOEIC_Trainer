package org.example.backend.entity;

import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "test_parts")
@Getter
@Setter
public class TestPart extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_id", nullable = false)
    private Test test;

    @Column(nullable = false, length = 100)
    private String partName; // ví dụ: "Reading Part 1", "Listening Part 1"

    @Column(name = "part_number", nullable = false)
    private Integer partNumber; // 1, 2, 3, 4, ...

    @Column(name = "part_section", length = 50)
    private String partSection; // READING, LISTENING

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder; // Thứ tự của part trong test

    @Column(name = "duration_minutes")
    private Integer durationMinutes; // Thời gian làm part này

    @Column(name = "question_count")
    private Integer questionCount = 0; // Số lượng câu hỏi

    @OneToMany(mappedBy = "testPart", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<TestPartQuestion> questions = new ArrayList<>();
}

