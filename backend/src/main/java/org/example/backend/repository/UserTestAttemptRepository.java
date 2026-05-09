package org.example.backend.repository;

import org.example.backend.entity.UserTestAttempt;
import org.example.backend.dto.response.UserTestLeaderboardResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserTestAttemptRepository extends JpaRepository<UserTestAttempt, Long> {
    List<UserTestAttempt> findByUserIdOrderByStartedAtDesc(Long userId);
    List<UserTestAttempt> findByTestIdOrderByStartedAtDesc(Long testId);

    @Query("""
            select new org.example.backend.dto.response.UserTestLeaderboardResponse(
                u.id,
                u.fullName,
                u.avatarUrl,
                coalesce(sum(coalesce(a.score, 0.0)), 0.0),
                count(a.id)
            )
            from UserTestAttempt a
            join a.user u
            where a.status = org.example.backend.enums.AttemptStatus.SUBMITTED
            group by u.id, u.fullName, u.avatarUrl
            order by coalesce(sum(coalesce(a.score, 0)), 0) desc, u.id asc
            """)
    List<UserTestLeaderboardResponse> findLeaderboard(Pageable pageable);
}

