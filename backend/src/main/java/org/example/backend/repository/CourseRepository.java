package org.example.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.example.backend.entity.Course;
public interface CourseRepository extends JpaRepository<Course, Long> {
}
