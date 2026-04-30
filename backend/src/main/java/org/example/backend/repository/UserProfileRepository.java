package org.example.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.example.backend.entity.UserProfile;
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
}
