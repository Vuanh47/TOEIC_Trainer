package org.example.backend.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class AssignTestPartQuestionsRequest {
    private List<Long> questionIds; // Danh sách question id cần thêm
}

